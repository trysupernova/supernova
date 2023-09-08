"use client";

import Link from "next/link";
import HorizontalLogo from "../../components/horizontal-logo";
import { Manrope } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { Button } from "../../components/button";
import { BsDownload } from "react-icons/bs";
import { H2 } from "@/components/typography";

const manrope = Manrope({ subsets: ["latin"] });

const DownloadPage = () => {
  const darwinURL =
    "https://github.com/trysupernova/supernova/releases/download/v0.1.0/Supernova_0.1.0_aarch64.dmg";
  const x64url =
    "https://github.com/trysupernova/supernova/releases/download/v0.1.0/Supernova_0.1.0_x64.dmg";

  return (
    <main
      className={twMerge(
        "h-screen flex flex-col items-center justify-center gap-4 bg-dark-teal-gradient",
        manrope.className
      )}
    >
      <Link href="/">
        <HorizontalLogo />
      </Link>

      <div className="flex flex-col items-center justify-center gap-3">
        <H2>Download</H2>
        <hr className="w-4" />
        <div className="flex items-center gap-3">
          <Link href={darwinURL} target="_blank">
            <Button className="gap-2">
              <BsDownload />
              Mac M1
            </Button>
          </Link>
          <Link href={x64url} target="_blank">
            <Button className="gap-2">
              <BsDownload />
              Mac Intel
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};
export default DownloadPage;
