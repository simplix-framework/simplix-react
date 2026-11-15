import type { Id, ProcessDefinition } from "./types";

/** The kind of part a difference is about. */
export type DiffSubject = "process" | "lane" | "section" | "step" | "act" | "jump";

/** One difference between two versions of a procedure. */
export interface DefinitionChange {
  /**
   * `added` and `removed`: the part is in one version only. `changed`: members of the part differ.
   * `moved`: the part stands under another parent, or in another order among the parts both versions hold.
   */
  kind: "added" | "removed" | "changed" | "moved";
  subject: DiffSubject;
  id: Id;
  /** The members that differ, for `changed`. */
  fields?: string[];
}

interface Part {
  id: Id;
  parent: Id;
  value: Record<string, unknown>;
}

const CHILDREN: Record<DiffSubject, readonly string[]> = { process: ["lanes", "sections", "jumps"], lane: [], section: ["steps"], step: ["acts"], act: [], jump: [] };

function differing(subject: DiffSubject, before: Record<string, unknown>, after: Record<string, unknown>): string[] {
  const skip = new Set(["id", ...CHILDREN[subject]]);
  const names = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((name) => !skip.has(name));
  return names.filter((name) => JSON.stringify(before[name]) !== JSON.stringify(after[name]));
}

/** The ids that are not part of a longest run both orders share: the fewest parts that have to move to turn one order into the other. */
function displaced(before: readonly Id[], after: readonly Id[]): Set<Id> {
  const rows = before.length;
  const columns = after.length;
  const length: number[][] = Array.from({ length: rows + 1 }, () => new Array<number>(columns + 1).fill(0));
  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let column = columns - 1; column >= 0; column -= 1) {
      length[row][column] = before[row] === after[column] ? length[row + 1][column + 1] + 1 : Math.max(length[row + 1][column], length[row][column + 1]);
    }
  }
  const stays = new Set<Id>();
  let row = 0;
  let column = 0;
  while (row < rows && column < columns) {
    if (before[row] === after[column]) {
      stays.add(before[row]);
      row += 1;
      column += 1;
    } else if (length[row + 1][column] >= length[row][column + 1]) row += 1;
    else column += 1;
  }
  return new Set(after.filter((id) => !stays.has(id)));
}

function compare(subject: DiffSubject, before: readonly Part[], after: readonly Part[], changes: DefinitionChange[]): void {
  const old = new Map(before.map((part) => [part.id, part]));
  const now = new Map(after.map((part) => [part.id, part]));
  // Order is compared among the parts that stand under the same parent in both versions.
  const out = new Set<Id>();
  for (const parent of new Set(after.map((part) => part.parent))) {
    const stayed = (list: readonly Part[], other: Map<Id, Part>): Id[] => list.filter((part) => part.parent === parent && other.get(part.id)?.parent === parent).map((part) => part.id);
    for (const id of displaced(stayed(before, now), stayed(after, old))) out.add(id);
  }
  for (const part of after) {
    const was = old.get(part.id);
    if (was === undefined) {
      changes.push({ kind: "added", subject, id: part.id });
      continue;
    }
    if (was.parent !== part.parent || out.has(part.id)) changes.push({ kind: "moved", subject, id: part.id });
    const fields = differing(subject, was.value, part.value);
    if (fields.length > 0) changes.push({ kind: "changed", subject, id: part.id, fields });
  }
  for (const part of before) if (!now.has(part.id)) changes.push({ kind: "removed", subject, id: part.id });
}

function parts(definition: ProcessDefinition): Record<Exclude<DiffSubject, "process">, Part[]> {
  const value = (part: object): Record<string, unknown> => part as Record<string, unknown>;
  return {
    lane: definition.lanes.map((lane) => ({ id: lane.id, parent: "", value: value(lane) })),
    section: definition.sections.map((section) => ({ id: section.id, parent: "", value: value(section) })),
    step: definition.sections.flatMap((section) => section.steps.map((step) => ({ id: step.id, parent: section.id, value: value(step) }))),
    act: definition.sections.flatMap((section) => section.steps.flatMap((step) => step.acts.map((act) => ({ id: act.id, parent: step.id, value: value(act) })))),
    jump: definition.jumps.map((jump) => ({ id: jump.id, parent: "", value: value(jump) })),
  };
}

/**
 * Lists what differs between two versions of a procedure, parts matched by id: the procedure's
 * own members first, then lanes, sections, steps, acts and jumps, each in the order of `after`
 * with the removed parts last. Members this package does not know are compared like any other.
 * Two equal definitions give an empty list.
 *
 * @example
 * ```ts
 * const changes = diffDefinitions(published, draft);
 * const touched = new Set(changes.filter((change) => change.subject === "step").map((change) => change.id));
 * ```
 */
export function diffDefinitions(before: ProcessDefinition, after: ProcessDefinition): DefinitionChange[] {
  const changes: DefinitionChange[] = [];
  const fields = differing("process", before as unknown as Record<string, unknown>, after as unknown as Record<string, unknown>);
  if (fields.length > 0) changes.push({ kind: "changed", subject: "process", id: after.id, fields });
  const old = parts(before);
  const now = parts(after);
  for (const subject of ["lane", "section", "step", "act", "jump"] as const) compare(subject, old[subject], now[subject], changes);
  return changes;
}
