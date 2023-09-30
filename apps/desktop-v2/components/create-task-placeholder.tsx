import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Kbd } from "./kbd";

export const CreateTaskPlaceholder = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      {...props}
      className={twMerge(
        "w-full max-w-xl group inline-flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-900 border-t border-t-gray-200 hover:opacity-80 transition px-2 py-1 rounded-sm",
        props.className
      )}
    >
      <PlusCircledIcon className="group-hover:text-white group-hover:bg-teal-600 rounded-full text-gray-300" />
      <p className="text-gray-300 group-hover:text-teal-600">Create task</p>
      <Kbd>c</Kbd>
    </button>
  );
};
