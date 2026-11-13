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
