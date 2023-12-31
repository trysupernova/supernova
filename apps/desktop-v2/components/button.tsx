import useUserSettings from "@/hooks/useUserSettings";
import { useTheme } from "next-themes";
import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  bgVariant?: "black" | "white" | "red" | "ghost";
};

export const Button = ({ bgVariant, ...props }: Props) => {
  const { theme } = useTheme();
  const { systemAppearance } = useUserSettings();
  // if not set, set bgVariant based on theme and system appearance
  if (bgVariant === undefined) {
    if (theme === "dark") {
      bgVariant = "white";
    } else if (theme === "light") {
      bgVariant = "black";
    } else {
      if (systemAppearance === "dark") {
        bgVariant = "white";
      } else {
        bgVariant = "black";
      }
    }
  }
  return (
    <button
      {...props}
      className={twMerge(
        "px-[7px] py-[5px] transition-colors rounded-[5px] justify-center items-center inline-flex text-sm font-medium leading-[14px]",
        props.disabled && "opacity-50 cursor-not-allowed",
        bgVariant === "white" && "bg-white text-black hover:bg-slate-300",
        bgVariant === "ghost" &&
          "bg-transparent dark:hover:bg-zinc-700 hover:bg-zinc-200",
        bgVariant === "black" && "bg-slate-900 hover:bg-slate-700 text-white",
        bgVariant === "red" && "bg-red-500 hover:bg-red-700",
        props.className
      )}
    >
      {props.children}
    </button>
  );
};
