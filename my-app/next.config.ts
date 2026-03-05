import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      { hostname: 'cdn.pixabay.com' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'pda7th-blog-chat-bucket.s3.ap-northeast-2.amazonaws.com' },
    ],
  },
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
