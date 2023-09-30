import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";

export const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={twMerge(
        `h-4 w-4 shrink-0 rounded-sm border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-700 shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
          props.checked &&
          "bg-green-400 dark:bg-green-600 data-[state=checked]:text-white"
        }`,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={"flex items-center justify-center text-current"}
      >
        {props.checked && (
          <CheckIcon className="h-full w-full data-[state=checked]:visible" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
CustomCheckbox.displayName = CheckboxPrimitive.Root.displayName;
