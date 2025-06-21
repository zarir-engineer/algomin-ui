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
              "connect-src 'self' wss://algomin-backend.up.railway.app ws://127.0.0.1:46630",
              // you can also add other directives here as needed
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

/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SYMBOLS_URL: process.env.NEXT_PUBLIC_SYMBOLS_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
};

export default nextConfig;
