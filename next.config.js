/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ["firebasestorage.googleapis.com", "images.unsplash.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin", "undici"],
  },
};

module.exports = nextConfig;
