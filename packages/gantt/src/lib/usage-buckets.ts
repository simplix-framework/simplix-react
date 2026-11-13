import { dayIndexOf } from "@simplix-react/gantt-core";
import type { Schedule } from "@simplix-react/gantt-core";

/** Plans longer than this many days are totalled per week instead of per day. */
const DAILY_LIMIT = 120;

/** The dated columns of a usage view: one per day, or one per week for a long plan. */
export interface UsageBuckets {
  fromDay: number;
  toDay: number;
  /** Days in a column. */
  size: number;
  unit: "day" | "week";
  /** First day of every column. */
  starts: number[];
  /** Total of a per-day series over one column. */
  total: (values: readonly number[], bucket: number) => number;
}

/** Splits the span of a schedule into the columns a usage view shows. */
export function usageBuckets(schedule: Schedule): UsageBuckets {
  const fromDay = dayIndexOf(schedule.start);
  const toDay = Math.max(fromDay, dayIndexOf(schedule.finish - 1));
  const size = toDay - fromDay + 1 > DAILY_LIMIT ? 7 : 1;
  const starts: number[] = [];
  for (let day = fromDay; day <= toDay; day += size) starts.push(day);
  const total = (values: readonly number[], bucket: number): number => {
    let sum = 0;
    for (let i = bucket * size; i < Math.min(values.length, (bucket + 1) * size); i++) sum += values[i];
    return sum;
  };
  return { fromDay, toDay, size, unit: size === 7 ? "week" : "day", starts, total };
}

/** Minutes written as hours with one decimal. */
export function hoursText(minutes: number): string {
  return String(Math.round(minutes / 6) / 10);
}
