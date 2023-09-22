import "./globals.css";
import type { Metadata } from "next";
import { manrope } from "@/components/fonts";
import { ToastClientWrapper } from "./toast-client-wrapper";

export const metadata: Metadata = {
  title: "Supernova | Today",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {/* drag region because titlebar is overlay */}
        <div
          data-tauri-drag-region="self"
          className="h-5 bg-transparent z-10 absolute top-0"
        />
        <ToastClientWrapper>{children}</ToastClientWrapper>
      </body>
    </html>
  );
}

export default RootLayout;
