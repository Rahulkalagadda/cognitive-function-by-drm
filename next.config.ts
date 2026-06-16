import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "contribution.usercontent.google.com",
      "lh3.googleusercontent.com/aida-public"
    ],
  },
};

export default withPWA(nextConfig);
