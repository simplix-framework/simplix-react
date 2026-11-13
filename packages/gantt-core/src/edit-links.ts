import { nextId, taskIndex } from "./edit-tasks";
import { ScheduleError } from "./errors";
import { buildNetwork } from "./network";
import { buildOutline, isAncestor } from "./outline";
import type { Assignment, Id, Link, Project, Resource, Task, WorkCalendar } from "./types";

/**
 * Adds a dependency. Omitted fields default to finish-to-start with no lag.
 *
 * @throws ScheduleError `invalid-operation` for a second link between the
 * same two tasks or a link between a summary task and a task under it, and
 * `cycle` when the link would close a loop.
 */
export function addLink(
  project: Project,
  link: Pick<Link, "predecessorId" | "successorId"> & Partial<Omit<Link, "predecessorId" | "successorId">>,
): Project {
  const from = taskIndex(project, link.predecessorId);
  const to = taskIndex(project, link.successorId);
  const pair = [link.predecessorId, link.successorId];
  if (from === to) throw new ScheduleError("cycle", `A task cannot depend on itself: "${link.predecessorId}"`, pair);
  if (
    project.links.some(
      (other) =>
        (other.predecessorId === link.predecessorId && other.successorId === link.successorId) ||
        (other.predecessorId === link.successorId && other.successorId === link.predecessorId),
    )
  ) {
    throw new ScheduleError("invalid-operation", "The two tasks are already linked", pair);
  }
  const outline = buildOutline(project.tasks);
  if (isAncestor(outline, from, to) || isAncestor(outline, to, from)) {
    throw new ScheduleError("invalid-operation", "A summary task cannot be linked to a task under it", pair);
  }
  const next: Project = {
    ...project,
    links: [
      ...project.links,
      { id: nextId(project.links), type: "FS", lag: 0, lagMode: "working", lagUnit: "d", ...link },
    ],
  };
  // Raises `cycle` when the new link closes a loop.
  buildNetwork(next);
  return next;
}

/** Changes the type or lag of a link. */
export function updateLink(project: Project, id: Id, patch: Partial<Pick<Link, "type" | "lag" | "lagMode" | "lagUnit">>): Project {
  if (!project.links.some((link) => link.id === id)) {
    throw new ScheduleError("unknown-reference", `No link "${id}"`, [id]);
  }
  return { ...project, links: project.links.map((link) => (link.id === id ? { ...link, ...patch } : link)) };
}

/** Removes links by id. */
export function removeLinks(project: Project, ids: readonly Id[]): Project {
  const removed = new Set(ids);
  return { ...project, links: project.links.filter((link) => !removed.has(link.id)) };
}

/** Adds a resource. Omitted fields default to a full-time work resource. */
export function addResource(project: Project, resource: Pick<Resource, "name"> & Partial<Resource>): Project {
  const next: Resource = { id: nextId(project.resources), type: "work", maxUnits: 1, ...resource };
  if (project.resources.some((other) => other.id === next.id)) {
    throw new ScheduleError("duplicate-id", `Resource id "${next.id}" is used twice`, [next.id]);
  }
  return { ...project, resources: [...project.resources, next] };
}

/** Changes fields of a resource. */
export function updateResource(project: Project, id: Id, patch: Partial<Omit<Resource, "id">>): Project {
  if (!project.resources.some((resource) => resource.id === id)) {
    throw new ScheduleError("unknown-reference", `No resource "${id}"`, [id]);
  }
  return {
    ...project,
    resources: project.resources.map((resource) => (resource.id === id ? { ...resource, ...patch } : resource)),
  };
}

/** Removes resources and their assignments. */
export function removeResources(project: Project, ids: readonly Id[]): Project {
  const removed = new Set(ids);
  return {
    ...project,
    resources: project.resources.filter((resource) => !removed.has(resource.id)),
    assignments: project.assignments.filter((assignment) => !removed.has(assignment.resourceId)),
  };
}

