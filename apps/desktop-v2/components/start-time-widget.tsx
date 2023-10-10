import moment from "moment";
import { ClockCyanIcon } from "./icons";
import { getEnglishDay, isEarlierThan, isOverdue } from "@/utils/date";

export const StartTimeWidget = (props: {
  startDate?: Date;
  startTime?: Date;
}) => {
  if (!props.startDate && !props.startTime) {
    return null;
  }

  const dateSection = props.startDate && getEnglishDay(props.startDate);
  const today = new Date();
  let overdue = false;
  if (props.startTime) {
    overdue = isOverdue(props.startTime);
  } else {
    if (props.startDate) {
      overdue = isEarlierThan(props.startDate, today);
    }
  }

  return (
    <div className="px-[5px] rounded-[5px] justify-center items-center gap-1 inline-flex">
      <ClockCyanIcon />
      <p
        className={`text-center text-xs font-normal ${
          overdue
            ? "text-red-600 dark:text-red-400"
            : "text-cyan-600 dark:text-cyan-400"
        }`}
      >
        {dateSection}{" "}
        {props.startTime && moment(props.startTime).format("h:mma")}
      </p>
    </div>
  );
};
