import type { Metadata } from "next";
import { Playfair_Display, Lora, Inter } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Soul Good | Made with Intention. Seasoned with Love.",
  description:
    "Premium wellness food by Chef Kyla — Southern soul food meets functional healing nutrition. Chef-crafted meal plans delivered to your door in Los Angeles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${lora.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  );
}
