import { ELAPSED_TIME, compileCalendars } from "./calendar";
import type { WorkingTime } from "./calendar";
import { ScheduleError } from "./errors";
import { buildOutline } from "./outline";
import { MINUTES_PER_DAY } from "./time";
import type { Minutes } from "./time";
import type { Assignment, Id, Project, Schedule, Task } from "./types";

/** Tolerance for unit sums that should be equal but were built from fractions. */
const UNIT_EPSILON = 1e-9;

/** A span in which a work resource is booked beyond its capacity. */
export interface Overallocation {
  resourceId: Id;
  from: Minutes;
  to: Minutes;
  /** Sum of the assignment units in the span. */
  units: number;
  /** Tasks booked in the span, in row order. */
  taskIds: readonly Id[];
}

interface Booking {
  assignment: Assignment;
  task: Task;
  index: number;
  start: Minutes;
  finish: Minutes;
}

interface ResourceContext {
  projectTime: WorkingTime;
  calendars: ReadonlyMap<Id, WorkingTime>;
  /** Scheduled assignments of active, non-summary tasks, by work resource. */
  bookings: Map<Id, Booking[]>;
}

function resourceContext(project: Project, schedule: Schedule): ResourceContext {
  const calendars = compileCalendars(project.calendars);
  const projectTime = calendars.get(project.calendarId);
  if (!projectTime) {
    throw new ScheduleError("unknown-reference", `The project names a missing calendar "${project.calendarId}"`);
  }
  const outline = buildOutline(project.tasks);
  const bookings = new Map<Id, Booking[]>();
  for (const resource of project.resources) if (resource.type === "work") bookings.set(resource.id, []);
  for (const assignment of project.assignments) {
    const list = bookings.get(assignment.resourceId);
    const index = outline.indexById.get(assignment.taskId);
    if (!list || index === undefined || !outline.active[index] || outline.summary[index]) continue;
    const scheduled = schedule.tasks.get(assignment.taskId);
    if (!scheduled || scheduled.finish <= scheduled.start) continue;
    // A split task books its resource only while it works, not through its pauses.
    for (const segment of scheduled.segments) {
      if (segment.finish > segment.start) {
        list.push({ assignment, task: project.tasks[index], index, start: segment.start, finish: segment.finish });
      }
    }
  }
  return { projectTime, calendars, bookings };
}

function resourceTime(context: ResourceContext, calendarId: Id | undefined): WorkingTime {
  return (calendarId === undefined ? undefined : context.calendars.get(calendarId)) ?? context.projectTime;
}

/**
 * Finds every span in which the assignments of a work resource add up to more
 * than its maximum units while the resource's calendar has working time.
 * Results are ordered by resource, then by start.
 */
export function findOverallocations(project: Project, schedule: Schedule): Overallocation[] {
  const context = resourceContext(project, schedule);
  const result: Overallocation[] = [];
  for (const resource of project.resources) {
    const bookings = context.bookings.get(resource.id);
    if (!bookings || bookings.length < 2) continue;
    const time = resourceTime(context, resource.calendarId);
    const points = [...new Set(bookings.flatMap((booking) => [booking.start, booking.finish]))].sort((a, b) => a - b);
    let open: Overallocation | null = null;
    for (let k = 0; k + 1 < points.length; k++) {
      const from = points[k];
      const to = points[k + 1];
      const inside = bookings.filter((booking) => booking.start <= from && booking.finish >= to);
      const units = inside.reduce((sum, booking) => sum + booking.assignment.units, 0);
      const over = inside.length > 1 && units > resource.maxUnits + UNIT_EPSILON && time.workBetween(from, to) > 0;
      if (!over) {
        open = null;
        continue;
      }
      const taskIds = [...new Set(inside.sort((a, b) => a.index - b.index).map((booking) => booking.task.id))];
      if (open && open.to === from && open.taskIds.join("\n") === taskIds.join("\n")) {
        open.to = to;
        continue;
      }
      open = { resourceId: resource.id, from, to, units, taskIds };
      result.push(open);
    }
  }
  return result;
}

/**
 * How much of an evenly spread share a moment of the task carries under a
 * contour. Each weight averages one over the task, so the total work stays
 * close to the assignment's work.
 */
function contourWeight(contour: Assignment["contour"], position: number): number {
  switch (contour) {
    case "front-loaded":
      return 2 * (1 - position);
    case "back-loaded":
      return 2 * position;
    case "bell":
      return 6 * position * (1 - position);
    default:
      return 1;
  }
}

/** Work and capacity of one resource for a run of days, in minutes. */
export interface ResourceUsage {
  resourceId: Id;
  /** Booked minutes per day, from `fromDay`. */
  work: number[];
  /** Minutes the resource can work per day at its maximum units. */
  capacity: number[];
}

/**
 * Totals the booked work of every work resource for each day of an inclusive
 * range of day indexes. An assignment counts its units against the working
 * time of the resource's calendar inside the task's dates.
 */
export function resourceUsage(project: Project, schedule: Schedule, fromDay: number, toDay: number): Map<Id, ResourceUsage> {
  const context = resourceContext(project, schedule);
  const days = Math.max(0, toDay - fromDay + 1);
  const result = new Map<Id, ResourceUsage>();
  for (const resource of project.resources) {
    const bookings = context.bookings.get(resource.id);
    if (!bookings) continue;
    const time = resourceTime(context, resource.calendarId);
    const work = new Array<number>(days).fill(0);
    const capacity = new Array<number>(days).fill(0);
    for (let d = 0; d < days; d++) {
      const dayStart = (fromDay + d) * MINUTES_PER_DAY;
      const dayEnd = dayStart + MINUTES_PER_DAY;
      capacity[d] = time.workBetween(dayStart, dayEnd) * resource.maxUnits;
      for (const booking of bookings) {
        const from = Math.max(dayStart, booking.start);
        const to = Math.min(dayEnd, booking.finish);
        if (to <= from) continue;
        const counted = booking.task.elapsed ? ELAPSED_TIME : time;
        const minutes = counted.workBetween(from, to) * booking.assignment.units;
        // A contour reweights the day by where it lies in the task, from 0 at the start to 1 at the finish.
        const whole = schedule.tasks.get(booking.task.id);
        const length = whole ? whole.finish - whole.start : 0;
        const position = whole && length > 0 ? ((from + to) / 2 - whole.start) / length : 0.5;
        work[d] += minutes * contourWeight(booking.assignment.contour, position);
      }
    }
    result.set(resource.id, { resourceId: resource.id, work, capacity });
  }
  return result;
}
