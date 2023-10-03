import moment from "moment";

/**
 * Gets some useful date booleans for a given date
 * @param date the date
 * @returns some useful date booleans like isTomorrow, isNextWeek, etc.
 */
export function getUsefulDateBooleans(date: Date) {
  const isOverdue = moment().isAfter(date);
  const isToday = moment(date).isBetween(
    moment().startOf("day"),
    moment().endOf("day")
  );
  const lastDayOfWeek = moment().endOf("isoWeek");
  const lastDayOfNextWeek = moment().add(1, "week").endOf("isoWeek");
  const isThisWeek = moment(date).isBefore(lastDayOfWeek);
  const isNextWeek =
    moment(date).isAfter(lastDayOfWeek) &&
    moment(date).isBefore(lastDayOfNextWeek);
  const beginningOfTmr = moment().add(1, "day").startOf("day");
  const endOfTmr = moment().add(1, "day").endOf("day");
  const isTomorrow = moment(date).isBetween(beginningOfTmr, endOfTmr);
  return { isOverdue, isToday, isThisWeek, isNextWeek, isTomorrow };
}

/**
 * Our own version of a comprehensive English relative time formatter. Commonly used in the start time widget.
 * @param date start time / date
 * @returns string of the relative time
 */
export function getEnglishDay(date: Date): string {
  const { isThisWeek, isToday, isOverdue, isTomorrow, isNextWeek } =
    getUsefulDateBooleans(date);

  const dateSection = isToday
    ? "Today"
    : isOverdue
    ? moment(date).fromNow()
    : isTomorrow
    ? "Tomorrow"
    : isThisWeek
    ? moment(date).format("dddd")
    : isNextWeek
    ? "Next " + moment(date).format("dddd")
    : moment(date).format("MMM D");
  return dateSection;
}
