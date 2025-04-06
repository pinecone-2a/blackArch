const nextConfig = {
  reactStrictMode: true,
  images: {
<<<<<<< HEAD
    domains: [
      "cdnp.cody.mn",
      "s3-alpha-sig.figma.com",
      "encrypted-tbn0.gstatic.com",
      "freshcleantees.com",
      "res.cloudinary.com",
=======
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
>>>>>>> main
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
