import { NodeEntry, Text } from "slate";
import moment from "moment";

export const START_AT_SLATE_TYPE = "startAt";
export const EXP_DUR_SLATE_TYPE = "expectedDuration";

/**
 * Extracts the expected duration from a text string.
 * @param text The text to extract the expected duration from.
 * @returns The expected duration in minutes or hours, or null if no expected duration was found.
 * @example
 * extractExpectedDuration("for 30 mins") // { value: 30, unit: "m", match: ["for 30 mins", "30", "mins"] }
 * extractExpectedDuration("for 1 hour") // { value: 1, unit: "h", match: ["for 1 hour", "1", "hour"] }
 * extractExpectedDuration("for 1h") // { value: 1, unit: "h", match: ["for 1h", "1", "h"] }
 * extractExpectedDuration("for 1 hour and 30 mins") // { value: 1, unit: "h", match: ["for 1 hour", "1", "hour"] }
 **/
export function extractExpectedDuration(
  text: string
): { value: number; unit: "m" | "h"; match: RegExpExecArray } | null {
  // TODO: need to fix this local scope problem with the regexs somehow
  const expectedDurationRegex = new RegExp(
    /\bfor\s*(\d+)\s*(?:(mins?|m|minutes?)|(hours?|hrs?|h))\s*\b\s*/gi
  );
  const match = expectedDurationRegex.exec(text);
  if (match === null) {
    return null;
  }
  const expectedDuration = match[1];
  const unit = match[2] || match[3];
  if (unit?.startsWith("m")) {
    // minutes
    return { value: parseInt(expectedDuration), unit: "m", match };
  } else if (unit?.startsWith("h")) {
    // hours
    return { value: parseInt(expectedDuration), unit: "h", match };
  }
  return null;
}

/**
 * Extracts the start time from a text string.
 * @param text The text to extract the start time from.
 * @returns The start time and the match array, or null if no start time was found.
 */
export function extractStartAt(
  text: string
): { value: Date; match: RegExpExecArray } | null {
  // TODO: need to fix this local scope problem with the regexs somehow
  const startAtRegex = new RegExp(
    /\b(?:start at|at|from)\s+(\d{1,2}(?::\d{2})?\s*(?:[APap]?[Mm]?))?\b/gi
  );
  const match = startAtRegex.exec(text);
  if (match === null || match[1] === undefined) {
    return null;
  }
  const startAt = match[1];
  const date = new Date();
  // if there's no colon, assume it's just hours
  if (!startAt.includes(":")) {
    date.setHours(parseInt(startAt));
    date.setMinutes(0);
  } else {
    // if there's a colon and it's 4 characters long, assume it's hours and minutes
    const hours = parseInt(startAt.substring(0, 1));

    const minutes = parseInt(startAt.substring(2, 5));
    date.setHours(hours);
    date.setMinutes(minutes);
  }
  // check if it's PM or any variation including lowercase and single letter
  if (
    startAt.includes("PM") ||
    startAt.includes("pm") ||
    startAt.includes("p")
  ) {
    date.setHours(date.getHours() + 12);
  } else {
    // same thing for AM or if there's no AM/PM -> assumes AM
    date.setHours(date.getHours());
  }

  return { value: date, match };
}

/**
 * Creates Slate ranges from a regex.
 * @param regex the regex to create ranges from
 * @param type the type of the range (e.g. "expectedDuration")
 * @returns
 */
export function getCbRangesFromRegex(regex: RegExp, type: string) {
  return function ([node, path]: NodeEntry) {
    const ranges: any[] = [];
    let match: RegExpExecArray | null = null;
    if (Text.isText(node)) {
      const { text } = node;
      match = regex.exec(text);
      // need a match to continue
      if (!match) {
        return [];
      }
      const matchedSubstr = match[0];
      ranges.push({
        anchor: { path, offset: match.index },
        focus: { path, offset: match.index + matchedSubstr.length },
        [type]: true,
      });
    }

    return ranges;
  };
}
