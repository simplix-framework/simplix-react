import { formatLocalDate } from "@simplix-react/gantt-core";
import type { Minutes } from "@simplix-react/gantt-core";

import type { ScaleUnit } from "./time-scale";

/** A project-clock instant as a `Date` whose UTC fields carry the wall-clock values. */
function asUtcDate(t: Minutes): Date {
  return new Date(t * 60000);
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatter(language: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = `${language}|${JSON.stringify(options)}`;
  let found = formatters.get(key);
  if (!found) {
    found = new Intl.DateTimeFormat(language, { ...options, timeZone: "UTC" });
    formatters.set(key, found);
  }
  return found;
}

/** A date as the table shows it: short, in the reader's language. */
export function formatDate(t: Minutes, language: string): string {
  return formatter(language, { dateStyle: "medium" }).format(asUtcDate(t));
}

/** A date with its time of day, for a tooltip. */
export function formatDateTime(t: Minutes, language: string): string {
  return formatter(language, { dateStyle: "medium", timeStyle: "short" }).format(asUtcDate(t));
}

/** The value an `<input type="date">` takes for an instant. */
export function toDateInputValue(t: Minutes): string {
  return formatLocalDate(t);
}

/** The label of a header cell that starts at `t`. `width` picks a shorter form for a narrow cell. */
export function formatScaleCell(t: Minutes, unit: ScaleUnit, language: string, width: number): string {
  const date = asUtcDate(t);
  switch (unit) {
    case "hour":
      return formatter(language, { hour: "numeric" }).format(date);
    case "day":
      return width >= 44
        ? formatter(language, { weekday: "short", day: "numeric" }).format(date)
        : String(date.getUTCDate());
    case "week":
      return formatter(language, { month: "short", day: "numeric" }).format(date);
    case "month":
      return width >= 90
        ? formatter(language, { year: "numeric", month: "long" }).format(date)
        : formatter(language, { month: "short" }).format(date);
    case "quarter":
      return `Q${Math.floor(date.getUTCMonth() / 3) + 1}${width >= 70 ? ` ${date.getUTCFullYear()}` : ""}`;
    case "year":
      return String(date.getUTCFullYear());
  }
}
