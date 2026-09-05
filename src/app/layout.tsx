import type { Metadata } from "next";
import { Playfair_Display, Lora, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
      <body className="min-h-screen flex flex-col antialiased">
        <aside className="bg-black px-5 py-4 text-center text-sm text-white">
          Archived design preview. Forms and purchases are disabled.{" "}
          <a className="underline" href="https://www.soulgood.kitchen/">
            Visit the live store
          </a>
          .
        </aside>
        <fieldset disabled className="contents">
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </fieldset>
      </body>
    </html>
  );
}
