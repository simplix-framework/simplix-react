import { addLink, parseLocalDateTime, standardCalendar } from "@simplix-react/gantt-core";
import type { Project, Task } from "@simplix-react/gantt-core";

const at = parseLocalDateTime;

/** A task of `days` working days with the defaults a new task has. */
export function task(id: string, days: number, patch: Partial<Task> = {}): Task {
  return {
    id,
    name: id,
    outlineLevel: 1,
    mode: "auto",
    duration: days * 480,
    durationUnit: "d",
    constraintType: "asap",
    type: "fixed-units",
    percentComplete: 0,
    priority: 500,
    ...patch,
  };
}

/** A plan of the given tasks on the standard calendar, without links or resources. */
export function project(tasks: Task[]): Project {
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
    links: [],
    resources: [],
    assignments: [],
    baselines: {},
  };
}

/** A plan of one-day tasks named by `ids`, with a finish-to-start link for every pair in `links`. */
export function plan(ids: readonly string[], links: readonly (readonly [string, string])[]): Project {
  let next = project(ids.map((id) => task(id, 1)));
  for (const [predecessorId, successorId] of links) next = addLink(next, { predecessorId, successorId });
  return next;
}
