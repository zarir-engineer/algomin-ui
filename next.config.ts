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
              // allow WebSocket connections to your API hosts
              "connect-src 'self' ws://127.0.0.1:8000 wss://algomin-ui-production.up.railway.app",
              "script-src 'self'",
              "style-src 'self' 'unsafe-inline'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  // any other Next.js options you need:
  reactStrictMode: true,
  // ...etc.
};

export default nextConfig;
