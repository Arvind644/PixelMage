import GenerationForm from './components/GenerationForm';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute left-0 top-0">
          <Image 
            src="/buildclub-long.png" 
            alt="Build Club Logo" 
            width={150} 
            height={30} 
            className="h-auto"
          />
        </div>
        <header className="text-center mb-12 pt-16">
          <h1 
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3"
          >
            PixelMage
          </h1>
          <p 
            className="text-lg text-black dark:text-gray-300 max-w-xl mx-auto" 
          >
            Transform your images with AI-powered creative enhancements
          </p>
          <p 
            className="text-sm text-black dark:text-gray-300 mt-2 max-w-lg mx-auto"
          >
            Create new images from text or transform existing images using publicly available image URLs
          </p>
        </header>
        
        <main className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 md:p-8">
          <GenerationForm />
        </main>
        
        <footer className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Powered by Luma Labs &amp; Next.js</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} <a href="https://buildclub.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">Build Club</a>. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
