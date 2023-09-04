"use client";

// this is a task builder dialog which pops up in the center of the screen with an
// overlay
import React, { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
// Import the Slate editor factory.
import {
  BaseEditor,
  Editor,
  Transforms,
  createEditor,
  Element,
  Location,
  Text,
  NodeEntry,
} from "slate";
// Import the Slate components and React plugin.
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
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

const startAtType = "startAt";
const expectedDurationType = "expectedDuration";

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

  // for applying styling
  const decorate = useCallback(([node, path]: NodeEntry) => {
    const ranges: any[] = [];

    const startAtRegex =
      /\b(?:start at|at|from)\s+(\d{1,2}(?::\d{2})?(?:[APap][Mm]?)?)\b/g;
    const expectedDurationRegex =
      /\bfor\s*(\d+)\s*(?:mins?|m|hours?|hrs?|hr|h)\b/g;

    const rangesStartAt = createRangesFromRegex(
      startAtRegex,
      startAtType
    )([node, path]);
    ranges.push(...rangesStartAt);
    const rangesExpectedDuration = createRangesFromRegex(
      expectedDurationRegex,
      expectedDurationType
    )([node, path]);
    ranges.push(...rangesExpectedDuration);
    return ranges;
  }, []);

  const createRangesFromRegex =
    (regex: RegExp, type: string) =>
    ([node, path]: NodeEntry) => {
      const ranges: any[] = [];
      if (Text.isText(node)) {
        const { text } = node;
        const match = regex.exec(text);
        // need a match to continue
        if (!match) {
          return [];
        }
        const matchedSubstr = match[0];
        // basically everything before this is the search string
        ranges.push({
          anchor: { path, offset: match.index },
          focus: { path, offset: match.index + matchedSubstr.length },
          [type]: true,
        });
      }

      return ranges;
    };

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  // move to the end of the editor when it is opened
  useEffect(() => {
    if (props.isOpen) {
      const path = [0, 0];
      const end = Editor.end(editor, path);
      Transforms.select(editor, end);
    }
  }, [editor, props.isOpen]);

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
                  decorate={decorate}
                  className="outline-none"
                  placeholder="Describe your task with just English."
                  autoFocus
                  onKeyDown={handleKeyDownEditor}
                  renderLeaf={renderLeaf}
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

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      className={`${
        (props.leaf as any)[startAtType]
          ? "text-cyan-600"
          : (props.leaf as any)[expectedDurationType]
          ? "text-green-600"
          : "black"
      }`}
    >
      {props.children}
    </span>
  );
};
