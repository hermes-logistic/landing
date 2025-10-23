/** @type {import('next').NextConfig} */
const nextConfig = {
  // Improve error handling and stability
  experimental: {
    // Reduce chunk splitting to avoid missing function errors
    optimizePackageImports: ['@formatjs/intl-localematcher', 'negotiator'],
  },
  // Add fallback for server-side rendering errors
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure proper handling of intl polyfills
      const externals = config.externals || []
      externals.push({
        intl: 'intl',
      })
      return { ...config, externals }
    }
    return config
  },
  // Improve production build stability
  swcMinify: true,
  // Add error boundaries for better error handling
  poweredByHeader: false,
}

module.exports = nextConfig
