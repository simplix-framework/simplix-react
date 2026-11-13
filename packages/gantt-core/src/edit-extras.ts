import { compileCalendars } from "./calendar";
import { changeTask, createTask, insertTask, nextId, taskIndex } from "./edit-tasks";
import { ScheduleError } from "./errors";
import { MINUTES_PER_DAY, dayIndexOf, fromCivil, toCivil, weekdayOfDay } from "./time";
import type { Minutes } from "./time";
import type { CustomField, CustomValue, DurationUnit, Id, Project, Schedule, Task, TaskSplit } from "./types";

/**
 * Pauses a task at `at` for `gap` working minutes: the work before `at` stays
 * where it is and the rest resumes after the pause.
 *
 * @throws ScheduleError `invalid-operation` for a summary task, a milestone,
 * an instant outside the task's work, or a gap that is not above zero.
 */
export function splitTask(project: Project, schedule: Schedule, id: Id, at: Minutes, gap: number): Project {
  const task = project.tasks[taskIndex(project, id)];
  const scheduled = schedule.tasks.get(id);
  if (!scheduled || scheduled.summary || task.duration === 0 || task.elapsed) {
    throw new ScheduleError("invalid-operation", `Task "${id}" cannot be split`, [id]);
  }
  if (!Number.isFinite(gap) || gap <= 0) {
    throw new ScheduleError("invalid-operation", `A split needs a pause above zero: ${gap}`, [id]);
  }
  const time = compileCalendars(project.calendars).get(task.calendarId ?? project.calendarId);
  if (!time) throw new ScheduleError("unknown-reference", `Task "${id}" names a missing calendar`, [id]);
  // Work done before `at`: whole segments before it, and the part of its own segment.
  let offset = 0;
  let inside = false;
  for (const segment of scheduled.segments) {
    if (at >= segment.finish) {
      offset += time.workBetween(segment.start, segment.finish);
    } else if (at > segment.start) {
      offset += time.workBetween(segment.start, at);
      inside = true;
      break;
    } else {
      break;
    }
  }
  if (!inside || offset <= 0 || offset >= task.duration) {
    throw new ScheduleError("invalid-operation", `Task "${id}" is not at work at that instant`, [id]);
  }
  const splits: TaskSplit[] = [...(task.splits ?? []).filter((split) => split.offset !== offset), { offset, gap }];
  splits.sort((a, b) => a.offset - b.offset);
  return changeTask(project, id, (current) => ({ ...current, splits }));
}

/** Removes every split of a task, so it works in one stretch again. */
export function clearSplits(project: Project, id: Id): Project {
  return changeTask(project, id, (task) => {
    if (!task.splits) return task;
    const next: Task = { ...task };
    delete next.splits;
    return next;
  });
}

/** Adds a custom field to the plan. Omitted `id` takes the next free one. */
export function addCustomField(project: Project, field: Omit<CustomField, "id"> & { id?: Id }): Project {
  const fields = project.customFields ?? [];
  const next: CustomField = { id: field.id ?? nextId(fields), name: field.name, type: field.type };
  if (fields.some((other) => other.id === next.id)) {
    throw new ScheduleError("duplicate-id", `Custom field id "${next.id}" is used twice`, [next.id]);
  }
  return { ...project, customFields: [...fields, next] };
}

/** Renames a custom field. */
export function renameCustomField(project: Project, id: Id, name: string): Project {
  const fields = project.customFields ?? [];
  if (!fields.some((field) => field.id === id)) throw new ScheduleError("unknown-reference", `No custom field "${id}"`, [id]);
  return { ...project, customFields: fields.map((field) => (field.id === id ? { ...field, name } : field)) };
}

/** Removes a custom field and the values every task holds for it. */
export function removeCustomField(project: Project, id: Id): Project {
  return {
    ...project,
    customFields: (project.customFields ?? []).filter((field) => field.id !== id),
    tasks: project.tasks.map((task) => {
      if (!task.custom || !(id in task.custom)) return task;
      const custom = { ...task.custom };
      delete custom[id];
      return { ...task, custom };
    }),
  };
}

/**
 * Sets a task's value of a custom field; `undefined` clears it.
 *
 * @throws ScheduleError `unknown-reference` for a field the plan does not
 * have, and `invalid-operation` for a value of the wrong kind.
 */
export function setCustomValue(project: Project, taskId: Id, fieldId: Id, value: CustomValue | undefined): Project {
  const field = (project.customFields ?? []).find((candidate) => candidate.id === fieldId);
  if (!field) throw new ScheduleError("unknown-reference", `No custom field "${fieldId}"`, [fieldId]);
  const expected = field.type === "text" ? "string" : field.type === "flag" ? "boolean" : "number";
  if (value !== undefined && (typeof value !== expected || (typeof value === "number" && !Number.isFinite(value)))) {
    throw new ScheduleError("invalid-operation", `Custom field "${field.name}" takes a ${field.type} value`, [fieldId]);
  }
  return changeTask(project, taskId, (task) => {
    const custom = { ...task.custom };
    if (value === undefined) delete custom[fieldId];
    else custom[fieldId] = value;
    return { ...task, custom };
  });
}

