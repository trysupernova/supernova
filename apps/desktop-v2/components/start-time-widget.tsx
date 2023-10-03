import moment from "moment";
import { ClockCyanIcon } from "./icons";
import { getEnglishDay, getUsefulDateBooleans } from "@/utils/date";

export const StartTimeWidget = (props: { startTime: Date }) => {
  const { isOverdue } = getUsefulDateBooleans(props.startTime);
  const dateSection = getEnglishDay(props.startTime);

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
