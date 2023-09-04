import React, { ReactNode, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../components/button";
import { Kbd } from "../components/kbd";
import Mousetrap from "mousetrap";

export const AlertDialog = ({
  description,
  open,
  setOpen,
  handleSubmit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  description: ReactNode;
  handleSubmit: () => void;
}) => {
  useEffect(() => {
    Mousetrap.bind("enter", (e) => {
      e.preventDefault();
      handleSubmit();
      setOpen(false);
    });
    return () => {
      Mousetrap.unbind("enter");
    };
  }, [handleSubmit, setOpen]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={`bg-gray-400 opacity-50 fixed inset-0`} />
        <Dialog.Content
          className={`bg-white p-3 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none`}
        >
          <div className="flex flex-col">{description}</div>
          <div className="flex justify-end">
            <Button className="gap-1 pb-2 bg-red-600" onClick={handleSubmit}>
              Submit
              <Kbd>↵</Kbd>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
