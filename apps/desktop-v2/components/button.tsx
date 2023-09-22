import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  bgVariant?: "black" | "white";
};

export const Button = ({ bgVariant = "black", ...props }: Props) => {
  return (
    <button
      {...props}
      className={twMerge(
        "px-[7px] py-[5px] transition-colors rounded-[5px] justify-center items-center inline-flex text-sm font-medium leading-[14px]",
        props.disabled && "opacity-50 cursor-not-allowed",
        bgVariant === "white"
          ? "bg-white text-black hover:bg-slate-300"
          : "bg-slate-900 hover:bg-slate-700 text-white",
        props.className
      )}
    >
      {props.children}
    </button>
  );
};
