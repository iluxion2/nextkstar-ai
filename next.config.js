/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'nextkstar.com', 'nextkstar-backend.onrender.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://nextkstar-backend.onrender.com',
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
  // Add experimental features for better compatibility
  experimental: {
    esmExternals: false,
  },
  // Ensure proper static export
  distDir: 'out',
}

module.exports = nextConfig 