'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageIcon, TypeIcon } from 'lucide-react';
import Image from 'next/image';

interface FormData {
  prompt: string;
  imageUrl: string;
}

type GenerationType = 'text-to-image' | 'image-to-image';

export default function GenerationForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'polling' | 'complete' | 'error'>('idle');
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<GenerationType>('image-to-image');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  
  const watchImageUrl = watch('imageUrl');

  const startPolling = async (id: string) => {
    setGenerationStatus('polling');
    
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/status?id=${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Error checking generation status');
        }
        
        if (data.state === 'completed' && data.imageUrl) {
          clearInterval(pollInterval);
          setResultImageUrl(data.imageUrl);
          setGenerationStatus('complete');
        } else if (data.state === 'failed') {
          clearInterval(pollInterval);
          setError('Generation failed. Please try again.');
          setGenerationStatus('error');
        }
      } catch (error) {
        clearInterval(pollInterval);
        setError('Error checking generation status');
        setGenerationStatus('error');
        console.error('Error polling for generation status:', error);
      }
    }, 5000); // Poll every 5 seconds
  };

  const onSubmit = async (data: FormData) => {
    // Only validate image URL if we're doing image-to-image
    if (generationType === 'image-to-image') {
      if (!data.imageUrl) {
        setError('Please enter a valid image URL');
        return;
      }
    }

    setError(null);
    setIsGenerating(true);
    setGenerationStatus('generating');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: data.prompt,
          imageUrl: generationType === 'image-to-image' ? data.imageUrl : null,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Error generating image');
      }

      startPolling(responseData.generationId);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error generating image';
      setError(errorMessage);
      setGenerationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setGenerationType('text-to-image')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg flex items-center gap-2 ${
              generationType === 'text-to-image'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            <TypeIcon size={16} />
            Text to Image
          </button>
          <button
            type="button"
            onClick={() => setGenerationType('image-to-image')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg flex items-center gap-2 ${
              generationType === 'image-to-image'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
            }`}
          >
            <ImageIcon size={16} />
            Image to Image
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label 
            htmlFor="prompt" 
            className="block text-sm font-medium mb-2 text-white"
          >
            {generationType === 'text-to-image' 
              ? 'Describe the image you want to generate'
              : 'Describe how you want to transform your image'}
          </label>
          <textarea
            id="prompt"
            rows={3}
            placeholder={generationType === 'text-to-image'
              ? 'E.g., A serene landscape with mountains, a lake, and a sunset'
              : 'E.g., Transform this portrait into an oil painting in renaissance style'}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 text-gray-900 dark:text-white"
            {...register('prompt', { required: 'Prompt is required' })}
            disabled={isGenerating || generationStatus === 'polling'}
          />
          {errors.prompt && (
            <p className="mt-1 text-sm text-red-500">{errors.prompt.message}</p>
          )}
        </div>

        {generationType === 'image-to-image' && (
          <div>
            <label 
              className="block text-sm font-medium mb-2 text-white"
            >
              Enter image URL
            </label>
            <div>
              <input
                type="url"
                placeholder="https://example.com/your-image.jpg"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 text-gray-900 dark:text-white"
                {...register('imageUrl')}
                disabled={isGenerating || generationStatus === 'polling'}
              />
              <p className="mt-2 text-xs text-white">
                Enter a publicly accessible image URL (must start with http:// or https://)
              </p>
              
              {watchImageUrl && (
                <div className="mt-4">
                  <p 
                    className="text-sm mb-2 text-white"
                  >
                    Source Image Preview:
                  </p>
                  <div className="relative w-full h-64 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                    {watchImageUrl && (
                      <Image 
                        src={watchImageUrl}
                        alt="Source image preview"
                        fill
                        className="object-contain"
                        onError={() => {
                          const errorMsg = document.getElementById('img-error');
                          if (errorMsg) errorMsg.style.display = 'block';
                        }}
                      />
                    )}
                  </div>
                  <p id="img-error" className="text-amber-600 dark:text-amber-400 text-sm mt-2" style={{display: 'none'}}>
                    Unable to preview image. This does not necessarily mean the URL is invalid - some sites block direct embedding.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating || generationStatus === 'polling'}
          className={`w-full py-3 px-4 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
            ${(isGenerating || generationStatus === 'polling') ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {generationStatus === 'generating' || generationStatus === 'polling'
            ? 'Generating...'
            : 'Generate Image'}
        </button>
      </form>

      {resultImageUrl && (
        <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium mb-3 text-white">
            Generated Image
          </h3>
          <div className="relative w-full aspect-square rounded-md overflow-hidden">
            <Image 
              src={resultImageUrl}
              alt="Generated result"
              fill
              className="object-contain"
            />
          </div>
          <a 
            href={resultImageUrl} 
            download 
            className="mt-4 inline-block py-2 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors text-gray-900 dark:text-white"
          >
            Download Image
          </a>
        </div>
      )}

      {(generationStatus === 'generating' || generationStatus === 'polling') && (
        <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-center text-white">
            Generating your image...
          </h3>
          <p className="text-sm text-center mt-2 text-white">
            This can take a few minutes. The image will appear here when it is ready.
          </p>
        </div>
      )}
    </div>
  );
} 