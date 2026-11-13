// @vitest-environment jsdom
import { addLink, parseLocalDateTime, standardCalendar } from "@simplix-react/gantt-core";
import type { Project, ProjectChange, Task } from "@simplix-react/gantt-core";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { Gantt } from "../components/gantt";
import { GanttChart } from "../components/gantt-chart";
import { GanttProvider, useGanttStore } from "../context/gantt-context";
import { durationWords, formatDurationText, toCanonicalDuration } from "../lib/duration-text";
import type { GanttStore } from "../model/gantt-store";

const at = parseLocalDateTime;

function task(id: string, days: number, patch: Partial<Task> = {}): Task {
  return {
    id,
    name: `Task ${id}`,
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

function plan(tasks: Task[] = [task("1", 2), task("2", 1), task("3", 3)]): Project {
  return {
    name: "test",
    scheduleFrom: "start",
    start: at("2026-03-02T08:00"),
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

beforeAll(() => {
  // jsdom has no layout. The chart needs the observer to exist, and the row
  // virtualizer needs a scroll area with a size to decide which rows to draw.
  globalThis.ResizeObserver = class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, get: () => 1200 });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, get: () => 600 });
  HTMLElement.prototype.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 1200, bottom: 600, width: 1200, height: 600, toJSON: () => ({}) });
});
afterEach(cleanup);

/** Renders the chart and hands back its store, so a test can read the plan the screen changed. */
function mount(project: Project, onChange?: (changes: readonly ProjectChange[]) => void): { container: HTMLElement; store: GanttStore } {
  let store: GanttStore | null = null;
  function Capture(): null {
    store = useGanttStore();
    return null;
  }
  const { container } = render(
    <GanttProvider defaultProject={project} onChange={(_project, _schedule, changes) => onChange?.(changes)}>
      <Capture />
      <GanttChart />
    </GanttProvider>,
  );
  if (!store) throw new Error("the chart mounted no store");
  return { container, store };
}

const cells = (container: HTMLElement, id: string): string[] =>
  [...container.querySelectorAll(`[data-gantt-row="${id}"] [role=gridcell]`)].map((cell) => cell.textContent ?? "");
const cell = (container: HTMLElement, id: string, n: number): Element =>
  container.querySelectorAll(`[data-gantt-row="${id}"] [role=gridcell]`)[n];
const grid = (container: HTMLElement): Element => container.querySelector('[data-gantt-slot="scroll"]') as Element;
const drag = (target: Element, dx: number): void => {
  fireEvent.pointerDown(target, { button: 0, clientX: 100, clientY: 10 });
  act(() => {
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 100 + dx / 2, clientY: 10 }));
    window.dispatchEvent(new MouseEvent("pointermove", { clientX: 100 + dx, clientY: 10 }));
    window.dispatchEvent(new MouseEvent("pointerup", { clientX: 100 + dx, clientY: 10 }));
  });
};

