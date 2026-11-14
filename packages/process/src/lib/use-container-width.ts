import { useEffect, useState } from "react";
import type { RefObject } from "react";

/**
 * The inline size of an element's border box, or `undefined` until it has been measured.
 *
 * The element measured is the outer box of the component, whose width its parent decides, so
 * changing what is drawn inside never changes the reading.
 */
export function useContainerWidth(ref: RefObject<HTMLElement | null>): number | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    const element = ref.current;
    if (element === null) return;
    const read = (): void => setWidth(Math.round(element.getBoundingClientRect().width));
    read();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(read);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}
