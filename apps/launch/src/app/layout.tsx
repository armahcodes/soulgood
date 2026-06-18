import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import { TAGLINE } from "@/lib/brand";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  title: "Soul Good — Find Your Pathway",
  description: `${TAGLINE}. Discover your Soul Good pathway and become a Founding Member.`,
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