describe("chart", () => {
  it("draws a row and a bar for every task before the scroll area is measured", () => {
    const { container } = mount(plan());
    expect(container.querySelectorAll("[data-gantt-row]")).toHaveLength(3);
    expect(container.querySelectorAll("[data-gantt-bar]")).toHaveLength(3);
    expect(cells(container, "1")[0]).toBe("Task 1");
  });

  it("edits a cell in place, reports the changed record and undoes from the keyboard", () => {
    const changes: (readonly ProjectChange[])[] = [];
    const { container, store } = mount(plan(), (list) => changes.push(list));
    fireEvent.doubleClick(cell(container, "1", 1));
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).not.toBeNull();
    fireEvent.change(input, { target: { value: "5d" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(store.getState().history.present.tasks[0].duration).toBe(5 * 480);
    expect(container.querySelector("input")).toBeNull();
    expect(changes).toHaveLength(1);
    expect(changes[0]).toEqual([{ entity: "task", kind: "updated", id: "1", value: store.getState().history.present.tasks[0] }]);
    fireEvent.keyDown(grid(container), { key: "z", ctrlKey: true });
    expect(store.getState().history.present.tasks[0].duration).toBe(2 * 480);
  });

  it("cancels an edit with Escape and refuses text that is not a duration", () => {
    const { container, store } = mount(plan());
    fireEvent.doubleClick(cell(container, "1", 1));
    let input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "9d" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(store.getState().history.past).toHaveLength(0);
    fireEvent.doubleClick(cell(container, "1", 1));
    input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "soon" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(store.getState().rejection?.code).toBe("invalid-duration");
    expect(store.getState().history.past).toHaveLength(0);
  });

  it("moves between rows and cells with the keyboard and edits the active cell", () => {
    const { container, store } = mount(plan());
    fireEvent.pointerDown(container.querySelector('[data-gantt-row="1"]') as Element, { button: 0 });
    fireEvent.keyDown(grid(container), { key: "ArrowDown" });
    expect(store.getState().selection).toEqual(["2"]);
    fireEvent.keyDown(grid(container), { key: "ArrowDown", shiftKey: true });
    expect(store.getState().selection).toEqual(["2", "3"]);
    fireEvent.keyDown(grid(container), { key: "ArrowUp" });
    fireEvent.keyDown(grid(container), { key: "ArrowRight" });
    // The second column is the duration: Enter opens its editor, and a typed key replaces the value.
    fireEvent.keyDown(grid(container), { key: "Enter" });
    expect((container.querySelector("input") as HTMLInputElement).value).toBe("1d");
    fireEvent.keyDown(container.querySelector("input") as Element, { key: "Escape" });
    fireEvent.keyDown(grid(container), { key: "4" });
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("4");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(store.getState().history.present.tasks[1].duration).toBe(4 * 480);
  });

  it("adds, indents, moves by a day and deletes from the keyboard", () => {
    const { container, store } = mount(plan());
    fireEvent.pointerDown(container.querySelector('[data-gantt-row="2"]') as Element, { button: 0 });
    fireEvent.keyDown(grid(container), { key: "ArrowRight", altKey: true, shiftKey: true });
    expect(store.getState().history.present.tasks[1].outlineLevel).toBe(2);
    fireEvent.keyDown(grid(container), { key: "ArrowRight", altKey: true });
    expect(store.getState().schedule.tasks.get("2")?.start).toBe(at("2026-03-03T08:00"));
    fireEvent.keyDown(grid(container), { key: "Insert" });
    expect(store.getState().history.present.tasks).toHaveLength(4);
    fireEvent.keyDown(grid(container), { key: "Delete" });
    expect(store.getState().history.present.tasks.map((t) => t.id)).toEqual(["1", "2", "3"]);
  });

  it("moves and resizes a bar by dragging it", () => {
    const { container, store } = mount(plan());
    // One day is 28 pixels at the opening zoom.
    drag(container.querySelector('[data-gantt-bar="1"]') as Element, 56);
    expect(store.getState().schedule.tasks.get("1")?.start).toBe(at("2026-03-04T08:00"));
    const handle = container.querySelector('[data-gantt-bar="2"] .right-0') as Element;
    drag(handle, 28);
    expect(store.getState().history.present.tasks[1].duration).toBe(2 * 480);
    // A press that never travels is a click, not a drag.
    const past = store.getState().history.past.length;
    drag(container.querySelector('[data-gantt-bar="3"]') as Element, 1);
    expect(store.getState().history.past.length).toBe(past);
    expect(store.getState().selection).toEqual(["3"]);
  });

  it("folds a summary task, shows and hides columns and draws only links that are in view", () => {
    const project = addLink(plan([task("1", 0), task("2", 1, { outlineLevel: 2 }), task("3", 1, { outlineLevel: 2 }), task("4", 1)]), {
      predecessorId: "2",
      successorId: "3",
    });
    const { container, store } = mount(project);
    expect(container.querySelectorAll("[data-gantt-link]")).toHaveLength(1);
    fireEvent.click(container.querySelector('[data-gantt-row="1"] button') as Element);
    expect([...container.querySelectorAll("[data-gantt-row]")].map((row) => row.getAttribute("data-gantt-row"))).toEqual(["1", "4"]);
    expect(container.querySelectorAll("[data-gantt-link]")).toHaveLength(0);
    const headers = (): number => container.querySelectorAll("[role=columnheader]").length;
    const before = headers();
    act(() => store.getState().toggleColumn("totalSlack"));
    expect(headers()).toBe(before + 1);
    act(() => store.getState().toggleColumn("name"));
    expect(headers()).toBe(before);
    act(() => store.getState().reveal("3"));
    expect(container.querySelector('[data-gantt-row="3"]')).not.toBeNull();
    expect(store.getState().selection).toEqual(["3"]);
  });

  it("takes a plan changed elsewhere without calling back and keeps the undo history", () => {
    const onChange = vi.fn();
    const { container, store } = mount(plan(), onChange);
    fireEvent.doubleClick(cell(container, "1", 0));
    fireEvent.change(container.querySelector("input") as Element, { target: { value: "Renamed" } });
    fireEvent.keyDown(container.querySelector("input") as Element, { key: "Enter" });
    expect(onChange).toHaveBeenCalledTimes(1);
    const outside = { ...store.getState().history.present, tasks: [...store.getState().history.present.tasks, task("9", 1)] };
    act(() => store.getState().sync(outside));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll("[data-gantt-row]")).toHaveLength(4);
    expect(store.getState().history.past).toHaveLength(1);
  });

  it("mounts whole with its toolbar and dialogs", () => {
    const { container } = render(<Gantt defaultProject={plan()} showCriticalPath />);
    expect(container.querySelector('[data-gantt-slot="toolbar"]')).not.toBeNull();
    expect(container.querySelectorAll("[data-gantt-bar]")).toHaveLength(3);
  });
});

describe("duration words", () => {
  const korean = { units: { m: "분", h: "시간", d: "일", w: "주", mo: "개월" }, elapsed: "연속 " };
  const letters = durationWords((key) => ({ "unit.m": "m", "unit.h": "h", "unit.d": "d", "unit.w": "w", "unit.mo": "mo", "unit.elapsed": "e" })[key] ?? key);
  const project = plan();

  it("writes a duration in the reader's words and reads both forms back", () => {
    const value = { minutes: 1440, unit: "d" as const, elapsed: false, estimated: true };
    expect(formatDurationText(value, project, korean)).toBe("3일?");
    expect(formatDurationText({ ...value, estimated: false, elapsed: true, minutes: 2880 }, project, korean)).toBe("연속 2일");
    expect(formatDurationText({ minutes: 9600, unit: "mo", elapsed: false, estimated: false }, project, korean)).toBe("1개월");
    expect(formatDurationText({ ...value, elapsed: true, estimated: false, minutes: 2880 }, project, letters)).toBe("2ed");
    expect(toCanonicalDuration("3일?", korean)).toBe("3d?");
    expect(toCanonicalDuration("연속 2일", korean)).toBe("2ed");
    expect(toCanonicalDuration("1.5 개월", korean)).toBe("1.5mo");
    expect(toCanonicalDuration("90분", korean)).toBe("90m");
    expect(toCanonicalDuration("2w", korean)).toBe("2w");
    expect(toCanonicalDuration("곧", korean)).toBe("곧");
  });
});
