import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cdnp.cody.mn",
      "s3-alpha-sig.figma.com",
      "encrypted-tbn0.gstatic.com",
      "freshcleantees.com", 
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