/** When a recurring task happens. */
export interface Recurrence {
  frequency: "daily" | "weekly" | "monthly";
  /** Every `interval`-th day, week or month. */
  interval: number;
  /** Weekdays of a weekly recurrence, 0 for Sunday. */
  weekdays?: readonly number[];
  /** Day of the month of a monthly recurrence. A month without that day is skipped. */
  monthDay?: number;
  /** First day considered. */
  from: Minutes;
  /** Last day considered. One of `until` and `count` is required. */
  until?: Minutes;
  /** Number of occurrences. */
  count?: number;
}

/** Occurrences a recurring task may have at most. */
const MAX_OCCURRENCES = 500;

/**
 * The days a recurrence falls on, as day indexes. A daily recurrence skips
 * days the project calendar does not work.
 *
 * @throws ScheduleError `invalid-operation` for an interval under one, a
 * recurrence with no end, a weekly one without weekdays, a monthly one
 * without a day, or one with more than 500 occurrences.
 */
export function recurrenceDays(project: Project, recurrence: Recurrence): number[] {
  const { frequency, interval, from, until, count } = recurrence;
  if (!Number.isInteger(interval) || interval < 1 || (until === undefined && count === undefined)) {
    throw new ScheduleError("invalid-operation", "A recurrence needs an interval of one or more and an end");
  }
  if (frequency === "weekly" && !(recurrence.weekdays && recurrence.weekdays.length > 0)) {
    throw new ScheduleError("invalid-operation", "A weekly recurrence needs at least one weekday");
  }
  if (frequency === "monthly" && recurrence.monthDay === undefined) {
    throw new ScheduleError("invalid-operation", "A monthly recurrence needs a day of the month");
  }
  const time = compileCalendars(project.calendars).get(project.calendarId);
  const first = dayIndexOf(from);
  const last = until === undefined ? first + 366 * 50 : dayIndexOf(until);
  const days: number[] = [];
  const take = (day: number): boolean => {
    if (day < first || day > last) return true;
    days.push(day);
    if (days.length > MAX_OCCURRENCES) {
      throw new ScheduleError("invalid-operation", `A recurring task can have at most ${MAX_OCCURRENCES} occurrences`);
    }
    return count === undefined || days.length < count;
  };

  if (frequency === "daily") {
    for (let day = first; day <= last; day += interval) {
      if (time && time.rangesOfDay(day).length === 0) continue;
      if (!take(day)) break;
    }
  } else if (frequency === "weekly") {
    const weekdays = [...new Set(recurrence.weekdays)].sort((a, b) => a - b);
    const weekStart = first - weekdayOfDay(first);
    for (let week = weekStart; week <= last; week += 7 * interval) {
      let more = true;
      for (const weekday of weekdays) {
        more = take(week + weekday);
        if (!more) break;
      }
      if (!more) break;
    }
  } else {
    const start = toCivil(from);
    for (let n = 0; ; n += interval) {
      const month = start.month - 1 + n;
      const year = start.year + Math.floor(month / 12);
      const day = dayIndexOf(fromCivil(year, (month % 12) + 1, recurrence.monthDay as number));
      if (dayIndexOf(fromCivil(year, (month % 12) + 1, 1)) > last) break;
      // A day the month does not have rolls into the next month; such a month has no occurrence.
      if (toCivil(day * MINUTES_PER_DAY).month !== (month % 12) + 1) continue;
      if (!take(day)) break;
    }
  }
  return days;
}

/**
 * Adds a recurring task: a summary task named `name` with one task of
 * `duration` under it for every occurrence, each held to its day by a
 * start-no-earlier-than constraint. The rows go in before `beforeIndex`, or
 * at the end.
 */
export function addRecurringTask(
  project: Project,
  options: {
    name: string;
    duration: number;
    /** Unit the occurrences show their duration in. */
    durationUnit?: DurationUnit;
    recurrence: Recurrence;
    beforeIndex?: number;
    outlineLevel?: number;
  },
): Project {
  const days = recurrenceDays(project, options.recurrence);
  if (days.length === 0) throw new ScheduleError("invalid-operation", "The recurrence has no occurrence");
  const at = options.beforeIndex ?? project.tasks.length;
  const level = options.outlineLevel ?? 1;
  let next = insertTask(project, createTask(project, { name: options.name, outlineLevel: level, estimated: false }), at);
  const parentLevel = next.tasks[Math.min(at, next.tasks.length - 1)].outlineLevel;
  days.forEach((day, i) => {
    const occurrence = createTask(next, {
      name: `${options.name} ${i + 1}`,
      outlineLevel: parentLevel + 1,
      duration: options.duration,
      durationUnit: options.durationUnit ?? "d",
      estimated: false,
      constraintType: "start-no-earlier-than",
      constraintDate: day * MINUTES_PER_DAY + project.defaultStartTime,
    });
    next = insertTask(next, occurrence, at + 1 + i);
  });
  return next;
}
