import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = React.DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input = (props: Props) => {
  return (
    <input
      {...props}
      className={twMerge(
        "text-base leading-6 text-white border border-solid border-zinc-500 bg-zinc-700 px-[7px] py-[3px] rounded-md placeholder:text-zinc-500 focus:outline focus:outline-teal-400 focus:outline-2 focus:border-none",
        props.className
      )}
    />
  );
};
