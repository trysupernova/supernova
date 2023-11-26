"use client";
import { ArrowRightIcon } from "./icons";
import * as React from "react";
import { ISupernovaTask } from "@supernova/types";
import { CustomCheckbox } from "./checkbox";
import { DurationWidget } from "./duration-widget";
import { StartTimeWidget } from "./start-time-widget";

const generateRandomID = () => {
  // generate a random ID
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/*
 * Creates a blank task with a random ID
 */
export const createBlankTask = (args?: {
  startDate?: Date;
}): ISupernovaTask => {
  return {
    id: generateRandomID(),
    title: "",
    isComplete: false,
    originalBuildText: "",
    createdAt: new Date(), // this is ignored in the backend, but for now just to satisfy the return arg
    startDate: args?.startDate,
  };
};

export const SupernovaTaskComponent = (props: {
  task: ISupernovaTask;
  focused?: boolean;
  onClickCheck: (value: boolean) => void;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={props.onClick}
      className={`w-full h-min p-2.5 rounded-sm shadow border-2 dark:bg-zinc-900 ${
        props.focused
          ? "border-teal-400 bg-teal-50 dark:bg-teal-900"
          : "dark:border-zinc-700"
      } justify-start items-start gap-[7px] inline-flex cursor-pointer
      ${props.task.isComplete && "opacity-40"}
      `}
    >
      <div className="h-[17px] justify-start items-center gap-[5px] flex">
        <CustomCheckbox
          checked={props.task.isComplete}
          onCheckedChange={(value) =>
            props.onClickCheck(
              value.valueOf().toString() === "true" ? true : false
            )
          }
          onClick={(e) => {
            // prevent the click from propagating to the parent
            e.stopPropagation();
          }}
        />
      </div>
      <div className="grow shrink basis-0 flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch justify-start items-center inline-flex">
          <p className="grow shrink basis-0 text-base font-medium leading-[14px]">
            {props.task.title}
          </p>
        </div>
        {props.task.description && (
          <div className="w-full justify-start items-center gap-0.5 inline-flex">
            <div className="w-3 h-3 relative">
              <ArrowRightIcon />
            </div>
            <p className="grow shrink basis-0 text-slate-400 text-[10px] font-medium leading-[10px]">
              {props.task.description}
            </p>
          </div>
        )}
        <div className="self-stretch justify-start items-center inline-flex gap-1">
          <StartTimeWidget
            startTime={props.task.startTime}
            startDate={props.task.startDate}
          />
          {props.task.expectedDurationSeconds && (
            <DurationWidget
              expectedDurationSeconds={props.task.expectedDurationSeconds}
            />
          )}
        </div>
      </div>
    </div>
  );
};
