import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // apply to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "connect-src 'self' ws://127.0.0.1:46630 https://algomin-symbols-fetcher-production.up.railway.app",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self'",
            ].join('; ')
          }
        ],
      },
    ];
  },
  // any other Next.js options you need:
  reactStrictMode: true,
  // ...etc.
};

export default nextConfig;
