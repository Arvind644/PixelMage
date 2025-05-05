import GenerationForm from './components/GenerationForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
            PixelMage
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Transform your images with AI-powered creative enhancements
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">
            Create new images from text or transform existing images using publicly available image URLs
          </p>
        </header>
        
        <main className="bg-white dark:bg-gray-850 shadow-xl rounded-xl p-6 md:p-8">
          <GenerationForm />
        </main>
        
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Luma Labs Dream Machine API &amp; Next.js</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} PixelMage. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
