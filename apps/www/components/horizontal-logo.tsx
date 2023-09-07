"use client";

import Image from "next/image";
import { H3 } from "./typography";

export const HorizontalLogo = () => {
  return (
    <div className="flex items-center justify-center gap-[10px] py-[10px]">
      <Image
        src="/logo.svg"
        width={30}
        height={30}
        priority
        alt="Supernova's logo, a ball with linear gradient from left to right, light teal to orange"
      />
      <H3>Supernova</H3>
    </div>
  );
};

export default HorizontalLogo;
