import type { NextConfig } from 'next'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    turbopack: {
      root: __dirname,
    },
  },
} as NextConfig

export default nextConfig
