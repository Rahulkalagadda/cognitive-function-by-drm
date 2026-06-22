
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
  async rewrites() {
    // Proxy API calls through Next.js to avoid mixed content.
    // Browser → Vercel (HTTPS) → Railway (server-to-server, no CORS/mixed content)
    const backendBase =
      process.env.BACKEND_URL ||
      "http://localhost:8000";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendBase}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
