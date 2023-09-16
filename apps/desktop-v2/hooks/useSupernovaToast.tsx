import { manrope } from "@/components/fonts";
import { ReactNode } from "react";
import { ExternalToast, toast } from "sonner";
import { twMerge } from "tailwind-merge";

const useSupernovaToast = () => {
  const makeToast = (
    message: ReactNode,
    type?: "success" | "error",
    data?: ExternalToast
  ) => {
    if (type === "success") {
      // toast.custom((t) => (
      //   <div className="flex flex-col p-2 shadow bg-white w-full rounded-md border border-gray-300">
      //     <p className={twMerge("font-medium inline-flex items-center gap-2", manrope.className)}>
      //       {data?.icon}
      //       {message}</p>
      //   </div>
      // ));
      toast.success(
        <p
          className={twMerge(
            "font-medium inline-flex items-center gap-2",
            manrope.className
          )}
        >
          {data?.icon} {message}
        </p>,
        data
      );
    } else if (type === "error") {
      toast.error(message, data);
    } else {
      toast(message, data);
    }
  };

  return { makeToast };
};

export default useSupernovaToast;
