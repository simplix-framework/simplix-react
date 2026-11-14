import { readingOrder } from "./reading-order";
import type { Id, Inclusion, JumpDirection, ResolvedProcess } from "./types";

/** An act as a line of a step's card. */
export interface StackAct {
  actId: Id;
  /** The lanes that perform it, as ids in the order the act names them. */
  lanes: Id[];
}

/** A jump as a line under the card of the step it leaves. */
export interface StackJump {
  jumpId: Id;
  direction: JumpDirection;
  /** The number of the step it arrives at. Absent on an external jump. */
  toNumber?: number;
}

/** One block of the stacked list, top to bottom. */
export type StackBlock =
  | { kind: "section"; sectionId: Id }
  | { kind: "group-start"; key: string }
  | { kind: "group-end"; key: string }
  | { kind: "step"; stepId: Id; number: number; inclusion: Inclusion; acts: StackAct[]; jumps: StackJump[] };

/**
 * Lays a case out as one column: a card per step holding its acts and, under them, the jumps
 * that leave it. It is the reading order with each step's acts and jumps folded into its card.
 */
export function stackGeometry(process: ResolvedProcess): StackBlock[] {
  const numbers = new Map<Id, number>();
  for (const section of process.sections) for (const step of section.steps) numbers.set(step.step.id, step.number);
  const acts = new Map<Id, Id[]>();
  for (const section of process.sections) for (const step of section.steps) for (const { act } of step.acts) acts.set(act.id, act.lanes);
  const jumps = new Map(process.jumps.map((jump) => [jump.jump.id, jump]));

  const blocks: StackBlock[] = [];
  let card: Extract<StackBlock, { kind: "step" }> | undefined;
  for (const item of readingOrder(process)) {
    if (item.kind === "step") {
      card = { kind: "step", stepId: item.stepId, number: numbers.get(item.stepId)!, inclusion: item.inclusion, acts: [], jumps: [] };
      blocks.push(card);
    } else if (item.kind === "act") card!.acts.push({ actId: item.actId, lanes: [...acts.get(item.actId)!] });
    else if (item.kind === "jump") {
      const jump = jumps.get(item.jumpId)!;
      card!.jumps.push(jump.toNumber === undefined ? { jumpId: item.jumpId, direction: jump.direction } : { jumpId: item.jumpId, direction: jump.direction, toNumber: jump.toNumber });
    } else blocks.push(item);
  }
  return blocks;
}
