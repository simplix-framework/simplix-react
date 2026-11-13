import type { Link, LinkType, Project, Task } from "../types";
import { link, project, task } from "./fixtures";

/** A repeatable source of whole numbers below `n`, from a seed. */
export function generator(seed: number): (n: number) => number {
  let state = seed;
  return (n) => {
    state = (state * 1103515245 + 12345) % 2147483648;
    // The low bits of this generator repeat with a short period; draw from the high ones.
    return Math.floor(state / 65536) % n;
  };
}

const TYPES: LinkType[] = ["FS", "SS", "FF", "SF"];

/** A random plan: a few summary tasks, links that only point down the row list, mixed link types and lags. */
export function randomProject(seed: number): Project {
  const random = generator(seed);
  const tasks: Task[] = [];
  const count = 5 + random(25);
  let level = 1;
  for (let i = 0; i < count; i++) {
    const previous = i === 0 ? 0 : tasks[i - 1].outlineLevel;
    level = i === 0 ? 1 : Math.max(1, Math.min(previous + 1, level + random(3) - 1));
    tasks.push(task(`t${i}`, 0, { outlineLevel: level, duration: random(6) === 0 ? 0 : (1 + random(40)) * 60 }));
  }
  const isSummary = (i: number): boolean => i + 1 < count && tasks[i + 1].outlineLevel > tasks[i].outlineLevel;
  const links: Link[] = [];
  for (let i = 1; i < count; i++) {
    if (isSummary(i) || random(3) === 0) continue;
    const from = random(i);
    if (isSummary(from)) continue;
    links.push(link(`t${from}`, `t${i}`, TYPES[random(4)], 0, { lag: (random(7) - 2) * 120 }));
  }
  return project(tasks, links);
}
