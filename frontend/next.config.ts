import type { NextConfig } from "next";

const nextConfig: any = { // Change 'NextConfig' to 'any' here
  experimental: {
    allowedDevOrigins: ['http://192.168.56.1:3000', 'http://localhost:3000'],
  },
};

export default nextConfig;