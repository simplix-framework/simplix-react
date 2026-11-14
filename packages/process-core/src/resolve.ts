import { evaluateCondition } from "./condition";
import type { Condition, Facts, Id, Inclusion, Lane, ProcessDefinition, ResolvedAct, ResolvedJump, ResolvedProcess, ResolvedStep } from "./types";

function inclusionOf(condition: Condition | undefined, facts: Facts): Inclusion {
  if (condition === undefined) return "included";
  const verdict = evaluateCondition(condition, facts);
  return verdict === "true" ? "included" : verdict === "false" ? "excluded" : "conditional";
}

/**
 * Reads a definition for one case.
 *
 * A step whose condition fails is excluded, and so is one every act of which is excluded. A
 * condition that reads an unknown fact leaves its step or act in the case, marked conditional. A
 * jump is drawn when the step it leaves and the step it arrives at both belong to the case.
 *
 * @param definition a definition {@link validateDefinition} finds nothing wrong with
 * @param facts the facts of the case; pass none to read the definition with every condition undecided
 */
export function resolveProcess(definition: ProcessDefinition, facts: Facts = {}): ResolvedProcess {
  const byId = new Map<Id, ResolvedStep>();
  let number = 0;
  const sections = definition.sections.map((section) => ({
    section,
    steps: section.steps.map((step): ResolvedStep => {
      number += 1;
      const acts: ResolvedAct[] = step.acts.map((act) => ({ act, inclusion: inclusionOf(act.condition, facts) }));
      const own = inclusionOf(step.condition, facts);
      const inclusion: Inclusion = acts.every((act) => act.inclusion === "excluded") ? "excluded" : own;
      const resolved: ResolvedStep = { step, sectionId: section.id, number, inclusion, acts };
      byId.set(step.id, resolved);
      return resolved;
    }),
  }));

  const used = new Set<Id>();
  for (const step of byId.values()) {
    if (step.inclusion === "excluded") continue;
    for (const { act, inclusion } of step.acts) {
      if (inclusion !== "excluded") act.lanes.forEach((lane) => used.add(lane));
    }
  }
  const lanes: Lane[] = definition.lanes.filter((lane) => used.has(lane.id));

  const jumps: ResolvedJump[] = [];
  for (const jump of definition.jumps) {
    const from = byId.get(jump.from);
    if (from === undefined) continue;
    if (jump.to === undefined) {
      jumps.push({ jump, direction: "external", fromNumber: from.number, drawn: from.inclusion !== "excluded" });
      continue;
    }
    const to = byId.get(jump.to);
    if (to === undefined) continue;
    jumps.push({
      jump,
      direction: to.number < from.number ? "back" : "skip",
      fromNumber: from.number,
      toNumber: to.number,
      drawn: from.inclusion !== "excluded" && to.inclusion !== "excluded",
    });
  }
  return { definition, sections, lanes, jumps };
}
