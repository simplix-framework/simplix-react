import type { Condition, ProcessDefinition } from "./types";

/**
 * What a procedure does, apart from how it is worded and who is named for it: the steps in their
 * order, the acts of each step with their kind and condition, which steps proceed together, what
 * repeats until what, where a step may be sent back, and where every jump leaves and arrives.
 * Names, notes, sections, lanes and members this package does not know are left out, and a
 * parallel run is told by the steps it holds, never by its key.
 */
export function flowOf(definition: ProcessDefinition): string {
  const steps = definition.sections.flatMap((section) => section.steps);
  const runs = new Map<string, number>();
  const condition = (value: Condition | undefined): unknown => value ?? null;
  return JSON.stringify({
    steps: steps.map((step) => {
      if (step.parallel !== undefined && !runs.has(step.parallel)) runs.set(step.parallel, runs.size);
      return {
        id: step.id,
        condition: condition(step.condition),
        together: step.parallel === undefined ? null : runs.get(step.parallel),
        repeat: step.repeat?.endedBy ?? null,
        rework: step.rework !== undefined,
        acts: step.acts.map((act) => ({ id: act.id, kind: act.kind, condition: condition(act.condition), joint: act.lanes.length })),
      };
    }),
    jumps: definition.jumps.map((jump) => ({ id: jump.id, from: jump.from, to: jump.to ?? null, external: jump.external ?? null })).sort((x, y) => (x.id < y.id ? -1 : x.id > y.id ? 1 : 0)),
  });
}

/** Whether two versions of a procedure do the same thing: they may differ in wording, sections, lanes and who is named for an act. */
export function sameFlow(before: ProcessDefinition, after: ProcessDefinition): boolean {
  return flowOf(before) === flowOf(after);
}
