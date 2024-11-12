/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    images: {
      unoptimized: true  // Add this line
    },
  };
  
  module.exports = nextConfig;