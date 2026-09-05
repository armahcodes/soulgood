import type { NextConfig } from "next";

const squareContentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://*.squarecdn.com https://pay.google.com/gp/p/js/pay.js`,
  "frame-src 'self' https://*.squarecdn.com https://*.visa.com https://*.cardinalcommerce.com https://pay.google.com",
  "connect-src 'self' https://*.squarecdn.com https://pci-connect.squareup.com https://pci-connect.squareupsandbox.com https://o160250.ingest.sentry.io https://google.com/pay",
  "style-src 'self' 'unsafe-inline' https://*.squarecdn.com https://fonts.googleapis.com",
  "font-src 'self' https://*.squarecdn.com https://d1g145x70srn7h.cloudfront.net https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.squarecdn.com https://www.gstatic.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.visa.com https://*.cardinalcommerce.com",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: squareContentSecurityPolicy,
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
