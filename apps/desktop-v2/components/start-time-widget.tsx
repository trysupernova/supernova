import moment from "moment";
import { ClockCyanIcon } from "./icons";

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
  console.log("datediff:" + dateDiffFromToday);
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
      <ClockCyanIcon />
      <p
        className={`text-center text-xs font-normal ${
          isOverdue
            ? "text-red-600 dark:text-red-400"
            : "text-cyan-600 dark:text-cyan-400"
        }`}
      >
        {dateSection} {moment(props.startTime).format("h:mma")}
      </p>
    </div>
  );
};
