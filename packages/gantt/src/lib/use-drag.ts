import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

/** Pointer travel, in pixels, before a press counts as a drag and not a click. */
const DRAG_THRESHOLD = 3;

/** Where the pointer is during a drag, relative to where it went down. */
export interface DragPosition {
  dx: number;
  dy: number;
  clientX: number;
  clientY: number;
}

/** Callbacks of {@link useDrag}. */
export interface DragHandlers<T> {
  /** Called once the pointer has travelled far enough to be a drag. */
  onStart?: (subject: T, position: DragPosition) => void;
  onMove: (subject: T, position: DragPosition) => void;
  /** Called on release after a drag. A press that never became a drag calls nothing. */
  onEnd: (subject: T, position: DragPosition) => void;
  /** Called when the drag is abandoned: the pointer was cancelled or Escape was pressed. */
  onCancel?: (subject: T) => void;
}

/**
 * Returns a pointer-down handler that follows the pointer until release,
 * wherever it goes, and reports the travel. Only the primary button drags.
 */
export function useDrag<T>(handlers: DragHandlers<T>): (subject: T, event: ReactPointerEvent<Element>) => void {
  const latest = useRef(handlers);
  latest.current = handlers;

  return useCallback((subject: T, event: ReactPointerEvent<Element>) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    const originX = event.clientX;
    const originY = event.clientY;
    let dragging = false;
    const position = (e: PointerEvent): DragPosition => ({
      dx: e.clientX - originX,
      dy: e.clientY - originY,
      clientX: e.clientX,
      clientY: e.clientY,
    });
    const stop = (): void => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", key, true);
    };
    const move = (e: PointerEvent): void => {
      const at = position(e);
      if (!dragging) {
        if (Math.abs(at.dx) < DRAG_THRESHOLD && Math.abs(at.dy) < DRAG_THRESHOLD) return;
        dragging = true;
        latest.current.onStart?.(subject, at);
      }
      latest.current.onMove(subject, at);
    };
    const up = (e: PointerEvent): void => {
      stop();
      if (dragging) latest.current.onEnd(subject, position(e));
    };
    const cancel = (): void => {
      stop();
      if (dragging) latest.current.onCancel?.(subject);
    };
    const key = (e: KeyboardEvent): void => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      cancel();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", key, true);
  }, []);
}
