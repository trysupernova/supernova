import "./globals.css";
import type { Metadata } from "next";
import { manrope } from "@/components/fonts";
import { SupernovaToastProvider } from "./supernova-toast-provider";
import { ThemeProvider } from "./theme-provider";

export const metadata: Metadata = {
  title: "Supernova | Today",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  const isDesktop = process.env.TAURI_PLATFORM !== undefined; // because this means it's local maybe; TODO: check if this is the case
  return (
    <html lang="en">
      <body className={manrope.className}>
        {/* drag region because titlebar is overlay */}
        {isDesktop && (
          <div
            data-tauri-drag-region="self"
            className="h-7 bg-transparent border-b border-gray-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-900"
          />
        )}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupernovaToastProvider>{children}</SupernovaToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
