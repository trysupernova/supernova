import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Supernova",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {/* drag region because titlebar is overlay */}
        <div data-tauri-drag-region="self" className="h-5" />
        {children}
      </body>
    </html>
  );
}
