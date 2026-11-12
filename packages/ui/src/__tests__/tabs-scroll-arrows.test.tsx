// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Tabs, TabsList, TabsTrigger } from "../base/navigation/tabs";

/** A ResizeObserver that fires only for the elements it was asked to observe. */
class FakeResizeObserver {
  static all: FakeResizeObserver[] = [];
  readonly targets = new Set<Element>();
  constructor(private readonly callback: ResizeObserverCallback) {
    FakeResizeObserver.all.push(this);
  }
  observe(target: Element) {
    this.targets.add(target);
  }
  unobserve(target: Element) {
    this.targets.delete(target);
  }
  disconnect() {
    this.targets.clear();
  }
  static resize(target: Element) {
    for (const observer of FakeResizeObserver.all) {
      if (observer.targets.has(target)) observer.callback([], observer as unknown as ResizeObserver);
    }
  }
}

/**
 * Lays the strip and its tabs out in a row jsdom does not draw: each tab's width is given and the
 * tabs sit side by side from the strip's start. `scrollIntoView` scrolls the least distance that
 * puts the tab inside the strip's view, as a browser does for
 * `inline: "nearest"`. The strip's resize callback then runs once, as the first drawing reports it.
 */
function layOut(strip: HTMLElement, widths: Record<string, number>, clientWidth: number) {
  const geometry = { clientWidth, scrollLeft: 0, widths: { ...widths } };
  const tabs = () => screen.getAllByRole("tab");
  const offsetOf = (tab: Element) => {
    let offset = 0;
    for (const each of tabs()) {
      if (each === tab) return offset;
      offset += geometry.widths[each.textContent ?? ""] ?? 0;
    }
    return offset;
  };
  const scrollWidth = () => Object.values(geometry.widths).reduce((sum, width) => sum + width, 0);
  Object.defineProperty(strip, "clientWidth", { configurable: true, get: () => geometry.clientWidth });
  Object.defineProperty(strip, "scrollWidth", { configurable: true, get: scrollWidth });
  Object.defineProperty(strip, "scrollLeft", {
    configurable: true,
    get: () => geometry.scrollLeft,
    set: (value: number) => {
      geometry.scrollLeft = Math.max(0, Math.min(value, scrollWidth() - geometry.clientWidth));
    },
  });
  for (const tab of tabs()) {
    Object.defineProperty(tab, "offsetLeft", { configurable: true, get: () => offsetOf(tab) });
    Object.defineProperty(tab, "offsetWidth", { configurable: true, get: () => geometry.widths[tab.textContent ?? ""] ?? 0 });
  }
  const scrollIntoView = vi.fn(function (this: Element) {
    const start = offsetOf(this);
    const end = start + (geometry.widths[this.textContent ?? ""] ?? 0);
    if (start < geometry.scrollLeft) strip.scrollLeft = start;
    else if (end > geometry.scrollLeft + geometry.clientWidth) strip.scrollLeft = end - geometry.clientWidth;
  });
  Element.prototype.scrollIntoView = scrollIntoView;
  // The browser reports the laid-out sizes, as it does once the strip is first drawn.
  act(() => FakeResizeObserver.resize(strip));
  scrollIntoView.mockClear();
  return { geometry, scrollIntoView };
}

