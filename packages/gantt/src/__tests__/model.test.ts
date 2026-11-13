import { MINUTES_PER_DAY, computeSchedule, parseLocalDateTime, standardCalendar } from "@simplix-react/gantt-core";
import type { Project, Task } from "@simplix-react/gantt-core";
import { describe, expect, it, vi } from "vitest";

import { pathData, routeLink } from "../lib/link-path";
import { dateMarkers, timelineSpan } from "../lib/markers";
import { buildPdf, layoutPdf } from "../lib/pdf-export";
import { visibleRows } from "../lib/rows";
import { createTimeScale, scaleCells } from "../lib/time-scale";
import { createGanttStore } from "../model/gantt-store";

const at = parseLocalDateTime;

function task(id: string, days: number, patch: Partial<Task> = {}): Task {
  return {
    id,
    name: id,
    outlineLevel: 1,
    mode: "auto",
    duration: days * 480,
    durationUnit: "d",
    constraintType: "asap",
    type: "fixed-units",
    percentComplete: 0,
    priority: 500,
    ...patch,
  };
}

function project(tasks: Task[]): Project {
  return {
    name: "test",
    scheduleFrom: "start",
    start: at("2014-10-17T08:00"),
    calendarId: "standard",
    minutesPerDay: 480,
    minutesPerWeek: 2400,
    daysPerMonth: 20,
    defaultStartTime: 480,
    defaultFinishTime: 1020,
    criticalSlackLimit: 0,
    honorConstraints: true,
    calendars: [standardCalendar()],
    tasks,
    links: [],
    resources: [],
    assignments: [],
    baselines: {},
  };
}

describe("time scale", () => {
  const scale = createTimeScale(at("2014-10-17T08:00"), at("2014-11-03T17:00"), 28, 7);

  it("covers whole days with padding and maps both ways", () => {
    expect(scale.start).toBe(at("2014-10-10T00:00"));
    expect(scale.end).toBe(at("2014-11-11T00:00"));
    expect(scale.width).toBe(32 * 28);
    expect(scale.x(at("2014-10-11T00:00"))).toBe(28);
    expect(scale.at(42)).toBe(at("2014-10-11T12:00"));
    expect(scale.at(43, MINUTES_PER_DAY)).toBe(at("2014-10-12T00:00"));
  });

  it("cuts header cells at calendar boundaries and only inside the pixel range", () => {
    const months = scaleCells(scale, "month", 0, scale.width);
    expect(months.map((cell) => [cell.x, cell.width])).toEqual([
      [0, 22 * 28],
      [22 * 28, 10 * 28],
    ]);
    const weeks = scaleCells(scale, "week", 0, scale.width, 1);
    expect(weeks[0].from).toBe(at("2014-10-06T00:00"));
    expect(weeks[0].x).toBe(0);
    expect(weeks[1].from).toBe(at("2014-10-13T00:00"));
    expect(scaleCells(scale, "day", 100, 200)).toHaveLength(5);
    expect(scaleCells(scale, "quarter", 0, scale.width)).toHaveLength(1);
    expect(scaleCells(scale, "year", 0, scale.width)[0].from).toBe(at("2014-01-01T00:00"));
  });
});

describe("link route", () => {
  const a = { left: 100, right: 200, y: 16 };

  it("uses one elbow when the ends face each other with room", () => {
    const route = routeLink("FS", a, { left: 260, right: 360, y: 48 }, 10, 32);
    expect(pathData(route.points)).toBe("M200 16 L210 16 L210 48 L260 48");
    expect(route.arrow).toBe(1);
  });

  it("steps through the gap between rows when the successor starts behind", () => {
    const route = routeLink("FS", a, { left: 150, right: 250, y: 48 }, 10, 32);
    expect(pathData(route.points)).toBe("M200 16 L210 16 L210 32 L140 32 L140 48 L150 48");
  });

  it("runs outside both bars for start-to-start and finish-to-finish", () => {
    expect(pathData(routeLink("SS", a, { left: 150, right: 250, y: 48 }, 10, 32).points)).toBe("M100 16 L90 16 L90 48 L150 48");
    const ff = routeLink("FF", a, { left: 150, right: 250, y: 48 }, 10, 32);
    expect(pathData(ff.points)).toBe("M200 16 L260 16 L260 48 L250 48");
    expect(ff.arrow).toBe(-1);
  });

  it("enters the right end from the right for start-to-finish", () => {
    const route = routeLink("SF", a, { left: 20, right: 60, y: 48 }, 10, 32);
    expect(pathData(route.points)).toBe("M100 16 L90 16 L90 48 L60 48");
    expect(route.arrow).toBe(-1);
  });
});

