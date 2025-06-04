import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vinyl Collection",
  description: "Simple vinyl viewer",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
