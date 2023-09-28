"use client";
import { ArrowRightIcon } from "./icons";
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { twMerge } from "tailwind-merge";
import { ISupernovaTask } from "../types/supernova-task";
import moment from "moment";
import Image from "next/image";

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
          onClick={(e) => {
            // prevent the click from propagating to the parent
            e.stopPropagation();
          }}
        />
      </div>
      <div className="grow shrink basis-0 flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch justify-start items-center inline-flex">
          <p className="grow shrink basis-0 text-black text-base font-medium leading-[14px]">
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
          {props.task.startTime && (
            <StartTimeWidget startTime={props.task.startTime} />
          )}
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

export const DurationWidget = (props: { expectedDurationSeconds?: number }) => {
  // get the duration in minutes and seconds (e.g. 1:30)
  // if the duration was not provided, default to -:--
  let duration: string;
  if (props.expectedDurationSeconds === undefined) {
    duration = "-:-";
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
      <p className="text-center text-slate-600 text-xs font-normal leading-tight">
        {duration}
      </p>
    </div>
  );
};

export const StartTimeWidget = (props: { startTime: Date }) => {
  // get the start time date
  console.log(props.startTime);
  const dateDiffFromToday = moment(props.startTime).diff(moment(), "days");
  const isOverdue = dateDiffFromToday < 0;
  const isToday = dateDiffFromToday === 0;
  const lastDayOfWeek = moment().endOf("isoWeek");
  const lastDayOfNextWeek = moment().add(1, "week").endOf("isoWeek");
  const isThisWeek = moment(props.startTime).isBefore(lastDayOfWeek);
  const isNextWeek =
    moment(props.startTime).isAfter(lastDayOfWeek) &&
    moment(props.startTime).isBefore(lastDayOfNextWeek);
  const isTmrw = dateDiffFromToday === 1;
  const dateSection = isToday
    ? ""
    : isOverdue
    ? moment(props.startTime).fromNow()
    : isTmrw
    ? "Tomorrow"
    : isThisWeek
    ? moment(props.startTime).format("dddd")
    : isNextWeek
    ? "Next " + moment(props.startTime).format("dddd")
    : moment(props.startTime).format("MMM D");

  return (
    <div className="px-[5px] rounded-[5px] justify-center items-center gap-1 inline-flex">
      <Image
        src="/icons/clock-cyan.svg"
        width={12}
        height={12}
        alt="Cyan clock"
      />
      <p
        className={`text-center text-xs font-normal ${
          isOverdue ? "text-red-600" : "text-cyan-600"
        }`}
      >
        {dateSection} {moment(props.startTime).format("h:mma")}
      </p>
    </div>
  );
};

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
