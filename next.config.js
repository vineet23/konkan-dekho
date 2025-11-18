/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ["firebasestorage.googleapis.com", "images.unsplash.com"],
  },
};

module.exports = nextConfig;
