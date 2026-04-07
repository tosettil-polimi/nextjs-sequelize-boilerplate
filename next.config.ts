import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  reactStrictMode: false,
  // For standalone builds
  output: 'standalone',
  experimental: {
    // Proxy client max body size
    proxyClientMaxBodySize: '60mb',
    // Server actions body size limit
    serverActions: {
      bodySizeLimit: '60mb',
    },
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] } // Keep error and warn in prod
        : false, // Keep everything in dev
  },
  images: {
    remotePatterns: [
      // Add your remote image patterns here if needed
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/images/**',
      // },
    ],
  },
};

// Sentry configuration - customize with your own org and project
// Make sure to set SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT env variables
module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only print logs for uploading source maps in CI
  // Set to `true` to suppress logs
  silent: !process.env.CI,
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  // Pass the auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
});
