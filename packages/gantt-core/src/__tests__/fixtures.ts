import { standardCalendar } from "../calendar";
import { formatLocalDateTime, parseLocalDateTime } from "../time";
import type { Link, LinkType, Project, Schedule, Task } from "../types";

export const at = parseLocalDateTime;
export const DAY = 480;

export function task(id: string, days: number, patch: Partial<Task> = {}): Task {
  return {
    id,
    name: id,
    outlineLevel: 1,
    mode: "auto",
    duration: days * DAY,
    durationUnit: "d",
    constraintType: "asap",
    type: "fixed-units",
    percentComplete: 0,
    priority: 500,
    ...patch,
  };
}

export function link(predecessorId: string, successorId: string, type: LinkType = "FS", lagDays = 0, patch: Partial<Link> = {}): Link {
  return {
    id: `${predecessorId}>${successorId}`,
    predecessorId,
    successorId,
    type,
    lag: lagDays * DAY,
    lagMode: "working",
    lagUnit: "d",
    ...patch,
  };
}

/** A project starting Friday 2014-10-17 08:00 on the standard calendar. */
export function project(tasks: Task[], links: Link[] = [], patch: Partial<Project> = {}): Project {
  return {
    name: "test",
    scheduleFrom: "start",
    start: at("2014-10-17T08:00"),
    calendarId: "standard",
    minutesPerDay: 480,
    minutesPerWeek: 2400,
    daysPerMonth: 20,
    defaultStartTime: 480,
    defaultFinishTime: 1020,
    criticalSlackLimit: 0,
    honorConstraints: true,
    calendars: [standardCalendar()],
    tasks,
    links,
    resources: [],
    assignments: [],
    baselines: {},
    ...patch,
  };
}

/** Start and finish of a task as `MM-DD HH:MM` pairs, for compact assertions. */
export function span(schedule: Schedule, id: string): string {
  const t = schedule.tasks.get(id);
  if (!t) throw new Error(`no task ${id}`);
  const short = (m: number): string => formatLocalDateTime(m).slice(5, 16).replace("T", " ");
  return `${short(t.start)} > ${short(t.finish)}`;
}

export function late(schedule: Schedule, id: string): string {
  const t = schedule.tasks.get(id);
  if (!t) throw new Error(`no task ${id}`);
  const short = (m: number): string => formatLocalDateTime(m).slice(5, 16).replace("T", " ");
  return `${short(t.lateStart)} > ${short(t.lateFinish)}`;
}
