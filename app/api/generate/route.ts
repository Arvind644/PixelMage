import { NextRequest, NextResponse } from 'next/server';
import { LumaAI } from 'lumaai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageUrl } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Initialize Luma AI client
    const client = new LumaAI({
      authToken: process.env.LUMAAI_API_KEY,
    });

    let generation;

    // If imageUrl is provided and valid, use image_ref
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      console.log('Using image reference:', imageUrl);

      // Create an image generation with the reference image
      generation = await client.generations.image.create({
        prompt,
        image_ref: [
          {
            url: imageUrl,
            weight: 0.7
          }
        ],
        model: "photon-1",
        aspect_ratio: "1:1"
      });
    } else {
      console.log('No valid image URL provided, using text-to-image generation');
      
      // Fallback to text-to-image generation
      generation = await client.generations.image.create({
        prompt,
        model: "photon-1",
        aspect_ratio: "1:1"
      });
    }

    console.log('Generation started with ID:', generation.id);

    return NextResponse.json({ 
      generationId: generation.id,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
} 