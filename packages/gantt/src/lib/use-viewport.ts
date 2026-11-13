import { useEffect, useState } from "react";
import type { RefObject } from "react";

/** The part of a scrolling box that is on screen. */
export interface Viewport {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Follows the scroll position and the size of a scrolling box, read once per
 * frame. `measured` turns true once the real size has been read; until then
 * the viewport is `initial`.
 */
export function useViewport(ref: RefObject<HTMLElement | null>, initial: Viewport): { viewport: Viewport; measured: boolean } {
  const [viewport, setViewport] = useState(initial);
  const [measured, setMeasured] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const read = (): void => {
      frame = 0;
      setViewport((previous) => {
        const next = { left: element.scrollLeft, top: element.scrollTop, width: element.clientWidth, height: element.clientHeight };
        return next.left === previous.left && next.top === previous.top && next.width === previous.width && next.height === previous.height
          ? previous
          : next;
      });
    };
    const request = (): void => {
      if (frame === 0) frame = requestAnimationFrame(read);
    };
    read();
    setMeasured(true);
    element.addEventListener("scroll", request, { passive: true });
    const observer = new ResizeObserver(request);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", request);
      observer.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [ref]);
  return { viewport, measured };
}

/** Width of a name column beside dated columns: its preferred width, or less where the box is narrow. */
export function nameColumnWidth(boxWidth: number, preferred: number): number {
  return Math.round(Math.max(96, Math.min(preferred, boxWidth * 0.4)));
}

/** Follows the width of an element. Until it has been measured the width is `initial`. */
export function useElementWidth(ref: RefObject<HTMLElement | null>, initial: number): number {
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const read = (): void => setWidth(element.clientWidth);
    read();
    const observer = new ResizeObserver(read);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}
