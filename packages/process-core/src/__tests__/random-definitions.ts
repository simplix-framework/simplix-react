import type { Act, Condition, Facts, Jump, ProcessDefinition, Section, Step } from "../types";
import { definition, lane } from "./fixtures";

/** A seeded generator of numbers in [0, 1): the same seed gives the same definitions on every machine. */
export function generator(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const FACTS = ["f0", "f1", "f2", "f3"];

function randomCondition(next: () => number, depth = 0): Condition {
  const roll = next();
  if (depth >= 2 || roll < 0.5) return { fact: FACTS[Math.floor(next() * FACTS.length)] };
  if (roll < 0.65) return { not: randomCondition(next, depth + 1) };
  const parts = [randomCondition(next, depth + 1), randomCondition(next, depth + 1)];
  return roll < 0.85 ? { all: parts } : { any: parts };
}

/** Facts for a random case: each name true, false or left unknown. */
export function randomFacts(next: () => number): Facts {
  const facts: Record<string, boolean> = {};
  for (const name of FACTS) {
    const roll = next();
    if (roll < 0.4) facts[name] = true;
    else if (roll < 0.8) facts[name] = false;
  }
  return facts;
}

/**
 * A valid definition of random shape: up to eight lanes, four sections, six steps a section and
 * four acts a step, with joint acts, conditions on steps and acts, parallel runs, repeats, and
 * jumps back, ahead and out.
 */
export function randomDefinition(next: () => number): ProcessDefinition {
  const pick = (count: number): number => Math.floor(next() * count);
  const lanes = Array.from({ length: 1 + pick(8) }, (_, index) => lane(`l${index}`));
  let serial = 0;
  const sections: Section[] = [];
  const stepIds: string[] = [];
  const sectionCount = 1 + pick(4);
  for (let s = 0; s < sectionCount; s += 1) {
    const steps: Step[] = [];
    const stepCount = pick(7);
    for (let t = 0; t < stepCount; t += 1) {
      const acts: Act[] = Array.from({ length: 1 + pick(4) }, () => {
        const first = pick(lanes.length);
        const joint = lanes.length > 1 && next() < 0.15 ? [first, (first + 1 + pick(lanes.length - 1)) % lanes.length] : [first];
        const made: Act = { id: `a${(serial += 1)}`, lanes: joint.map((index) => lanes[index].id), kind: next() < 0.6 ? "do" : "check", label: `act ${serial}` };
        if (next() < 0.15) made.condition = randomCondition(next);
        return made;
      });
      const id = `s${stepIds.length}`;
      stepIds.push(id);
      const made: Step = { id, label: `step ${id}`, acts };
      if (next() < 0.25) made.condition = randomCondition(next);
      if (next() < 0.2) made.rework = { label: `rework ${id}` };
      steps.push(made);
    }
    // One parallel run in some sections: two or three neighbouring steps.
    if (steps.length >= 2 && next() < 0.4) {
      const start = pick(steps.length - 1);
      const length = Math.min(steps.length - start, 2 + pick(2));
      for (let t = start; t < start + length; t += 1) steps[t].parallel = `g${s}`;
    }
    sections.push({ id: `sec${s}`, label: `section ${s}`, steps });
  }
  const all = sections.flatMap((entry) => entry.steps);
  all.forEach((entry, index) => {
    if (index < all.length - 1 && next() < 0.1) entry.repeat = { endedBy: all[index + 1 + pick(all.length - index - 1)].id };
  });
  const jumps: Jump[] = [];
  const jumpCount = all.length < 2 ? 0 : pick(7);
  for (let j = 0; j < jumpCount; j += 1) {
    const from = pick(all.length);
    if (next() < 0.15) {
      jumps.push({ id: `j${j}`, from: all[from].id, external: "elsewhere", label: `jump ${j}` });
      continue;
    }
    const to = (from + 1 + pick(all.length - 1)) % all.length;
    jumps.push({ id: `j${j}`, from: all[from].id, to: all[to].id, label: `jump ${j}` });
  }
  return definition(lanes, sections, jumps);
}
