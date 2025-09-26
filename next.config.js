/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC and use Babel instead for WebContainer compatibility
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  compiler: {
    // Disable SWC compiler
    removeConsole: false,
  },
  // Optimize for WebContainer environment
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache in development to avoid worker issues
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  // Reduce build parallelism to avoid Jest worker issues
  experimental: {
    forceSwcTransforms: false,
    cpus: 1,
    workerThreads: false,
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    forceSwcTransforms: false,
  }
};

module.exports = nextConfig;