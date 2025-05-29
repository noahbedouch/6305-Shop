import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',

        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' https://trusted-scripts.com 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' https://trusted-styles.com 'unsafe-inline'",
              "img-src 'self' data:",
              "connect-src 'self' https://api.myapp.com",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          },

          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
