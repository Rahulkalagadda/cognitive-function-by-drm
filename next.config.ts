
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "contribution.usercontent.google.com",
      "lh3.googleusercontent.com/aida-public"
    ],
  },
};

export default nextConfig;
