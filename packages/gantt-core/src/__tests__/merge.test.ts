import { describe, expect, it } from "vitest";

import { mergeProjects, takeTheirs } from "../diff";
import { removeTasks, updateTask } from "../edit-tasks";
import { addLink } from "../edit-links";
import { computeSchedule } from "../schedule";
import { link, project, task } from "./fixtures";

describe("takeTheirs", () => {
  const base = project([task("a", 1), task("b", 1), task("c", 1)], [link("a", "b")]);

  it("takes the other side's version of the records chosen and leaves the rest", () => {
    const mine = updateTask(updateTask(base, "a", { name: "mine a" }), "b", { name: "mine b" });
    const theirs = updateTask(updateTask(base, "a", { name: "their a" }), "b", { name: "their b" });
    const merged = mergeProjects(base, mine, theirs);
    expect(merged.conflicts).toEqual([{ entity: "task", id: "a" }, { entity: "task", id: "b" }]);
    expect(merged.project.tasks.map((t) => t.name)).toEqual(["mine a", "mine b", "c"]);
    const settled = takeTheirs(merged.project, theirs, [{ entity: "task", id: "b" }]);
    expect(settled.tasks.map((t) => t.name)).toEqual(["mine a", "their b", "c"]);
  });

  it("removes a record the other side removed, with what pointed at it", () => {
    const mine = updateTask(base, "b", { name: "mine b" });
    const theirs = removeTasks(base, ["b"]);
    const merged = mergeProjects(base, mine, theirs);
    expect(merged.conflicts).toEqual([{ entity: "task", id: "b" }]);
    const settled = takeTheirs(merged.project, theirs, merged.conflicts);
    expect(settled.tasks.map((t) => t.id)).toEqual(["a", "c"]);
    expect(settled.links).toEqual([]);
    expect(() => computeSchedule(settled)).not.toThrow();
  });

  it("leaves out a link of theirs that would close a loop with the links here", () => {
    const mine = addLink(base, { id: "b>c", predecessorId: "b", successorId: "c" });
    const theirs = addLink(base, { id: "c>a", predecessorId: "c", successorId: "a" });
    const merged = mergeProjects(base, mine, theirs);
    expect(merged.conflicts).toEqual([{ entity: "link", id: "c>a" }]);
    const settled = takeTheirs(merged.project, theirs, merged.conflicts);
    expect(settled.links.map((l) => l.id).sort()).toEqual(["a>b", "b>c"]);
    expect(() => computeSchedule(settled)).not.toThrow();
  });

  it("changes nothing when no conflict is chosen", () => {
    const mine = updateTask(base, "a", { name: "mine a" });
    expect(takeTheirs(mine, base, [])).toEqual(mine);
  });
});
