import { describe, expect, it } from "vitest";

import { compileCalendars } from "../calendar";
import { addResource, assignResource } from "../edit-links";
import { levelResources } from "../leveling";
import { findOverallocations } from "../resources";
import { computeSchedule } from "../schedule";
import type { Link, LinkType, Project, Schedule, Task } from "../types";
import { DAY, at, link, project, span, task } from "./fixtures";

function generator(seed: number): (n: number) => number {
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

function assertLinksHold(p: Project, s: Schedule): void {
  expect(s.conflicts).toEqual([]);
  for (const state of s.links.values()) expect(state.violated).toBe(false);
  const time = compileCalendars(p.calendars).get(p.calendarId)!;
  for (const t of s.tasks.values()) {
    expect(t.start).toBeGreaterThanOrEqual(p.start);
    expect(t.finish).toBeGreaterThanOrEqual(t.start);
    if (!t.summary) expect(time.workBetween(t.start, t.finish)).toBe(p.tasks[t.index].duration);
  }
}

describe("random plans", () => {
  const seeds = Array.from({ length: 200 }, (_, i) => i + 1);

  it("keep every link, never start before the project and keep each duration", () => {
    for (const seed of seeds) {
      const p = randomProject(seed);
      assertLinksHold(p, computeSchedule(p));
    }
  });

  it("have no negative slack, a critical task, and late dates no earlier than early dates", () => {
    for (const seed of seeds) {
      const p = randomProject(seed);
      const s = computeSchedule(p);
      const leaves = [...s.tasks.values()].filter((t) => !t.summary);
      for (const t of leaves) {
        expect(t.totalSlack, `seed ${seed} ${t.id}`).toBeGreaterThanOrEqual(0);
        expect(t.freeSlack).toBeLessThanOrEqual(Math.max(t.totalSlack, t.freeSlack));
        expect(t.lateFinish).toBeLessThanOrEqual(s.finish);
      }
      expect(leaves.some((t) => t.critical), `seed ${seed}`).toBe(true);
    }
  });

  it("move the finish by exactly the slip of a critical task and not at all within free slack", () => {
    for (const seed of seeds.slice(0, 80)) {
      const p = randomProject(seed);
      const s = computeSchedule(p);
      const time = compileCalendars(p.calendars).get(p.calendarId)!;
      for (const t of s.tasks.values()) {
        if (t.summary || t.duration === 0) continue;
        const slip = 120;
        const longer = computeSchedule({
          ...p,
          tasks: p.tasks.map((x) => (x.id === t.id ? { ...x, duration: x.duration + slip } : x)),
        });
        const moved = time.workBetween(s.finish, longer.finish);
        if (t.totalSlack >= slip) expect(moved, `seed ${seed} ${t.id}`).toBe(0);
        // A task whose start bounds a successor, or whose finish a predecessor bounds, absorbs the slip at its other end.
        const finishDriven = p.links.some(
          (l) =>
            (l.predecessorId === t.id && (l.type === "SS" || l.type === "SF")) ||
            (l.successorId === t.id && (l.type === "FF" || l.type === "SF")),
        );
        if (t.totalSlack === 0 && !finishDriven) {
          expect(moved, `seed ${seed} ${t.id}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("level to no overallocation while every link still holds and nothing moves earlier", () => {
    for (const seed of seeds.slice(0, 60)) {
      const random = generator(seed * 31);
      let p = randomProject(seed);
      p = addResource(p, { id: "r1", name: "one" });
      p = addResource(p, { id: "r2", name: "two" });
      const summary = (i: number): boolean => i + 1 < p.tasks.length && p.tasks[i + 1].outlineLevel > p.tasks[i].outlineLevel;
      p.tasks.forEach((t, i) => {
        if (summary(i) || t.duration === 0 || random(2) === 0) return;
        p = assignResource(p, t.id, random(2) === 0 ? "r1" : "r2");
      });
      const before = computeSchedule(p);
      const leveled = levelResources(p);
      const after = computeSchedule(leveled.project);
      expect(leveled.unresolved, `seed ${seed}`).toEqual([]);
      expect(findOverallocations(leveled.project, after)).toEqual([]);
      assertLinksHold(leveled.project, after);
      for (const t of after.tasks.values()) expect(t.start).toBeGreaterThanOrEqual(before.tasks.get(t.id)!.start);
    }
  });
});

describe("boundaries", () => {
  it("does not call two half-time assignments an overallocation", () => {
    let p = project([task("a", 2), task("b", 2)]);
    p = addResource(p, { id: "r", name: "r" });
    p = assignResource(assignResource(p, "a", "r", 0.5), "b", "r", 0.5);
    expect(findOverallocations(p, computeSchedule(p))).toEqual([]);
  });

  it("holds a start-no-later-than date against a link when constraints are honoured", () => {
    const tasks = [task("a", 3), task("b", 1, { constraintType: "start-no-later-than", constraintDate: at("2014-10-20T08:00") })];
    const held = computeSchedule(project(tasks, [link("a", "b")]));
    expect(span(held, "b")).toBe("10-20 08:00 > 10-20 17:00");
    expect(held.tasks.get("a")?.totalSlack).toBe(-2 * DAY);
    const free = computeSchedule(project(tasks, [link("a", "b")], { honorConstraints: false }));
    expect(span(free, "b")).toBe("10-22 08:00 > 10-22 17:00");
    expect(free.conflicts).toContainEqual({ kind: "constraint-violated", taskId: "b" });
  });
});