function isWorkResource(project: Project, resourceId: Id): boolean {
  return project.resources.find((resource) => resource.id === resourceId)?.type === "work";
}

/** Duration a fixed-units or fixed-work task needs for its assignments' work at their units. */
function durationForWork(assignments: readonly Assignment[], fallback: number): number {
  let duration = 0;
  let any = false;
  for (const assignment of assignments) {
    if (assignment.units <= 0) continue;
    duration = Math.max(duration, Math.round(assignment.work / assignment.units));
    any = true;
  }
  return any ? duration : fallback;
}

function withTaskAssignments(project: Project, task: Task, mine: readonly Assignment[], duration: number): Project {
  const others = project.assignments.filter((assignment) => assignment.taskId !== task.id);
  return {
    ...project,
    tasks: project.tasks.map((other) => (other.id === task.id && other.duration !== duration ? { ...other, duration } : other)),
    assignments: [...others, ...mine],
  };
}

/**
 * Assigns a resource to a task at `units` (1 is full time).
 *
 * The first work resource takes the task's duration as its work. A further
 * one on an effort-driven task shares the existing work: the task shortens,
 * or keeps its length and lowers every unit when its duration is fixed.
 * Without effort-driven scheduling the new resource adds its own work.
 */
export function assignResource(project: Project, taskId: Id, resourceId: Id, units = 1): Project {
  const task = project.tasks[taskIndex(project, taskId)];
  if (!project.resources.some((resource) => resource.id === resourceId)) {
    throw new ScheduleError("unknown-reference", `No resource "${resourceId}"`, [resourceId]);
  }
  if (project.assignments.some((assignment) => assignment.taskId === taskId && assignment.resourceId === resourceId)) {
    throw new ScheduleError("invalid-operation", "The resource is already assigned to the task", [taskId, resourceId]);
  }
  if (!Number.isFinite(units) || units <= 0) {
    throw new ScheduleError("invalid-operation", `Assignment units must be above zero: ${units}`, [taskId, resourceId]);
  }
  const id = nextId(project.assignments);
  const mine = project.assignments.filter((assignment) => assignment.taskId === taskId);
  const working = mine.filter((assignment) => isWorkResource(project, assignment.resourceId));
  const sharesWork = isWorkResource(project, resourceId) && working.length > 0 && (task.effortDriven || task.type === "fixed-work");

  if (!sharesWork) {
    const added: Assignment = { id, taskId, resourceId, units, work: Math.round(task.duration * units) };
    return { ...project, assignments: [...project.assignments, added] };
  }

  const totalWork = working.reduce((sum, assignment) => sum + assignment.work, 0);
  const totalUnits = working.reduce((sum, assignment) => sum + assignment.units, 0) + units;
  const added: Assignment = { id, taskId, resourceId, units, work: 0 };
  if (task.type === "fixed-duration") {
    // The duration stays, so every resource gives a smaller share of its time.
    const scale = task.duration > 0 ? totalWork / (task.duration * totalUnits) : 1;
    const rescaled = [...mine, added].map((assignment) =>
      isWorkResource(project, assignment.resourceId)
        ? { ...assignment, units: assignment.units * scale, work: Math.round(task.duration * assignment.units * scale) }
        : assignment,
    );
    return withTaskAssignments(project, task, rescaled, task.duration);
  }
  const duration = Math.round(totalWork / totalUnits);
  const shared = [...mine, added].map((assignment) =>
    isWorkResource(project, assignment.resourceId) ? { ...assignment, work: Math.round(duration * assignment.units) } : assignment,
  );
  return withTaskAssignments(project, task, shared, duration);
}

/**
 * Changes the units or the work of an assignment and settles the third value
 * by the task's type: fixed units and fixed work move the duration, fixed
 * duration moves the other of units and work.
 */
