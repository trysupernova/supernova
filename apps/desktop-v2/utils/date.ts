import moment from "moment";

export function isTomorrow(date: Date) {
  const beginningOfTmr = moment().add(1, "day").startOf("day");
  const endOfTmr = moment().add(1, "day").endOf("day");
  return moment(date).isBetween(beginningOfTmr, endOfTmr);
}

export function isToday(date: Date) {
  return moment(date).isBetween(moment().startOf("day"), moment().endOf("day"));
}

export function isOverdue(date: Date) {
  return moment().isAfter(date);
}

export function isThisWeek(date: Date) {
  const lastDayOfWeek = moment().endOf("isoWeek");
  return moment(date).isBefore(lastDayOfWeek);
}

export function isNextWeek(date: Date) {
  const lastDayOfWeek = moment().endOf("isoWeek");
  const lastDayOfNextWeek = moment().add(1, "week").endOf("isoWeek");
  return (
    moment(date).isAfter(lastDayOfWeek) &&
    moment(date).isBefore(lastDayOfNextWeek)
  );
}

/**
 * Our own version of a comprehensive English relative time formatter. Commonly used in the start time widget.
 * @param date start time / date
 * @returns string of the relative time
 */
export function getEnglishDay(date: Date): string {
  const dateSection = isToday(date)
    ? "Today"
    : isOverdue(date)
    ? moment(date).fromNow()
    : isTomorrow(date)
    ? "Tomorrow"
    : isThisWeek(date)
    ? moment(date).format("dddd")
    : isNextWeek(date)
    ? "Next " + moment(date).format("dddd")
    : moment(date).format("MMM D");
  return dateSection;
}
