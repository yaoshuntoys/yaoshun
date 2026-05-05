import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/sitemap/",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/:locale/company",
        destination: "/:locale/about",
        permanent: true,
      },
      {
        source: "/:locale/factory",
        destination: "/:locale/about",
        permanent: true,
      },
      {
        source: "/:locale/compliance",
        destination: "/:locale/about",
        permanent: true,
      },
      {
        source: "/:locale/oem-odm",
        destination: "/:locale/solutions",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 92],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "s.alicdn.com",
      },
    ],
  },
};

export default nextConfig;
