/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  typescript: {
    // !! WARN !!
    // Ignoring TypeScript errors for production builds
    // This is not recommended unless you know what you're doing
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARN !!
    // Ignoring ESLint errors for production builds
    // This is not recommended unless you know what you're doing
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig; 