describe("visible rows", () => {
  const tasks = [task("a", 1), task("b", 1, { outlineLevel: 2 }), task("c", 1, { outlineLevel: 3 }), task("d", 1, { outlineLevel: 2 }), task("e", 1)];

  it("hides everything under a collapsed summary task", () => {
    expect(visibleRows(tasks, new Set()).map((row) => row.task.id)).toEqual(["a", "b", "c", "d", "e"]);
    expect(visibleRows(tasks, new Set(["b"])).map((row) => row.task.id)).toEqual(["a", "b", "d", "e"]);
    const rows = visibleRows(tasks, new Set(["a"]));
    expect(rows.map((row) => [row.task.id, row.index, row.summary, row.collapsed])).toEqual([
      ["a", 0, true, true],
      ["e", 4, false, false],
    ]);
  });
});

describe("store", () => {
  const start = (): ReturnType<typeof createGanttStore> => createGanttStore(project([task("1", 2), task("2", 1), task("3", 1)]));

  it("applies an edit as one undo step and reports every change", () => {
    const onChange = vi.fn();
    const store = createGanttStore(project([task("1", 2)]), { onChange });
    expect(store.getState().setDurationText("1", "1w")).toBe(true);
    expect(store.getState().history.present.tasks[0]).toMatchObject({ duration: 2400, durationUnit: "w" });
    expect(store.getState().schedule.finish).toBe(at("2014-10-23T17:00"));
    store.getState().undo();
    expect(store.getState().history.present.tasks[0].duration).toBe(960);
    store.getState().redo();
    expect(store.getState().history.present.tasks[0].duration).toBe(2400);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("refuses an edit that cannot be scheduled and keeps the plan", () => {
    const store = start();
    expect(store.getState().setPredecessorText("2", "1")).toBe(true);
    expect(store.getState().setPredecessorText("3", "2")).toBe(true);
    const before = store.getState().history;
    expect(store.getState().setPredecessorText("1", "3")).toBe(false);
    expect(store.getState().rejection?.code).toBe("cycle");
    expect(store.getState().setPredecessorText("1", "2")).toBe(false);
    expect(store.getState().rejection?.code).toBe("invalid-operation");
    expect(store.getState().history).toBe(before);
    expect(store.getState().setDurationText("1", "soon")).toBe(false);
    expect(store.getState().rejection?.code).toBe("invalid-duration");
    expect(store.getState().setPredecessorText("3", "2, 9")).toBe(false);
    expect(store.getState().rejection?.code).toBe("unknown-reference");
    store.getState().setDurationText("1", "3d");
    expect(store.getState().rejection).toBeNull();
  });

  it("replaces predecessors from text and records nothing when they are the same", () => {
    const store = start();
    store.getState().setPredecessorText("3", "1SS+1d, 2");
    expect(store.getState().history.present.links.map((l) => `${l.predecessorId}${l.type}${l.lag}>${l.successorId}`)).toEqual(["1SS480>3", "2FS0>3"]);
    const steps = store.getState().history.past.length;
    store.getState().setPredecessorText("3", "1SS+1d,2");
    expect(store.getState().history.past.length).toBe(steps);
    store.getState().setPredecessorText("3", "");
    expect(store.getState().history.present.links).toEqual([]);
  });

  it("adds under the selection, selects by range and removes with the selection", () => {
    const store = start();
    store.getState().selectRow("1");
    const id = store.getState().addTask("new");
    expect(store.getState().history.present.tasks.map((t) => t.id)).toEqual(["1", id, "2", "3"]);
    expect(store.getState().selection).toEqual([id]);
    store.getState().selectRow("1");
    store.getState().selectRow("3", "extend");
    expect(store.getState().selection).toEqual(["1", id, "2", "3"]);
    store.getState().selectRow("2", "toggle");
    store.getState().removeSelected();
    expect(store.getState().history.present.tasks.map((t) => t.id)).toEqual(["2"]);
    expect(store.getState().selection).toEqual([]);
  });

  it("removes the selected link before any row", () => {
    const store = start();
    store.getState().setPredecessorText("2", "1");
    store.getState().selectRow("1");
    store.getState().selectLink(store.getState().history.present.links[0].id);
    expect(store.getState().selection).toEqual([]);
    store.getState().removeSelected();
    expect(store.getState().history.present.links).toEqual([]);
    expect(store.getState().history.present.tasks).toHaveLength(3);
    expect(store.getState().selectedLinkId).toBeNull();
  });

  it("pastes copies with ids no record uses", () => {
    const store = start();
    store.getState().setPredecessorText("2", "1");
    store.getState().select(["1", "2"]);
    store.getState().copySelected();
    store.getState().selectRow("3");
    store.getState().paste();
    const { tasks, links } = store.getState().history.present;
    expect(tasks.map((t) => t.id)).toEqual(["1", "2", "3", "4", "5"]);
    expect(links.map((l) => `${l.id}:${l.predecessorId}>${l.successorId}`)).toEqual(["1:1>2", "2:4>5"]);
  });

  it("copies as tab-separated text and tells its own text from other text on paste", () => {
    const store = start();
    expect(store.getState().copySelected()).toBeNull();
    store.getState().select(["1", "2"]);
    const text = store.getState().copySelected();
    expect(text).toBe("1\t2d\t2014-10-17\t2014-10-20\t0\n2\t1d\t2014-10-17\t2014-10-17\t0");
    store.getState().selectRow("3");
    store.getState().pasteText(`${text}\r\n`);
    expect(store.getState().history.present.tasks.map((t) => t.id)).toEqual(["1", "2", "3", "4", "5"]);
    store.getState().pasteText("Survey\t3d\nReview\tnot a duration\n\nSign-off");
    const tasks = store.getState().history.present.tasks;
    expect(tasks.slice(3, 6).map((t) => [t.name, t.duration, t.estimated])).toEqual([
      ["Survey", 1440, false],
      ["Review", 480, true],
      ["Sign-off", 480, true],
    ]);
    store.getState().undo();
    expect(store.getState().history.present.tasks).toHaveLength(5);
  });

  it("moves a shown baseline with the selected baseline number", () => {
    const store = start();
    store.getState().setBaselineSlot(3);
    expect(store.getState().baselineNumber).toBeNull();
    store.getState().setBaselineNumber(3);
    store.getState().setBaselineSlot(42);
    expect([store.getState().baselineSlot, store.getState().baselineNumber]).toEqual([10, 10]);
  });

  it("indents, outdents and clamps the zoom", () => {
    const store = start();
    store.getState().select(["2", "3"]);
    store.getState().indentSelected();
    expect(store.getState().history.present.tasks.map((t) => t.outlineLevel)).toEqual([1, 2, 2]);
    expect(store.getState().schedule.tasks.get("1")?.summary).toBe(true);
    store.getState().outdentSelected();
    expect(store.getState().history.present.tasks.map((t) => t.outlineLevel)).toEqual([1, 1, 1]);
    store.getState().setZoom(99);
    expect(store.getState().zoom).toBe(6);
    store.getState().setZoom(-3);
    expect(store.getState().zoom).toBe(0);
  });
});

describe("pdf", () => {
  it("writes one page per image with a cross-reference table that points at every object", () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    const pdf = buildPdf([{ jpeg, width: 10, height: 5 }, { jpeg, width: 10, height: 5 }], 842, 595);
    const text = new TextDecoder("latin1").decode(pdf);
    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text.trimEnd().endsWith("%%EOF")).toBe(true);
    expect(text.match(/\/Type \/Page /g)).toHaveLength(2);
    expect(text).toContain("/Count 2");
    const xref = Number(/startxref\n(\d+)/.exec(text)?.[1]);
    expect(text.slice(xref, xref + 4)).toBe("xref");
    const entries = [...text.slice(xref).matchAll(/(\d{10}) 00000 n /g)].map((m) => Number(m[1]));
    expect(entries).toHaveLength(8);
    entries.forEach((offset, i) => expect(text.slice(offset, offset + `${i + 1} 0 obj`.length)).toBe(`${i + 1} 0 obj`));
  });

  it("cuts a plan into sheets down by rows and across by timeline width", () => {
    const short = project([task("1", 2)]);
    const one = layoutPdf(computeSchedule(short), short);
    expect([one.sheetsDown, one.sheetsAcross]).toEqual([1, 1]);
    const long = project(Array.from({ length: 100 }, (_, i) => task(String(i + 1), 400)));
    const many = layoutPdf(computeSchedule(long), long);
    expect(many.rowsPerSheet).toBe(35);
    expect(many.sheetsDown).toBe(3);
    expect(many.sheetsAcross).toBeGreaterThan(1);
    expect(many.sheetsAcross).toBeLessThanOrEqual(6);
    expect(many.scale.width).toBeLessThanOrEqual(many.timelineWidth * 6);
  });
});

