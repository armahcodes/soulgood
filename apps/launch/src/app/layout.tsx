import type { Metadata, Viewport } from "next";
import { EB_Garamond } from "next/font/google";
import { BRAND_NAME, NOURISHMENT, TAGLINE } from "@/lib/brand";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const SITE_TITLE = `${BRAND_NAME} — ${NOURISHMENT.headline}`;
const SITE_DESCRIPTION = `${TAGLINE}. Chef-made Soul Bowls™ by Chef Kyla. Weekly nourishment delivered Sundays across Los Angeles and Orange County, or order on demand Thursday–Sunday near Long Beach. $50 minimum; free delivery over $100.`;

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: BRAND_NAME,
  appleWebApp: { capable: true, title: "Soul Good", statusBarStyle: "default" },
  formatDetection: { telephone: false },
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
  viewportFit: "cover",
  // Matches the sticky oat header so mobile browser chrome blends into the page.
  themeColor: "#F8F3EC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ebGaramond.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
