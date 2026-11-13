import type { Id, Project } from "./types";

/** The collections of a project a change can be in. */
export type ChangeEntity = "task" | "link" | "resource" | "assignment" | "calendar" | "customField";

/** One difference between two versions of a project. */
export type ProjectChange =
  | { entity: ChangeEntity; kind: "added" | "updated"; id: Id; value: unknown }
  | { entity: ChangeEntity; kind: "removed"; id: Id }
  /** The row order or an outline level changed; `order` lists every task id in its new position. */
  | { entity: "task-order"; kind: "updated"; order: readonly Id[] }
  /** Plan-level settings changed; `value` holds the fields that differ. */
  | { entity: "project"; kind: "updated"; value: Readonly<Record<string, unknown>> }
  /** A baseline was saved, changed or cleared; `value` is `undefined` for a cleared one. */
  | { entity: "baseline"; kind: "updated"; number: number; value: unknown };

function diffRecords(entity: ChangeEntity, before: readonly { id: Id }[], after: readonly { id: Id }[], into: ProjectChange[]): void {
  if (before === after) return;
  const old = new Map(before.map((record) => [record.id, record]));
  for (const record of after) {
    const previous = old.get(record.id);
    if (!previous) into.push({ entity, kind: "added", id: record.id, value: record });
    // Operations keep an untouched record's object, so identity settles most records at once.
    else if (previous !== record && JSON.stringify(previous) !== JSON.stringify(record)) {
      into.push({ entity, kind: "updated", id: record.id, value: record });
    }
    old.delete(record.id);
  }
  for (const id of old.keys()) into.push({ entity, kind: "removed", id });
}

const COLLECTIONS: ReadonlySet<string> = new Set(["tasks", "links", "resources", "assignments", "calendars", "customFields", "baselines"]);

/**
 * Lists what changed between two versions of a project, record by record:
 * the form a server needs to store an edit without rewriting the plan.
 * Removals come last within each collection, and a change of row order or of
 * an outline position is reported once, as the new order.
 */
export function diffProjects(before: Project, after: Project): ProjectChange[] {
  const changes: ProjectChange[] = [];
  if (before === after) return changes;

  const settings: Record<string, unknown> = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const key of keys) {
    if (COLLECTIONS.has(key)) continue;
    const a = (before as unknown as Record<string, unknown>)[key];
    const b = (after as unknown as Record<string, unknown>)[key];
    if (a !== b) settings[key] = b;
  }
  if (Object.keys(settings).length > 0) changes.push({ entity: "project", kind: "updated", value: settings });

  diffRecords("calendar", before.calendars, after.calendars, changes);
  diffRecords("customField", before.customFields ?? [], after.customFields ?? [], changes);
  diffRecords("resource", before.resources, after.resources, changes);
  diffRecords("task", before.tasks, after.tasks, changes);
  if (before.tasks !== after.tasks) {
    const order = after.tasks.map((task) => task.id);
    const moved = order.length !== before.tasks.length || before.tasks.some((task, i) => task.id !== order[i]);
    if (moved) changes.push({ entity: "task-order", kind: "updated", order });
  }
  diffRecords("link", before.links, after.links, changes);
  diffRecords("assignment", before.assignments, after.assignments, changes);

  if (before.baselines !== after.baselines) {
    const numbers = new Set([...Object.keys(before.baselines), ...Object.keys(after.baselines)].map(Number));
    for (const number of [...numbers].sort((a, b) => a - b)) {
      if (before.baselines[number] !== after.baselines[number]) {
        changes.push({ entity: "baseline", kind: "updated", number, value: after.baselines[number] });
      }
    }
  }
  return changes;
}

/** A record both sides changed in different ways; the local change was kept. */
export interface MergeConflict {
  entity: ChangeEntity;
  id: Id;
}

const RECORD_KEYS: Readonly<Record<ChangeEntity, "tasks" | "links" | "resources" | "assignments" | "calendars" | "customFields">> = {
  task: "tasks",
  link: "links",
  resource: "resources",
  assignment: "assignments",
  calendar: "calendars",
  customField: "customFields",
};

/**
 * Brings changes made elsewhere into a plan that was also edited here.
 *
 * `base` is the version both sides started from, `mine` the plan here and
 * `theirs` the plan from elsewhere. Every record they changed and this side
 * did not is taken from them; a record both changed keeps this side's version
 * and is reported as a conflict. A record this side removed stays removed.
 * Their row order is taken when this side did not reorder, and their plan
 * settings and baselines where this side left them alone.
 */
export function mergeProjects(base: Project, mine: Project, theirs: Project): { project: Project; conflicts: MergeConflict[] } {
  const conflicts: MergeConflict[] = [];
  const local = diffProjects(base, mine);
  const touched = new Set(local.filter((change) => "id" in change).map((change) => `${change.entity}:${(change as { id: Id }).id}`));
  const result: Record<string, unknown> = { ...mine };
  const lists = new Map<string, { id: Id }[]>();
  const listOf = (key: string): { id: Id }[] => {
    let list = lists.get(key);
    if (!list) {
      list = [...(((mine as unknown as Record<string, unknown>)[key] as { id: Id }[] | undefined) ?? [])];
      lists.set(key, list);
    }
    return list;
  };

  for (const change of diffProjects(base, theirs)) {
    if (change.entity === "project") {
      const mineSettings = local.find((other) => other.entity === "project");
      const kept = mineSettings && mineSettings.entity === "project" ? mineSettings.value : {};
      for (const [key, value] of Object.entries(change.value)) if (!(key in kept)) result[key] = value;
    } else if (change.entity === "baseline") {
      const reordered = local.some((other) => other.entity === "baseline" && other.number === change.number);
      if (!reordered) {
        const baselines = { ...(result.baselines as Record<number, unknown>) };
        if (change.value === undefined) delete baselines[change.number];
        else baselines[change.number] = change.value;
        result.baselines = baselines;
      }
    } else if (change.entity === "task-order") {
      if (!local.some((other) => other.entity === "task-order")) {
        const list = listOf("tasks");
        const position = new Map(change.order.map((id, i) => [id, i]));
        // Rows only this side has keep their place after the rows both know.
        list.sort((a, b) => (position.get(a.id) ?? Infinity) - (position.get(b.id) ?? Infinity));
      }
    } else {
      const key = RECORD_KEYS[change.entity];
      const list = listOf(key);
      const at = list.findIndex((record) => record.id === change.id);
      if (touched.has(`${change.entity}:${change.id}`)) {
        conflicts.push({ entity: change.entity, id: change.id });
      } else if (change.kind === "removed") {
        if (at !== -1) list.splice(at, 1);
      } else if (at !== -1) {
        list[at] = change.value as { id: Id };
      } else {
        list.push(change.value as { id: Id });
      }
    }
  }
  for (const [key, list] of lists) result[key] = list;
  const project = result as unknown as Project;
  // A task one side removed can leave the other side's link or assignment pointing at nothing.
  const tasks = new Set(project.tasks.map((task) => task.id));
  const resources = new Set(project.resources.map((resource) => resource.id));
  return {
    project: {
      ...project,
      links: project.links.filter((link) => tasks.has(link.predecessorId) && tasks.has(link.successorId)),
      assignments: project.assignments.filter((a) => tasks.has(a.taskId) && resources.has(a.resourceId)),
    },
    conflicts,
  };
}
