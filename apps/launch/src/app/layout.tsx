import type { Metadata, Viewport } from "next";
import { EB_Garamond } from "next/font/google";
import { TAGLINE } from "@/lib/brand";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const SITE_TITLE = "Soul Good — Find Your Pathway";
const SITE_DESCRIPTION = `${TAGLINE}. Discover your Soul Good pathway and become a Founding Member of our capped launch cohort.`;

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Soul Good",
  openGraph: {
    type: "website",
    siteName: "Soul Good",
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
