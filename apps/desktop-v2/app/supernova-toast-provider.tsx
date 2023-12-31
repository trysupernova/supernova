"use client";

import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

export const SupernovaToastProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <>
      <Toaster richColors position="top-center" />
      {children}
    </>
  );
};
