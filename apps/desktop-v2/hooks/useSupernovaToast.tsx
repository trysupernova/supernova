import { ReactNode } from "react";
import { ExternalToast, toast } from "sonner";

export const useSupernovaToast = () => {
  const makeToast = (
    message: ReactNode,
    type?: "success" | "error",
    data?: ExternalToast
  ) => {
    if (type === "success") {
      toast.success(message, data);
    } else if (type === "error") {
      toast.error(message, data);
    } else {
      toast(message, data);
    }
  };

  return { makeToast };
};
