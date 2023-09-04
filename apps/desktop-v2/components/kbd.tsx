import { DetailedHTMLProps, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { ibmPlexMono } from "./fonts";

export const Kbd = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
) => {
  return (
    <kbd
      {...props}
      className={twMerge(
        "bg-slate-100 rounded-[5px] px-[5px] border border-zinc-400 justify-center items-center gap-2.5 inline-flex",
        ibmPlexMono.className,
        props.className
      )}
      style={{
        boxShadow: "0px 2px 0px 0px #A1A1AA",
      }}
    >
      <div className="text-center text-slate-600 text-sm leading-tight">
        {props.children}
      </div>
    </kbd>
  );
};
