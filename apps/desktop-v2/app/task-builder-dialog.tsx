"use client";

// this is a task builder dialog which pops up in the center of the screen with an
// overlay
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
// Import the Slate editor factory.
import { BaseEditor, Transforms, createEditor } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { Descendant } from "slate";
import { ISupernovaTask } from "../types/supernova-task";

type CustomElement = { type: "paragraph" | string; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export const TaskBuilderDialog = (props: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask: ISupernovaTask;
  onSubmit?: (task: ISupernovaTask) => void;
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [editor] = useState(() => withReact(createEditor()));
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: props.editingTask.title }],
    },
  ];
  const [taskEdit, setTaskEdit] = useState(props.editingTask);

  const handleKeyDownEditor = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      // submit instead
      if (props.onSubmit !== undefined) {
        // validate the task field; should not be empty
        if (taskEdit.title === "") {
          setError("Task title cannot be empty.");
          e.preventDefault(); // prevent newlines into the task builder
          e.stopPropagation(); // so that it doesn't bubble up to the page
          return;
        }
        props.onSubmit(taskEdit);
      }
      e.preventDefault(); // prevent newlines into the task builder
      e.stopPropagation(); // so that it doesn't bubble up to the page
      props.onOpenChange(false); // close the dialog
    }
    if (e.key === "Escape") {
      props.onOpenChange(false); // close the dialog
      // clear the editor
      Transforms.delete(editor, { at: [0, 0], distance: 1, unit: "line" });
      e.preventDefault(); // prevent typing into the task builder
      e.stopPropagation(); // so that it doesn't bubble up to the page
    }
  };

  const handleEditorChange = (value: Descendant[]) => {
    const content = (value[0] as any).children[0].text as string;
    setTaskEdit((prev) => ({
      ...prev,
      title: content,
    }));
    // clear any current errors until the submission is wrong again
    setError(undefined);
  };

  return (
    <Dialog.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={`bg-gray-400 opacity-50 fixed inset-0`} />
        <Dialog.Content
          className={`date-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none`}
        >
          <div className="w-full h-full px-3 py-2.5 bg-white rounded-[10px] shadow border border-gray-300 justify-start items-start gap-2.5 flex">
            <div className="w-[25px] h-[25px] relative">
              <div className="w-[25px] h-[25px] left-0 top-[25px] absolute origin-top-left -rotate-90 bg-gradient-to-b from-cyan-400 via-orange-200 to-rose-500 rounded-full" />
            </div>
            <div className="grow shrink basis-0 overflow-x-clip flex flex-col gap-2">
              <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={handleEditorChange}
              >
                <Editable
                  className="outline-none"
                  placeholder="Describe your task with pure English."
                  autoFocus
                  onKeyDown={handleKeyDownEditor}
                />
              </Slate>
              {error !== undefined && (
                <p className="text-red-500 text-xs font-medium leading-[10px]">
                  {error}
                </p>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
