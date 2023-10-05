import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import Mousetrap from "mousetrap";
import React from "react";
import { Kbd } from "./kbd";
import { SupernovaCommand } from "../types/command";
import { ISupernovaTask } from "@supernova/types";
import { twMerge } from "tailwind-merge";
import { ibmPlexMono } from "./fonts";
import { SupernovaGlobeLogoImage } from "./icons";

export const SupernovaCommandCenter = ({
  commands,
  context,
}: {
  commands: SupernovaCommand[];
  context: {
    chosenTask: ISupernovaTask | null;
  };
}) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // open the menu when ⌘K is pressed
    const down = (e: Mousetrap.ExtendedKeyboardEvent) => {
      e.preventDefault();
      setOpen((open) => !open);
    };

    Mousetrap.bind("mod+k", down);
    return () => {
      Mousetrap.unbind("mod+k");
    };
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={`bg-gray-400 dark:bg-zinc-950 opacity-70 fixed inset-0`}
        />
        <Dialog.Content
          className={`data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none`}
        >
          <Command className="bg-white dark:bg-zinc-800 rounded-lg p-4 flex flex-col gap-2">
            {context.chosenTask !== undefined &&
              context.chosenTask !== null && (
                <div>
                  <p
                    className={twMerge(
                      "text-xs text-slate-300",
                      ibmPlexMono.className
                    )}
                  >
                    {">"}{" "}
                    {context.chosenTask
                      ? '"' + context.chosenTask.title + '"'
                      : "No task selected"}
                  </p>
                </div>
              )}
            <div className="flex items-center gap-2">
              <SupernovaGlobeLogoImage width={20} height={20} priority />
              <Command.Input
                placeholder="Find a command..."
                className="outline-none bg-transparent"
                autoFocus
              />
            </div>
            <Command.Separator alwaysRender className="h-[1px] bg-gray-300" />
            <Command.List className="flex flex-col gap-2">
              <Command.Empty className="text-slate-300 text-center">
                No results found.
              </Command.Empty>

              {commands.map((command) => (
                <Command.Item
                  key={command.label}
                  className=" data-[selected='true']:bg-slate-100 dark:data-[selected='true']:bg-zinc-900 data-[selected='true']:cursor-pointer flex items-center gap-2 justify-between hover:bg-slate-200 rounded-md px-2 py-1"
                  onSelect={() => {
                    setOpen(false);
                    command.cb();
                  }}
                >
                  <p>{command.label}</p>
                  {Array.isArray(command.shortcut) ? (
                    <div className="flex items-center gap-2">
                      {command.shortcut.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </div>
                  ) : (
                    <Kbd>{command.shortcut}</Kbd>
                  )}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
