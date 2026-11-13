import { useCallback, useEffect, useRef } from "react";
import type { RefObject, UIEvent } from "react";

/** What {@link useTableScroll} hands to the table. */
export interface TableScroll {
  /** The clipped box around the heading row. */
  header: RefObject<HTMLDivElement | null>;
  /** The clipped box around the rows; its scroll position is the table's. */
  body: RefObject<HTMLDivElement | null>;
  /** The scroll bar under the rows, present only while the columns are wider than the table. */
  bar: RefObject<HTMLDivElement | null>;
  /** Scroll handler for all three boxes: whichever moved, the other two follow. */
  onScroll: (event: UIEvent<HTMLDivElement>) => void;
  /** Scrolls just far enough that the span from `left` to `right` of the columns is in view. */
  reveal: (left: number, right: number) => void;
}

/**
 * Sideways scrolling of a table whose columns are wider than the room it has.
 * The heading row, the rows and the scroll bar are three boxes kept at one
 * scroll position. The heading row and the rows scroll by a sideways wheel or
 * a finger like any scrolling box, with their own scroll bars hidden. `pinnedWidth` is the width of the leading columns that
 * stay in place, which a revealed span must clear.
 */
export function useTableScroll(contentWidth: number, viewWidth: number, pinnedWidth: number): TableScroll {
  const header = useRef<HTMLDivElement | null>(null);
  const body = useRef<HTMLDivElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const limit = Math.max(0, contentWidth - viewWidth);

  const scrollTo = useCallback(
    (x: number): void => {
      const next = Math.max(0, Math.min(limit, x));
      for (const element of [body.current, header.current, bar.current]) {
        if (element && Math.abs(element.scrollLeft - next) > 0.5) element.scrollLeft = next;
      }
    },
    [limit],
  );

  // A resized table or column, or a scroll bar that has just appeared, takes the rows' position.
  useEffect(() => {
    scrollTo(body.current?.scrollLeft ?? 0);
  }, [scrollTo, viewWidth]);

  const onScroll = useCallback((event: UIEvent<HTMLDivElement>): void => scrollTo(event.currentTarget.scrollLeft), [scrollTo]);

  const reveal = useCallback(
    (left: number, right: number): void => {
      const at = body.current?.scrollLeft ?? 0;
      if (left < at + pinnedWidth) scrollTo(left - pinnedWidth);
      else if (right > at + viewWidth) scrollTo(right - viewWidth);
    },
    [pinnedWidth, viewWidth, scrollTo],
  );

  return { header, body, bar, onScroll, reveal };
}
