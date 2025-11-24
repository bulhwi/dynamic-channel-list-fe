import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // styled-components SSR support
  compiler: {
    styledComponents: true,
  },

  // Experimental features for Next.js 15
  experimental: {
    // Enable if needed in the future
  },
}

export default nextConfig
