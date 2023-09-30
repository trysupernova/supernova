import React from "react";

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
