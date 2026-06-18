import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soul Good",
  description: "Soul Good launch capture microsite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