export function updateAssignment(project: Project, id: Id, patch: { units?: number; work?: number }): Project {
  const current = project.assignments.find((assignment) => assignment.id === id);
  if (!current) throw new ScheduleError("unknown-reference", `No assignment "${id}"`, [id]);
  const task = project.tasks[taskIndex(project, current.taskId)];
  let next: Assignment = { ...current, ...patch };
  if (next.units <= 0 || next.work < 0 || !Number.isFinite(next.units) || !Number.isFinite(next.work)) {
    throw new ScheduleError("invalid-operation", "Assignment units must be above zero and work cannot be negative", [id]);
  }
  if (task.type === "fixed-duration") {
    if (patch.work !== undefined && patch.units === undefined && task.duration > 0) {
      next = { ...next, units: next.work / task.duration };
    } else {
      next = { ...next, work: Math.round(task.duration * next.units) };
    }
  } else if (task.type === "fixed-units" && patch.units !== undefined && patch.work === undefined) {
    // New units over the same duration change the work, not the duration.
    next = { ...next, work: Math.round(task.duration * next.units) };
  }
  const mine = project.assignments
    .filter((assignment) => assignment.taskId === task.id)
    .map((assignment) => (assignment.id === id ? next : assignment));
  const working = mine.filter((assignment) => isWorkResource(project, assignment.resourceId));
  const duration = task.type === "fixed-duration" ? task.duration : durationForWork(working, task.duration);
  return withTaskAssignments(project, task, mine, duration);
}

/**
 * Removes assignments. On an effort-driven task the remaining work resources
 * take over the removed work and the task lengthens.
 */
export function removeAssignments(project: Project, ids: readonly Id[]): Project {
  const removed = new Set(ids);
  let next: Project = { ...project, assignments: project.assignments.filter((assignment) => !removed.has(assignment.id)) };
  const affected = new Set(project.assignments.filter((assignment) => removed.has(assignment.id)).map((a) => a.taskId));
  for (const taskId of affected) {
    const task = next.tasks[taskIndex(next, taskId)];
    if (!task.effortDriven || task.type === "fixed-duration") continue;
    const before = project.assignments.filter((a) => a.taskId === taskId && isWorkResource(project, a.resourceId));
    const mine = next.assignments.filter((assignment) => assignment.taskId === taskId);
    const working = mine.filter((assignment) => isWorkResource(next, assignment.resourceId));
    const totalUnits = working.reduce((sum, assignment) => sum + assignment.units, 0);
    if (totalUnits <= 0) continue;
    const totalWork = before.reduce((sum, assignment) => sum + assignment.work, 0);
    const duration = Math.round(totalWork / totalUnits);
    const shared = mine.map((assignment) =>
      isWorkResource(next, assignment.resourceId) ? { ...assignment, work: Math.round(duration * assignment.units) } : assignment,
    );
    next = withTaskAssignments(next, task, shared, duration);
  }
  return next;
}

/** Adds a calendar, or replaces the one with the same id. */
export function putCalendar(project: Project, calendar: WorkCalendar): Project {
  const exists = project.calendars.some((other) => other.id === calendar.id);
  return {
    ...project,
    calendars: exists
      ? project.calendars.map((other) => (other.id === calendar.id ? calendar : other))
      : [...project.calendars, calendar],
  };
}

/**
 * Removes a calendar.
 *
 * @throws ScheduleError `invalid-operation` while the project, a task, a
 * resource or another calendar still uses it.
 */
export function removeCalendar(project: Project, id: Id): Project {
  const users = [
    ...(project.calendarId === id ? ["project"] : []),
    ...project.tasks.filter((task) => task.calendarId === id).map((task) => task.id),
    ...project.resources.filter((resource) => resource.calendarId === id).map((resource) => resource.id),
    ...project.calendars.filter((calendar) => calendar.baseCalendarId === id).map((calendar) => calendar.id),
  ];
  if (users.length > 0) {
    throw new ScheduleError("invalid-operation", `Calendar "${id}" is still in use`, users);
  }
  return { ...project, calendars: project.calendars.filter((calendar) => calendar.id !== id) };
}
