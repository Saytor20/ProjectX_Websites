import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Basic configuration for development
  reactStrictMode: true,
  
  // Exclude foodera-site from build (it's a separate Next.js app)
  outputFileTracingExcludes: {
    '*': ['./foodera-site/**/*'],
  },
  
  // Image optimization settings
  images: {
    unoptimized: false,
    domains: [
      'images.deliveryhero.io',
      'hungerstation.com',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // TypeScript configuration - ignore errors during development
  typescript: {
    tsconfigPath: './tsconfig.json',
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // Security headers - DISABLED FOR DEVELOPMENT DEBUGGING
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    
    // Skip security headers in development to avoid blocking issues
    if (isDev) {
      return [];
    }
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' https://images.unsplash.com data:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self'",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; '),
          }
        ]
      }
    ];
  },

  // Redirects for legacy URLs  
  async redirects() {
    return [
      // Remove problematic redirect - restaurant pages should stay on /restaurant/:slug
    ];
  },
};

export default nextConfig;