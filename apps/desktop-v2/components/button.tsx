import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={twMerge(
        "px-[7px] py-[5px] bg-slate-900 hover:bg-slate-700 transition-colors rounded-[5px] justify-center items-center inline-flex text-white text-sm font-medium leading-[14px]",
        props.disabled && "opacity-50 cursor-not-allowed",
        props.className
      )}
    >
      {props.children}
    </button>
  );
};
