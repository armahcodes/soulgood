import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return process.env.SOULGOOD_LEGACY_PREVIEW === "true"
      ? []
      : [
          {
            source: "/:path*",
            destination: "https://www.soulgood.kitchen/",
            permanent: false,
          },
        ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
