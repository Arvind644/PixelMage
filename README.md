# PixelMage - Transform Your Images with AI

PixelMage is a Next.js application that uses Luma Labs Dream Machine API for image generation and transformation. This project allows users to enter a descriptive prompt to generate new images or transform existing images by providing an image URL.

## Features

- Text-to-image generation with AI
- Image-to-image transformation using publicly accessible image URLs
- Real-time status updates during generation
- Responsive design that works on all devices
- Image preview and download capability

## Technologies Used

- Next.js 15 with App Router
- React 19
- TypeScript
- Luma Labs Dream Machine API
- react-hook-form for form handling

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Luma Labs API key (get one from [https://lumalabs.ai/dream-machine/api/keys](https://lumalabs.ai/dream-machine/api/keys))

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file with the following content:

```
# Luma Labs API Key
LUMAAI_API_KEY=your-luma-api-key-here

# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Text-to-Image
1. Select "Text to Image" mode
2. Enter a descriptive prompt for the image you want to generate
3. Click "Generate Image"
4. Wait for the image to be generated
5. View and download the generated image

### Image-to-Image
1. Select "Image to Image" mode
2. Enter a publicly accessible image URL (must start with http:// or https://)
3. Enter a descriptive prompt for how you want to transform the image
4. Click "Generate Image"
5. Wait for the image to be generated
6. View and download the generated image

## Deployment

You can deploy this application to Vercel, Netlify, or any other Next.js-compatible hosting platform.

## Important Notes

- For the image-to-image feature, you must use publicly accessible image URLs that the Luma Labs API can access.
- Remember to set up environment variables for your production deployment.

## License

MIT
