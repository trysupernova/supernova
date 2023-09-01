"use client";

import Image from "next/image";
import { H1 } from "./typography";

export const HorizontalLogo = () => {
  return (
    <div className="flex items-center justify-center gap-[10px] py-[10px]">
      <Image
        src="/logo.svg"
        width={50}
        height={50}
        priority
        alt="Supernova's logo, a ball with linear gradient from left to right, light teal to orange"
      />
      <H1>Supernova</H1>
    </div>
  );
};

export default HorizontalLogo;
