import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // 👈 ADD THIS: Permits any directory structure from Cloudinary
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/v1/files/**",
      },
    ],
  },
};

export default nextConfig;
