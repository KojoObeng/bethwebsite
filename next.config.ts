import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Required for static export when using next/image with external URLs.
    // Cloudinary handles its own optimisation via URL parameters (f_auto,q_auto).
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
