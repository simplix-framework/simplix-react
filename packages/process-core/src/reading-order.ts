import { showsInclusion, showsJump } from "./resolve";
import type { Id, Inclusion, ResolvedProcess } from "./types";

/**
 * One entry of a procedure read from its first step to its last.
 *
 * A step is followed by its acts and then by the jumps that leave it. Where the reading folds what
 * the case leaves out, an excluded step is listed with no acts and no jumps. A run of steps sharing a parallel key stands between a `group-start`
 * and a `group-end`.
 */
export type ReadingItem =
  | { kind: "section"; sectionId: Id }
  | { kind: "group-start"; key: string }
  | { kind: "group-end"; key: string }
  | { kind: "step"; stepId: Id; inclusion: Inclusion }
  | { kind: "act"; stepId: Id; actId: Id }
  | { kind: "jump"; stepId: Id; jumpId: Id };

/**
 * Lists a case in the one order everything else is derived from: the lane grid's rows, the
 * stacked list, the order a screen reader speaks and the order the arrow keys move in.
 */
export function readingOrder(process: ResolvedProcess): ReadingItem[] {
  const items: ReadingItem[] = [];
  let open: string | undefined;
  const close = (): void => {
    if (open !== undefined) items.push({ kind: "group-end", key: open });
    open = undefined;
  };
  for (const { section, steps } of process.sections) {
    // A parallel run is validated to stay inside one section, so a heading never stands inside one.
    close();
    items.push({ kind: "section", sectionId: section.id });
    for (const resolved of steps) {
      const key = resolved.step.parallel;
      if (key !== open) {
        close();
        if (key !== undefined) {
          items.push({ kind: "group-start", key });
          open = key;
        }
      }
      items.push({ kind: "step", stepId: resolved.step.id, inclusion: resolved.inclusion });
      if (!showsInclusion(process, resolved.inclusion)) continue;
      for (const { act, inclusion } of resolved.acts) {
        if (showsInclusion(process, inclusion)) items.push({ kind: "act", stepId: resolved.step.id, actId: act.id });
      }
      for (const entry of process.jumps) {
        if (entry.jump.from === resolved.step.id && showsJump(process, entry)) items.push({ kind: "jump", stepId: resolved.step.id, jumpId: entry.jump.id });
      }
    }
  }
  close();
  return items;
}
