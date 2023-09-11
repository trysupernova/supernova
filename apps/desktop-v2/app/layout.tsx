import { withAuth } from "@/hocs/withAuth";
import "./globals.css";
import type { Metadata } from "next";
import { manrope } from "@/components/fonts";

export const metadata: Metadata = {
  title: "Supernova",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
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

export default RootLayout;
