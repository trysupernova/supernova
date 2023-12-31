"use client";

// this is a task builder dialog which pops up in the center of the screen with an
// overlay
import React, { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BaseEditor, Editor, Transforms, createEditor, NodeEntry } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderLeafProps,
} from "slate-react";
import { Descendant } from "slate";
import { ISupernovaTask } from "@supernova/types";
import {
  extractExpectedDuration,
  START_AT_SLATE_TYPE,
  getCbRangesFromRegex,
  EXP_DUR_SLATE_TYPE,
  extractStartAt,
  extractDate,
  getExpectedDurationRegex,
  getStartAtRegex,
  getDateRegex,
  DATE_SLATE_TYPE,
} from "../utils/supernova-task";
import { Kbd } from "./kbd";
import { Button } from "./button";
import { twMerge } from "tailwind-merge";
import { ibmPlexMono } from "./fonts";
import {
  CalendarYellowIcon,
  ClockCyanIcon,
  PlayGreenIcon,
  SupernovaGlobeLogoImage,
} from "./icons";
import { DurationWidget } from "./duration-widget";
import { StartTimeWidget } from "./start-time-widget";
import _ from "lodash";

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
  const cloneEditingTask = _.cloneDeep(props.editingTask);
  const [taskEdit, setTaskEdit] = useState(() => cloneEditingTask);

  const handleEditorChange = (value: Descendant[]) => {
    const content = (value[0] as any).children[0].text as string;
    // extract the duration if any
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
    // extract the start at time if any
    const extractedStartAt = extractStartAt(newTitle);
    // if the start at time is present, then set the start time to the start at time
    let startTime: Date | undefined = cloneEditingTask.startTime;
    if (extractedStartAt !== null) {
      // start time input is present -> init start time
      // if initially the start time was not set
      if (startTime === undefined) {
        startTime = new Date();
      }
      // set only the interdate part
      startTime?.setHours(extractedStartAt.value.getHours());
      startTime?.setMinutes(extractedStartAt.value.getMinutes());
      newTitle =
        newTitle.slice(0, extractedStartAt.match.index) +
        newTitle.slice(
          extractedStartAt.match.index + extractedStartAt.match[0].length
        );
    } else {
      // start time input is not present -> remove the start time
      startTime = undefined;
    }

    // extract the date if any
    const extractedDate = extractDate(newTitle);
    let date: Date | undefined = cloneEditingTask.startDate;
    if (extractedDate !== null) {
      date = extractedDate.value;
      newTitle =
        newTitle.slice(0, extractedDate.startIndex) +
        newTitle.slice(extractedDate.startIndex + extractedDate.endIndex);
    }
    // modify the actual start time with the date
    if (date !== undefined && startTime !== undefined) {
      startTime.setDate(date.getDate());
      startTime.setMonth(date.getMonth());
      startTime.setFullYear(date.getFullYear());
    }

    // update the task edit
    setTaskEdit((prev) => ({
      ...prev,
      expectedDurationSeconds: duration,
      originalBuildText: content,
      title: newTitle,
      startTime,
      startDate: date,
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
      // before submitting remove the date part from the original build text because
      // we don't want it to be parsed the next time the person opens this task
      // in the task builder, else would be confusing
      const extractedDate = extractDate(taskEdit.originalBuildText);
      let originalBuildText = taskEdit.originalBuildText;
      if (extractedDate !== null) {
        originalBuildText =
          originalBuildText.slice(0, extractedDate.startIndex) +
          originalBuildText.slice(
            extractedDate.startIndex + extractedDate.endIndex
          );
      }
      taskEdit.originalBuildText = originalBuildText;
      // submit the edit/create
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
    // start at
    const startAtRegex = getStartAtRegex();
    const ranges: any[] = [];
    const rangesStartAt = getCbRangesFromRegex(
      startAtRegex,
      START_AT_SLATE_TYPE
    )([node, path]);
    if (rangesStartAt.length > 0) {
      ranges.push(...rangesStartAt);
    }

    // expected duration
    const expectedDurationRegex = getExpectedDurationRegex();
    const rangesExpectedDuration = getCbRangesFromRegex(
      expectedDurationRegex,
      EXP_DUR_SLATE_TYPE
    )([node, path]);
    if (rangesExpectedDuration.length > 0) {
      ranges.push(...rangesExpectedDuration);
    }

    // date
    const dateRegex = getDateRegex();
    const rangesDate = getCbRangesFromRegex(
      dateRegex,
      DATE_SLATE_TYPE
    )([node, path]);
    if (rangesDate.length > 0) {
      ranges.push(...rangesDate);
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
        <Dialog.Overlay
          className={`dark:bg-zinc-950 bg-gray-400 opacity-70 fixed inset-0`}
        />
        <Dialog.Content
          className={`data-[state=open]:animate-contentShow fixed top-[30%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none`}
        >
          <div className="w-full h-full px-3 py-2.5 bg-white dark:bg-zinc-800 rounded-[10px] shadow border dark:border-gray-800 border-gray-300 justify-start items-start gap-2.5 flex">
            <div className="w-[25px] h-[25px] relative">
              <SupernovaGlobeLogoImage width={25} height={25} />
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
                    {taskEdit.expectedDurationSeconds && (
                      <DurationWidget
                        expectedDurationSeconds={
                          taskEdit.expectedDurationSeconds
                        }
                      />
                    )}
                    <StartTimeWidget
                      startDate={taskEdit.startDate}
                      startTime={taskEdit.startTime}
                    />
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
          ? "text-cyan-600 dark:text-cyan-400"
          : (props.leaf as any)[EXP_DUR_SLATE_TYPE]
          ? "text-green-600 dark:text-green-400"
          : (props.leaf as any)[DATE_SLATE_TYPE] &&
            "text-yellow-600 dark:text-yellow-400"
      }
    >
      <span className="inline-flex gap-1 items-center">
        {(props.leaf as any)[START_AT_SLATE_TYPE] && <ClockCyanIcon />}
        {(props.leaf as any)[EXP_DUR_SLATE_TYPE] && <PlayGreenIcon />}
        {(props.leaf as any)[DATE_SLATE_TYPE] && <CalendarYellowIcon />}
        {props.children}
      </span>
    </span>
  );
};
