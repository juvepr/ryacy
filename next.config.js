/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Add this line
    distDir: 'build',
    images: {
      unoptimized: true  // Add this line
    },
  };
  
  module.exports = nextConfig;