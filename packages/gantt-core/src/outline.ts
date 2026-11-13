import { ScheduleError } from "./errors";
import type { Id, Task } from "./types";

/** The tree the outline levels of a row list describe, by row index. */
export interface Outline {
  indexById: ReadonlyMap<Id, number>;
  /** Row index of the parent, or -1 at the top level. */
  parent: readonly number[];
  children: readonly (readonly number[])[];
  /** True for a row with rows under it. */
  summary: readonly boolean[];
  /** Outline number, such as `1.2.3`. */
  wbs: readonly string[];
  /** False for an inactive row and every row under one. */
  active: readonly boolean[];
}

/**
 * Reads the tree out of a row list.
 *
 * @throws ScheduleError `duplicate-id` for a repeated id and `invalid-outline`
 * when the first row is not at level 1 or a row sits more than one level
 * under the row before it.
 */
export function buildOutline(tasks: readonly Task[]): Outline {
  const indexById = new Map<Id, number>();
  const parent: number[] = [];
  const children: number[][] = [];
  const wbs: string[] = [];
  const active: boolean[] = [];
  // Row index of the latest row seen at each level; index 0 is unused.
  const lastAtLevel: number[] = [];
  let topLevelCount = 0;

  tasks.forEach((task, index) => {
    if (indexById.has(task.id)) {
      throw new ScheduleError("duplicate-id", `Task id "${task.id}" is used twice`, [task.id]);
    }
    indexById.set(task.id, index);
    const level = task.outlineLevel;
    const previousLevel = index === 0 ? 0 : tasks[index - 1].outlineLevel;
    if (!Number.isInteger(level) || level < 1 || level > previousLevel + 1) {
      throw new ScheduleError("invalid-outline", `Task "${task.id}" has outline level ${level} after level ${previousLevel}`, [
        task.id,
      ]);
    }
    const parentIndex = level === 1 ? -1 : lastAtLevel[level - 1];
    parent.push(parentIndex);
    children.push([]);
    if (parentIndex === -1) {
      topLevelCount += 1;
      wbs.push(String(topLevelCount));
      active.push(!task.inactive);
    } else {
      children[parentIndex].push(index);
      wbs.push(`${wbs[parentIndex]}.${children[parentIndex].length}`);
      active.push(active[parentIndex] && !task.inactive);
    }
    lastAtLevel[level] = index;
  });

  return { indexById, parent, children, summary: children.map((c) => c.length > 0), wbs, active };
}

/** Row index one past the last row under `index`. */
export function subtreeEnd(tasks: readonly Task[], index: number): number {
  const level = tasks[index].outlineLevel;
  let end = index + 1;
  while (end < tasks.length && tasks[end].outlineLevel > level) end += 1;
  return end;
}

/** True when the row at `ancestor` has the row at `index` somewhere under it. */
export function isAncestor(outline: Outline, ancestor: number, index: number): boolean {
  let current = outline.parent[index];
  while (current !== -1) {
    if (current === ancestor) return true;
    current = outline.parent[current];
  }
  return false;
}
