import { ScheduleError } from "./errors";
import type { DurationUnit, LagMode, Link, LinkType, Project } from "./types";

/** A duration as a person writes it: an amount, a unit, and whether it runs on the clock. */
export interface DurationValue {
  minutes: number;
  unit: DurationUnit;
  elapsed: boolean;
  estimated: boolean;
}

/** The working minutes a day, a week and a month stand for; a `Project` carries them. */
export type UnitSizes = Pick<Project, "minutesPerDay" | "minutesPerWeek" | "daysPerMonth">;

const UNIT_ALIASES: Readonly<Record<string, DurationUnit>> = {
  m: "m",
  min: "m",
  mins: "m",
  minute: "m",
  minutes: "m",
  h: "h",
  hr: "h",
  hrs: "h",
  hour: "h",
  hours: "h",
  d: "d",
  dy: "d",
  day: "d",
  days: "d",
  w: "w",
  wk: "w",
  wks: "w",
  week: "w",
  weeks: "w",
  mo: "mo",
  mon: "mo",
  mons: "mo",
  month: "mo",
  months: "mo",
};

/** Minutes one unit stands for. An elapsed unit is counted on the clock. */
export function minutesPerUnit(unit: DurationUnit, elapsed: boolean, sizes: UnitSizes): number {
  switch (unit) {
    case "m":
      return 1;
    case "h":
      return 60;
    case "d":
      return elapsed ? 1440 : sizes.minutesPerDay;
    case "w":
      return elapsed ? 7 * 1440 : sizes.minutesPerWeek;
    case "mo":
      return elapsed ? 30 * 1440 : sizes.daysPerMonth * sizes.minutesPerDay;
  }
}

const DURATION_TEXT = /^([+-]?\d+(?:\.\d+)?)\s*(e?)([a-z]*)\s*(\??)$/i;

/**
 * Reads a duration such as `3d`, `1.5w`, `4 hours`, `2ed` (elapsed) or `5d?`
 * (estimated). A bare number is taken in `defaultUnit`.
 *
 * @throws ScheduleError `invalid-duration` when the text is not a duration.
 */
export function parseDuration(text: string, sizes: UnitSizes, defaultUnit: DurationUnit = "d"): DurationValue {
  const m = DURATION_TEXT.exec(text.trim());
  if (!m) throw new ScheduleError("invalid-duration", `Not a duration: "${text}"`);
  const elapsed = m[2] !== "";
  let name = m[3].toLowerCase();
  // An elapsed prefix needs a unit after it.
  if (elapsed && name === "") throw new ScheduleError("invalid-duration", `Not a duration: "${text}"`);
  if (!elapsed && name === "") name = defaultUnit;
  const unit = UNIT_ALIASES[name];
  if (unit === undefined) {
    throw new ScheduleError("invalid-duration", `Unknown duration unit in "${text}"`);
  }
  const minutes = Math.round(Number(m[1]) * minutesPerUnit(unit, elapsed, sizes));
  return { minutes, unit, elapsed, estimated: m[4] === "?" };
}

function trimNumber(value: number): string {
  return String(Math.round(value * 100) / 100);
}

/** Writes a duration in its own unit, such as `3d`, `2ed` or `5d?`. */
export function formatDuration(value: DurationValue, sizes: UnitSizes): string {
  const amount = value.minutes / minutesPerUnit(value.unit, value.elapsed, sizes);
  return `${trimNumber(amount)}${value.elapsed ? "e" : ""}${value.unit}${value.estimated ? "?" : ""}`;
}

/** One entry of a predecessor list, naming the predecessor by its row number. */
export interface PredecessorRef {
  /** One-based row number of the predecessor. */
  row: number;
  type: LinkType;
  lag: number;
  lagMode: LagMode;
  lagUnit: DurationUnit;
}

const PREDECESSOR_TEXT = /^(\d+)\s*(FS|SS|FF|SF)?\s*(?:([+-])\s*(\d+(?:\.\d+)?)\s*(%|e?[a-z]*))?$/i;

/**
 * Reads a predecessor list as it is typed into a task table: `3`, `3FS+2d`,
 * `4SS-1d`, `5FF+50%`, separated by commas or semicolons.
 *
 * @throws ScheduleError `invalid-operation` when an entry cannot be read.
 */
export function parsePredecessors(text: string, sizes: UnitSizes): PredecessorRef[] {
  const refs: PredecessorRef[] = [];
  for (const part of text.split(/[,;]/)) {
    const entry = part.trim();
    if (entry === "") continue;
    const m = PREDECESSOR_TEXT.exec(entry);
    if (!m) throw new ScheduleError("invalid-operation", `Not a predecessor: "${entry}"`);
    const type = (m[2]?.toUpperCase() ?? "FS") as LinkType;
    const ref: PredecessorRef = { row: Number(m[1]), type, lag: 0, lagMode: "working", lagUnit: "d" };
    if (m[3] !== undefined) {
      const sign = m[3] === "-" ? -1 : 1;
      if (m[5] === "%") {
        ref.lag = sign * Number(m[4]);
        ref.lagMode = "percent";
      } else {
        let lag: DurationValue;
        try {
          lag = parseDuration(`${m[4]}${m[5]}`, sizes);
        } catch (error) {
          if (error instanceof ScheduleError) {
            throw new ScheduleError("invalid-operation", `Not a predecessor: "${entry}"`);
          }
          throw error;
        }
        ref.lag = sign * lag.minutes;
        ref.lagMode = lag.elapsed ? "elapsed" : "working";
        ref.lagUnit = lag.unit;
      }
    }
    refs.push(ref);
  }
  return refs;
}

/** Writes the links into a task as a predecessor list, given the row number of each predecessor. */
export function formatPredecessors(links: readonly Link[], rowOf: (taskId: string) => number, sizes: UnitSizes): string {
  return links
    .map((link) => {
      let text = String(rowOf(link.predecessorId));
      if (link.type !== "FS" || link.lag !== 0) text += link.type;
      if (link.lag !== 0) {
        const sign = link.lag < 0 ? "-" : "+";
        const amount = Math.abs(link.lag);
        text +=
          link.lagMode === "percent"
            ? `${sign}${trimNumber(amount)}%`
            : sign +
              formatDuration(
                { minutes: amount, unit: link.lagUnit, elapsed: link.lagMode === "elapsed", estimated: false },
                sizes,
              );
      }
      return text;
    })
    .join(",");
}
