import { computeSchedule } from "@simplix-react/gantt-core";
import type { Project } from "@simplix-react/gantt-core";
import { describe, expect, it } from "vitest";

import { BOX_HEIGHT, BOX_WIDTH, layoutNetwork } from "../lib/network-layout";
import { plan } from "./fixtures";

/** Horizontal and vertical runs of a path made of `M` and `L` commands. */
function segments(d: string): { x1: number; y1: number; x2: number; y2: number }[] {
  const points = [...d.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((match) => ({ x: Number(match[1]), y: Number(match[2]) }));
  return points.slice(1).map((point, i) => ({ x1: points[i].x, y1: points[i].y, x2: point.x, y2: point.y }));
}

/** Whether a run passes through the inside of a box. */
function crosses(run: { x1: number; y1: number; x2: number; y2: number }, box: { x: number; y: number }): boolean {
  const left = Math.min(run.x1, run.x2);
  const right = Math.max(run.x1, run.x2);
  const top = Math.min(run.y1, run.y2);
  const bottom = Math.max(run.y1, run.y2);
  return left < box.x + BOX_WIDTH && right > box.x && top < box.y + BOX_HEIGHT && bottom > box.y;
}

function laidOut(project: Project) {
  return layoutNetwork(project, computeSchedule(project));
}

describe("layoutNetwork", () => {
  it("puts a successor in a later column than every predecessor", () => {
    const project = plan(["a", "b", "c", "d"], [["a", "b"], ["b", "c"], ["a", "d"], ["c", "d"]]);
    const { nodes } = laidOut(project);
    const x = new Map(nodes.map((node) => [node.task.id, node.x]));
    for (const link of project.links) expect(x.get(link.successorId)).toBeGreaterThan(x.get(link.predecessorId) as number);
  });

  it("keeps a chain on one line", () => {
    const { nodes } = laidOut(plan(["a", "b", "c"], [["a", "b"], ["b", "c"]]));
    expect(new Set(nodes.map((node) => node.y)).size).toBe(1);
  });

  it("gives no two boxes the same place", () => {
    const { nodes } = laidOut(plan(["a", "b", "c", "d", "e"], [["a", "c"], ["b", "c"], ["a", "d"], ["a", "e"]]));
    expect(new Set(nodes.map((node) => `${node.x}:${node.y}`)).size).toBe(nodes.length);
  });

  it("routes a line that skips columns between the boxes, not through them", () => {
    // a -> b -> c -> d is a chain on one line, and a -> d skips the two boxes between.
    const project = plan(["a", "b", "c", "d"], [["a", "b"], ["b", "c"], ["c", "d"], ["a", "d"]]);
    const { nodes, edges } = laidOut(project);
    for (const edge of edges) {
      for (const run of segments(edge.d)) {
        for (const node of nodes) expect(crosses(run, node), `line ${edge.id} through box ${node.task.id}`).toBe(false);
      }
    }
  });

  it("sizes the canvas to hold every box", () => {
    const { nodes, width, height } = laidOut(plan(["a", "b", "c"], [["a", "b"]]));
    for (const node of nodes) {
      expect(node.x + BOX_WIDTH).toBeLessThanOrEqual(width);
      expect(node.y + BOX_HEIGHT).toBeLessThanOrEqual(height);
    }
  });
});