describe("date markers", () => {
  const p = { ...project([task("1", 2)]), statusDate: at("2014-10-20T17:00") };
  const s = computeSchedule(p);

  it("marks the ends of the plan, the status date when there is one, and today last", () => {
    const now = at("2014-10-21T10:30");
    expect(dateMarkers(p, s, now)).toEqual([
      { kind: "projectStart", at: at("2014-10-17T08:00") },
      { kind: "projectFinish", at: at("2014-10-20T17:00") },
      { kind: "statusDate", at: at("2014-10-20T17:00") },
      { kind: "today", at: now },
    ]);
    expect(dateMarkers({ ...p, statusDate: undefined }, s, now).map((m) => m.kind)).toEqual(["projectStart", "projectFinish", "today"]);
  });

  it("widens the timeline to today only when today lies within a year of the plan", () => {
    expect(timelineSpan(p, s, at("2014-12-01T00:00"))).toEqual({ from: at("2014-10-17T08:00"), to: at("2014-12-01T00:00") });
    expect(timelineSpan(p, s, at("2014-09-01T00:00")).from).toBe(at("2014-09-01T00:00"));
    expect(timelineSpan(p, s, at("2016-06-01T00:00"))).toEqual({ from: at("2014-10-17T08:00"), to: at("2014-10-20T17:00") });
  });
});
