import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.cdn-luma.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
