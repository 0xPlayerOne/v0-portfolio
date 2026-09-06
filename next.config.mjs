import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudflare Workers has no Next.js Image Optimization endpoint
    // (no `/_next/image` handler), so images must be served as-is.
    unoptimized: true,
  },
  // Remove `X-Powered-By: Next.js` — minor information disclosure.
  poweredByHeader: false,
  experimental: {
    // Tree-shake lucide-react barrel imports (each icon is a separate
    // chunk). Turbopack already optimizes this, but webpack builds still
    // benefit and the option is harmless under Turbopack.
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
