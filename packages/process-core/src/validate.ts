import { isCondition } from "./condition";
import type { Act, Id, ProcessDefinition, Step } from "./types";

/** Every way a definition can be wrong. The code is what a caller branches on; the rest locates it. */
export type ProblemCode =
  | "duplicate-lane"
  | "duplicate-section"
  | "duplicate-step"
  | "duplicate-act"
  | "duplicate-jump"
  | "step-without-acts"
  | "act-without-lanes"
  | "act-repeats-lane"
  | "unknown-lane"
  | "invalid-condition"
  | "jump-unknown-from"
  | "jump-unknown-to"
  | "jump-to-self"
  | "jump-target-count"
  | "repeat-unknown-end"
  | "repeat-end-not-after"
  | "parallel-not-adjacent"
  | "parallel-single"
  | "parallel-spans-sections";

/** One thing wrong with a definition. */
export interface Problem {
  code: ProblemCode;
  /** What the problem is about: a lane, section, step, act or jump id, or a parallel key. */
  subject: Id;
  /** The id the subject names and that is missing or misplaced, where there is one. */
  other?: Id;
}

function duplicates(ids: readonly Id[]): Id[] {
  const seen = new Set<Id>();
  const twice: Id[] = [];
  for (const id of ids) {
    if (seen.has(id) && !twice.includes(id)) twice.push(id);
    seen.add(id);
  }
  return twice;
}

function checkAct(act: Act, lanes: ReadonlySet<Id>, problems: Problem[]): void {
  if (act.lanes.length === 0) problems.push({ code: "act-without-lanes", subject: act.id });
  for (const lane of duplicates(act.lanes)) problems.push({ code: "act-repeats-lane", subject: act.id, other: lane });
  for (const lane of new Set(act.lanes)) {
    if (!lanes.has(lane)) problems.push({ code: "unknown-lane", subject: act.id, other: lane });
  }
  if (act.condition !== undefined && !isCondition(act.condition)) problems.push({ code: "invalid-condition", subject: act.id });
}

/**
 * Lists everything wrong with a definition, in a fixed order: lanes, sections, steps with their
 * acts, parallel keys, repeats, then jumps. An empty list means every other function of this
 * package accepts the definition.
 */
export function validateDefinition(definition: ProcessDefinition): Problem[] {
  const problems: Problem[] = [];
  const steps: Step[] = definition.sections.flatMap((section) => section.steps);
  const laneIds = new Set(definition.lanes.map((lane) => lane.id));
  const sectionOf: Id[] = definition.sections.flatMap((section) => section.steps.map(() => section.id));
  const position = new Map<Id, number>();
  steps.forEach((step, index) => {
    if (!position.has(step.id)) position.set(step.id, index);
  });

  for (const id of duplicates(definition.lanes.map((lane) => lane.id))) problems.push({ code: "duplicate-lane", subject: id });
  for (const id of duplicates(definition.sections.map((section) => section.id))) problems.push({ code: "duplicate-section", subject: id });
  for (const id of duplicates(steps.map((step) => step.id))) problems.push({ code: "duplicate-step", subject: id });
  for (const id of duplicates(steps.flatMap((step) => step.acts.map((act) => act.id)))) problems.push({ code: "duplicate-act", subject: id });

  for (const step of steps) {
    if (step.acts.length === 0) problems.push({ code: "step-without-acts", subject: step.id });
    if (step.condition !== undefined && !isCondition(step.condition)) problems.push({ code: "invalid-condition", subject: step.id });
    for (const act of step.acts) checkAct(act, laneIds, problems);
  }

  // A parallel key names one unbroken run of at least two steps.
  const runs = new Map<string, number[]>();
  steps.forEach((step, index) => {
    if (step.parallel === undefined) return;
    const indexes = runs.get(step.parallel) ?? [];
    indexes.push(index);
    runs.set(step.parallel, indexes);
  });
  for (const [key, indexes] of runs) {
    if (indexes.length < 2) problems.push({ code: "parallel-single", subject: key });
    else if (indexes[indexes.length - 1] - indexes[0] !== indexes.length - 1) problems.push({ code: "parallel-not-adjacent", subject: key });    else if (new Set(indexes.map((index) => sectionOf[index])).size > 1) problems.push({ code: "parallel-spans-sections", subject: key });
  }

  steps.forEach((step, index) => {
    if (step.repeat === undefined) return;
    const end = position.get(step.repeat.endedBy);
    if (end === undefined) problems.push({ code: "repeat-unknown-end", subject: step.id, other: step.repeat.endedBy });
    else if (end <= index) problems.push({ code: "repeat-end-not-after", subject: step.id, other: step.repeat.endedBy });
  });

  for (const id of duplicates(definition.jumps.map((jump) => jump.id))) problems.push({ code: "duplicate-jump", subject: id });
  for (const jump of definition.jumps) {
    if (!position.has(jump.from)) problems.push({ code: "jump-unknown-from", subject: jump.id, other: jump.from });
    if ((jump.to === undefined) === (jump.external === undefined)) problems.push({ code: "jump-target-count", subject: jump.id });
    if (jump.to !== undefined) {
      if (!position.has(jump.to)) problems.push({ code: "jump-unknown-to", subject: jump.id, other: jump.to });
      else if (jump.to === jump.from) problems.push({ code: "jump-to-self", subject: jump.id, other: jump.to });
    }
  }
  return problems;
}
