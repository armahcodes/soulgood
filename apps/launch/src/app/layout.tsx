import type { Metadata, Viewport } from "next";
import { EB_Garamond } from "next/font/google";
import { BRAND_NAME, TAGLINE } from "@/lib/brand";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const SITE_TITLE = `${BRAND_NAME} — Five Chef-Made Bowls for $88/Week`;
const SITE_DESCRIPTION = `${TAGLINE}. Five fresh, chef-made bowls every Sunday for $88/week, with pickup or Los Angeles County delivery.`;

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: BRAND_NAME,
  openGraph: {
    type: "website",
    siteName: BRAND_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // og:image is optional and graceful — none is supplied for the launch.
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2C3A34",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ebGaramond.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
