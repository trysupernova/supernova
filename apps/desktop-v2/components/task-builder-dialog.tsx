"use client";

// this is a task builder dialog which pops up in the center of the screen with an
// overlay
import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  BaseEditor,
  Editor,
  Transforms,
  createEditor,
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
import { DurationWidget, StartTimeWidget } from "./supernova-task";
import Image from "next/image";
import {
  extractExpectedDuration,
  START_AT_SLATE_TYPE,
  getCbRangesFromRegex,
  EXP_DUR_SLATE_TYPE,
  extractStartAt,
} from "../utils/supernova-task";
import { Kbd } from "./kbd";
import { Button } from "./button";
import { twMerge } from "tailwind-merge";
import { ibmPlexMono } from "./fonts";

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
  mode: "edit" | "create";
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
    const extractedDuration = extractExpectedDuration(content);
    let duration: number | undefined = undefined;
    let newTitle = content;
    if (extractedDuration !== null) {
      const { unit, value: durationParsed } = extractedDuration;
      if (unit === "m") {
        duration = durationParsed * 60;
      } else if (unit === "h") {
        duration = durationParsed * 60 * 60;
      }
      newTitle =
        content.slice(0, extractedDuration.match.index) +
        content.slice(
          extractedDuration.match.index + extractedDuration.match[0].length
        );
    }
    const extractedStartAt = extractStartAt(newTitle);
    let startTime: Date | undefined = undefined;
    if (extractedStartAt !== null) {
      startTime = extractedStartAt.value;
      newTitle =
        newTitle.slice(0, extractedStartAt.match.index) +
        newTitle.slice(
          extractedStartAt.match.index + extractedStartAt.match[0].length
        );
    }

    setTaskEdit((prev) => ({
      ...prev,
      expectedDurationSeconds: duration,
      originalBuildText: content,
      title: newTitle,
      startTime,
    }));
    // clear any current errors until the submission is wrong again
    setError(undefined);
  };

  const handleSubmit = () => {
    // submit instead
    if (props.onSubmit !== undefined) {
      // validate the task field; should not be empty
      if (taskEdit.title === "") {
        setError("Task title cannot be empty.");
        return;
      }
      props.onSubmit(taskEdit);
    }
    props.onOpenChange(false); // close the dialog
  };

  const handleKeyDownEditor = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent newlines into the task builder
      e.stopPropagation(); // so that it doesn't bubble up to the page
      // submit instead
      handleSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault(); // prevent typing into the task builder
      e.stopPropagation(); // so that it doesn't bubble up to the page
      props.onOpenChange(false); // close the dialog
      // clear the editor
      Transforms.delete(editor, { at: [0, 0], distance: 1, unit: "line" });
    }
  };

  // for applying styling
  const decorate = ([node, path]: NodeEntry) => {
    // TODO: need to fix this local scope problem with the regexs somehow

    const expectedDurationRegex = new RegExp(
      /\bfor\s*(\d+)\s*(?:(mins?|m|minutes?)|(hours?|hrs?|h))\s*\b\s*/gi
    );
    const startAtRegex = new RegExp(
      /\b(?:start at|at|from)\s+(\d{1,2}(?::\d{2})?(?:[APap]?[Mm]?))?\b/gi
    );
    const ranges: any[] = [];
    const rangesStartAt = getCbRangesFromRegex(
      startAtRegex,
      START_AT_SLATE_TYPE
    )([node, path]);
    if (rangesStartAt.length > 0) {
      ranges.push(...rangesStartAt);
    }

    const rangesExpectedDuration = getCbRangesFromRegex(
      expectedDurationRegex,
      EXP_DUR_SLATE_TYPE
    )([node, path]);
    if (rangesExpectedDuration.length > 0) {
      ranges.push(...rangesExpectedDuration);
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
              <Image
                src="/supernova-globe.svg"
                width={25}
                height={25}
                alt="Supernova's icon"
              />
            </div>
            <div className="grow shrink basis-0 overflow-x-clip flex flex-col gap-1">
              <p
                className={twMerge(
                  "text-slate-400 text-xs leading-tight",
                  ibmPlexMono.className
                )}
              >
                {">"} {props.mode === "edit" ? "Editing task" : "Create a task"}
              </p>
              <div className="overflow-x-clip flex flex-col gap-2">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {taskEdit.expectedDurationSeconds !== undefined && (
                      <DurationWidget
                        expectedDurationSeconds={
                          taskEdit.expectedDurationSeconds
                        }
                      />
                    )}
                    {taskEdit.startTime !== undefined && (
                      <StartTimeWidget startTime={taskEdit.startTime} />
                    )}
                  </div>
                  <div>
                    <Button className="gap-1 pb-2" onClick={handleSubmit}>
                      Save
                      <Kbd>↵</Kbd>
                    </Button>
                  </div>
                </div>
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
      className={
        (props.leaf as any)[START_AT_SLATE_TYPE]
          ? "text-cyan-600"
          : (props.leaf as any)[EXP_DUR_SLATE_TYPE] && "text-green-600"
      }
    >
      <span className="inline-flex gap-1 items-center">
        {(props.leaf as any)[START_AT_SLATE_TYPE] && (
          <Image
            src="/icons/clock-cyan.svg"
            alt="Play green icon"
            width={13}
            height={13}
            className="ml-[2px]"
          />
        )}
        {(props.leaf as any)[EXP_DUR_SLATE_TYPE] && (
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
    </span>
  );
};
