import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Handle trailing slashes consistently
  trailingSlash: false,
  
  images: {
    unoptimized: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Redirect handling for double slashes and trailing slashes
  async redirects() {
    return [
      // Handle double slashes in URLs (except for protocol://)
      {
        source: '/(.*)//(.*)',
        destination: '/$1/$2',
        permanent: true,
      },
      // Remove trailing slashes for all routes except root
      {
        source: '/((?!$).*?)/',
        destination: '/$1',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