describe("TabsList scrollArrows", () => {
  const original = globalThis.ResizeObserver;
  beforeEach(() => {
    FakeResizeObserver.all = [];
    globalThis.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
  });
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  afterEach(() => {
    cleanup();
    globalThis.ResizeObserver = original;
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });

  it("shows the arrow when a tab grows inside a strip whose own width does not change", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList scrollArrows>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    const strip = screen.getByRole("tablist");
    expect(screen.queryByRole("button", { name: /next/i })).toBeNull();
    // The strip keeps its 300px box; the second tab grows past it.
    Object.defineProperty(strip, "clientWidth", { configurable: true, value: 300 });
    Object.defineProperty(strip, "scrollWidth", { configurable: true, value: 420 });
    act(() => FakeResizeObserver.resize(screen.getByRole("tab", { name: "B" })));
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  const four = (value: string) => (
    <Tabs value={value}>
      <TabsList scrollArrows>
        <TabsTrigger value="a">A</TabsTrigger>
        <TabsTrigger value="b">B</TabsTrigger>
        <TabsTrigger value="c">C</TabsTrigger>
        <TabsTrigger value="d">D</TabsTrigger>
      </TabsList>
    </Tabs>
  );

  it("keeps the reader's scroll when an arrow appearing or leaving changes the strip's width", () => {
    render(four("a"));
    const strip = screen.getByRole("tablist");
    const { geometry, scrollIntoView } = layOut(strip, { A: 100, B: 100, C: 100, D: 100 }, 300);
    // The reader scrolls the chosen tab out of sight, toward the far end.
    act(() => {
      strip.scrollLeft = 100;
      fireEvent.scroll(strip);
    });
    scrollIntoView.mockClear();
    // The arrow at the start appears, and the strip loses its width.
    geometry.clientWidth = 268;
    act(() => FakeResizeObserver.resize(strip));
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(strip.scrollLeft).toBe(100);
  });

  it("keeps the reader's scroll when a scroll event is read after the arrow appeared but before the resize", () => {
    render(four("a"));
    const strip = screen.getByRole("tablist");
    const { geometry, scrollIntoView } = layOut(strip, { A: 100, B: 100, C: 100, D: 100 }, 300);
    // A smooth scroll starts; its first step leaves A in sight within the pixel of slack.
    act(() => {
      strip.scrollLeft = 1;
      fireEvent.scroll(strip);
    });
    // The arrow at the start appears, and the next step is dispatched before the resize callback.
    geometry.clientWidth = 268;
    act(() => {
      strip.scrollLeft = 13;
      fireEvent.scroll(strip);
      FakeResizeObserver.resize(strip);
    });
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(strip.scrollLeft).toBe(13);
  });

  it("keeps the chosen tab in sight when the strip narrows and a scroll event is read before the resize", () => {
    render(four("d"));
    const strip = screen.getByRole("tablist");
    const { geometry, scrollIntoView } = layOut(strip, { A: 100, B: 100, C: 100, D: 100 }, 300);
    expect(strip.scrollLeft).toBe(100);
    // The arrow at the start appears and cuts D at the end; the browser dispatches the scroll
    // event left over from placing D before it reports the strip's new width.
    geometry.clientWidth = 268;
    act(() => {
      fireEvent.scroll(strip);
      FakeResizeObserver.resize(strip);
    });
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByRole("tab", { name: "D" }));
    expect(strip.scrollLeft).toBe(132);
  });

  it("brings the chosen tab back into sight when a tab before it grows while it was in sight", () => {
    render(four("c"));
    const strip = screen.getByRole("tablist");
    const { geometry, scrollIntoView } = layOut(strip, { A: 100, B: 100, C: 100, D: 100 }, 300);
    // A font arrives and B widens, pushing C past the end of the box.
    geometry.widths.B = 150;
    act(() => FakeResizeObserver.resize(screen.getByRole("tab", { name: "B" })));
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(screen.getByRole("tab", { name: "C" }));
    expect(strip.scrollLeft).toBe(50);
  });

  it("brings a newly chosen tab into sight", async () => {
    const { rerender } = render(four("a"));
    const strip = screen.getByRole("tablist");
    const { scrollIntoView } = layOut(strip, { A: 100, B: 100, C: 100, D: 100 }, 300);
    rerender(four("d"));
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());
    expect(scrollIntoView.mock.contexts.at(-1)).toBe(screen.getByRole("tab", { name: "D" }));
    expect(strip.scrollLeft).toBe(100);
  });
});
