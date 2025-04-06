const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdnp.cody.mn",
      "s3-alpha-sig.figma.com",
      "encrypted-tbn0.gstatic.com",
      "freshcleantees.com",
      "res.cloudinary.com",
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
