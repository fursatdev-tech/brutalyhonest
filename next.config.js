/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.muscache.com",
      },
      {
        protocol: "https",
        hostname: "**.bstatic.com",
      },
      {
        protocol: "https",
        hostname: "**.google.com",
      },
      {
        protocol: "https",
        hostname: "**.imgix.net",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.pexels.com",
      },
      {
        protocol: "https",
        hostname: "brutalyhonest.ai",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "**.brutalyhonest.ai",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 60,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  staticPageGenerationTimeout: 1000,
};

module.exports = nextConfig;
