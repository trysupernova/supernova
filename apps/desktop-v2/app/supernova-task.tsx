"use client";
import { ArrowRightIcon } from "./icons";

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
export const createBlankTask = (): ISupernovaTask => {
  return {
    id: generateRandomID(),
    title: "",
    isComplete: false,
    originalBuildText: "",
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
      className={`w-full h-min p-2.5 rounded-sm shadow border-2 ${
        props.focused ? "border-teal-400 bg-teal-50" : ""
      } justify-start items-start gap-[7px] inline-flex cursor-pointer
      ${props.task.isComplete && "opacity-40"}
      `}
    >
      <div className="h-[17px] justify-start items-center gap-[5px] flex">
        <Checkbox
          checked={props.task.isComplete}
          onCheckedChange={(value) =>
            props.onClickCheck(
              value.valueOf().toString() === "true" ? true : false
            )
          }
        />
      </div>
      <div className="grow shrink basis-0 flex-col justify-start items-start gap-2.5 inline-flex">
        <div className="self-stretch justify-start items-center inline-flex">
          <div className="grow shrink basis-0 text-black text-base font-medium leading-[14px]">
            {props.task.title}
          </div>
          <div className="self-stretch justify-start items-center inline-flex gap-1">
            {props.task.startTime && (
              <StartTimeWidget startTime={props.task.startTime} />
            )}
            <DurationWidget
              expectedDurationSeconds={props.task.expectedDurationSeconds}
            />
          </div>
        </div>
        {props.task.description && (
          <div className="w-full justify-start items-center gap-0.5 inline-flex">
            <div className="w-3 h-3 relative">
              <ArrowRightIcon />
            </div>
            <div className="grow shrink basis-0 text-slate-400 text-[10px] font-medium leading-[10px]">
              {props.task.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const DurationWidget = (props: { expectedDurationSeconds?: number }) => {
  // get the duration in minutes and seconds (e.g. 1:30)
  // if the duration was not provided, default to -:--
  let duration: string;
  if (props.expectedDurationSeconds === undefined) {
    duration = "-:--";
  } else {
    const durationHours = Math.floor(props.expectedDurationSeconds / 60 / 60);
    // make it double digit
    const durationMinutes = Math.floor(
      (props.expectedDurationSeconds - durationHours * 60 * 60) / 60
    )
      .toString()
      .padStart(2, "0");
    duration = `${durationHours}:${durationMinutes}`;
  }

  return (
    <div className="px-[5px] bg-slate-200 rounded-[5px] justify-center items-center gap-2.5 inline-flex">
      <div className="text-center text-slate-600 text-xs font-normal leading-tight">
        {duration}
      </div>
    </div>
  );
};

export const StartTimeWidget = (props: { startTime: Date }) => {
  // get the start time date
  const isToday = moment(props.startTime).isSame(moment(), "day");
  const dateSection = isToday
    ? ""
    : moment(props.startTime).format("dddd DD MMM");

  return (
    <div className="px-[5px] rounded-[5px] justify-center items-center gap-1 inline-flex">
      <Image
        src="/icons/clock-cyan.svg"
        width={12}
        height={12}
        alt="Cyan clock"
      />
      <div className="text-center text-xs font-normal text-cyan-600">
        {dateSection} {moment(props.startTime).format("h:mma")}
      </div>
    </div>
  );
};

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import { ISupernovaTask } from "../types/supernova-task";
import moment from "moment";
import Image from "next/image";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={twMerge(
        `h-4 w-4 shrink-0 rounded-sm border border-slate-300 bg-white shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
          props.checked && "bg-green-400 data-[state=checked]:text-white"
        }`,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={"flex items-center justify-center text-current"}
      >
        {props.checked && (
          <CheckIcon className="h-full w-full data-[state=checked]:visible" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
