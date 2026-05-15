import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    // AVIF ~50% lebih kecil dari WebP, WebP ~30% lebih kecil dari JPEG
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    // Batasi ukuran gambar yang di-generate — cukup untuk kebutuhan blog
    deviceSizes: [375, 640, 750, 828, 1080],
    imageSizes: [16, 32, 64, 96, 128, 256],
  },

  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.{jpg,jpeg,png,gif,webp,svg,ico}',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ]
  },

  compress: true,

  // Kurangi ukuran bundle dengan tidak include polyfill yang tidak perlu
  experimental: {
    optimizePackageImports: ['date-fns', 'firebase'],
  },
}

export default nextConfig
