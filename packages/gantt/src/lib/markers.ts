import { MINUTES_PER_DAY, dayIndexOf, fromCivil } from "@simplix-react/gantt-core";
import type { Minutes, Project, Schedule } from "@simplix-react/gantt-core";

/** A date the timeline marks with a line and a name. */
export type MarkerKind = "today" | "statusDate" | "projectStart" | "projectFinish";

/** One marked date. */
export interface DateMarker {
  kind: MarkerKind;
  at: Minutes;
}

/** How each kind of marker is drawn: its line in the chart, its name tag in the header, and its colour on paper. */
export const MARKER_STYLE: Readonly<Record<MarkerKind, { line: string; tag: string; ink: string }>> = {
  // Today has a colour of its own: a theme's primary colour is also the colour of the bars.
  today: { line: "border-l-2 border-sky-500", tag: "bg-sky-500 text-white", ink: "#0ea5e9" },
  statusDate: { line: "border-l-2 border-dashed border-amber-500", tag: "bg-amber-500 text-white", ink: "#f59e0b" },
  projectStart: { line: "border-l border-emerald-600", tag: "bg-emerald-600 text-white", ink: "#059669" },
  projectFinish: { line: "border-l border-violet-600", tag: "bg-violet-600 text-white", ink: "#7c3aed" },
};

/** The current instant on the project's wall clock: the reader's local date and time. */
export function nowOnProjectClock(): Minutes {
  const now = new Date();
  return fromCivil(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes());
}

/**
 * The dates a timeline marks: today, the status date when the plan has one,
 * and the two ends of the plan. They come in the order they are drawn, so the
 * later ones lie on top where two fall on the same day.
 */
export function dateMarkers(project: Project, schedule: Schedule, now: Minutes): DateMarker[] {
  const markers: DateMarker[] = [
    { kind: "projectStart", at: Math.min(project.start, schedule.start) },
    { kind: "projectFinish", at: schedule.finish },
  ];
  if (project.statusDate !== undefined) markers.push({ kind: "statusDate", at: project.statusDate });
  markers.push({ kind: "today", at: now });
  return markers;
}

/** Days around a plan within which today still widens the timeline to include it. */
const TODAY_REACH_DAYS = 366;

/** The span a timeline covers: the plan, widened to today when today lies within a year of it. */
export function timelineSpan(project: Project, schedule: Schedule, now: Minutes): { from: Minutes; to: Minutes } {
  const from = Math.min(schedule.start, project.start);
  const to = schedule.finish;
  const reach = TODAY_REACH_DAYS * MINUTES_PER_DAY;
  if (now < from - reach || now > to + reach) return { from, to };
  return { from: Math.min(from, now), to: Math.max(to, now) };
}

/** The first instant of the day an instant falls on. */
export function startOfDay(t: Minutes): Minutes {
  return dayIndexOf(t) * MINUTES_PER_DAY;
}
