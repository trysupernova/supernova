import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { manrope } from "../app/layout";

export const Button = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={twMerge(
      "flex justify-center items-center py-[9px] px-[7px] rounded-[5px] bg-white border border-slate-200 text-black leading-3 font-medium hover:bg-slate-100",
      manrope.className,
      props.className
    )}
  >
    {children}
  </button>
);
