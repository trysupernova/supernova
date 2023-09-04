"use client";

// this is a task builder dialog which pops up in the center of the screen with an
// overlay
import React, { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BaseEditor,
  Editor,
  Transforms,
  createEditor,
  Text,
  NodeEntry,
  Element,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderLeafProps,
} from "slate-react";
import { Descendant } from "slate";
import { ISupernovaTask } from "../types/supernova-task";
import { DurationWidget } from "./supernova-task";
import Image from "next/image";

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
      children: [{ text: props.editingTask.originalBuildText }],
    },
  ];
  const [taskEdit, setTaskEdit] = useState(() => props.editingTask);

  const handleEditorChange = (value: Descendant[]) => {
    const content = (value[0] as any).children[0].text as string;
    const extract = extractExpectedDuration(content);
    let duration: number | undefined = undefined;
    let newTitle = content;
    if (extract !== null) {
      const { unit, value: durationParsed } = extract;
      if (unit === "m") {
        duration = durationParsed * 60;
      } else if (unit === "h") {
        duration = durationParsed * 60 * 60;
      }
      newTitle =
        content.slice(0, extract.match.index) +
        content.slice(extract.match.index + extract.match[0].length);
    }

    setTaskEdit((prev) => ({
      ...prev,
      expectedDurationSeconds: duration,
      originalBuildText: content,
      title: newTitle,
    }));
    // clear any current errors until the submission is wrong again
    setError(undefined);
  };

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

  // extract the expected duration and unit from the text
  const extractExpectedDuration = (
    text: string
  ): { value: number; unit: "m" | "h"; match: RegExpExecArray } | null => {
    const expectedDurationRegex =
      /\bfor\s*(\d+)\s*(?:(mins?|m|minutes?)|(hours?|hrs?|h))\s*\b\s*/gi;
    const match = expectedDurationRegex.exec(text);
    if (match === null) {
      return null;
    }
    const expectedDuration = match[1];
    const unit = match[2] || match[3];
    if (unit?.startsWith("m")) {
      // minutes
      return { value: parseInt(expectedDuration), unit: "m", match };
    } else if (unit?.startsWith("h")) {
      // hours
      return { value: parseInt(expectedDuration), unit: "h", match };
    }
    return null;
  };

  // for applying styling
  const decorate = useCallback(([node, path]: NodeEntry) => {
    const startAtRegex =
      /\b(?:start at|at|from)\s+(\d{1,2}(?::\d{2})?(?:[APap][Mm]?)?)\b/gi;
    const ranges: any[] = [];
    const rangesStartAt = createRangesFromRegex(
      startAtRegex,
      startAtType
    )([node, path]);
    if (rangesStartAt.length > 0) {
      ranges.push(...rangesStartAt);
    }

    const expectedDurationRegex =
      /\bfor\s*(\d+)\s*(?:(mins?|m|minutes?)|(hours?|hrs?|h))\s*\b\s*/gi;
    const rangesExpectedDuration = createRangesFromRegex(
      expectedDurationRegex,
      expectedDurationType
    )([node, path]);
    if (rangesExpectedDuration.length > 0) {
      ranges.push(...rangesExpectedDuration);
    }
    return ranges;
  }, []);

  const createRangesFromRegex =
    (regex: RegExp, type: string) =>
    ([node, path]: NodeEntry): any[] => {
      const ranges: any[] = [];
      let match: RegExpExecArray | null = null;
      if (Text.isText(node)) {
        const { text } = node;
        match = regex.exec(text);
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
              <div className="flex items-center gap-2 flex-wrap">
                {taskEdit.expectedDurationSeconds !== undefined && (
                  <DurationWidget
                    expectedDurationSeconds={taskEdit.expectedDurationSeconds}
                  />
                )}
              </div>

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
      className={`inline-flex items-center gap-1 ${
        (props.leaf as any)[startAtType]
          ? "text-cyan-600"
          : (props.leaf as any)[expectedDurationType]
          ? "text-green-600"
          : "black"
      }`}
    >
      {(props.leaf as any)[startAtType] && (
        <Image
          src="/icons/clock-cyan.svg"
          alt="Play green icon"
          width={13}
          height={13}
          className="ml-[2px]"
        />
      )}
      {(props.leaf as any)[expectedDurationType] && (
        <Image
          src="/icons/play-green.svg"
          alt="Play green icon"
          width={13}
          height={13}
          className="ml-[2px]"
        />
      )}
      {props.children}
    </span>
  );
};
