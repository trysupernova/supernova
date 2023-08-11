import { Metadata } from "next";
import "./globals.css";
import { inter } from "../components/font";

export const metadata: Metadata = {
  title: "Supernova | the open-sourced superhuman productivity experience",
  description:
    "The fastest productivity app, packed with integrations and robust features, all open-source.",
  keywords: ["productivity", "app", "open-source", "software", "oss"],
  metadataBase: new URL("https://trysupernova.one"),
  openGraph: {
    type: "website",
    siteName: "Supernova",
    title: "Supernova | the open-sourced superhuman productivity experience",
    description:
      "The fastest productivity app, packed with integrations and robust features, all open-source.",
    images: [
      { alt: "Social preview image of Supernova", url: "/landing-horiz.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
