import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

/** Pointer travel, in pixels, before a press counts as a drag and not a click. */
const DRAG_THRESHOLD = 3;
/** Finger travel, in pixels, that turns a held press into a scroll of the page before the hold is over. */
const HOLD_SLOP = 8;
/** How long a finger rests on something that lies over a scrolling area before it drags, in milliseconds. */
export const TOUCH_HOLD = 300;

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

/** Options of {@link useDrag}. */
export interface DragOptions {
  /**
   * Milliseconds a finger rests on the subject before it drags. A finger that
   * moves sooner scrolls what lies under it, so a subject that covers a scrolling
   * area does not keep a touch screen from scrolling. A mouse or a pen drags at once.
   */
  touchHold?: number;
}

/**
 * Returns a pointer-down handler that follows the pointer until release,
 * wherever it goes, and reports the travel. Only the primary button drags.
 */
export function useDrag<T>(handlers: DragHandlers<T>, options: DragOptions = {}): (subject: T, event: ReactPointerEvent<Element>) => void {
  const latest = useRef(handlers);
  latest.current = handlers;
  const touchHold = options.touchHold;

  return useCallback((subject: T, event: ReactPointerEvent<Element>) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    const originX = event.clientX;
    const originY = event.clientY;
    let dragging = false;
    // A finger waits out the hold; until then the browser may still take the touch for a scroll.
    let held = !(touchHold !== undefined && event.pointerType === "touch");
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    const position = (e: PointerEvent): DragPosition => ({
      dx: e.clientX - originX,
      dy: e.clientY - originY,
      clientX: e.clientX,
      clientY: e.clientY,
    });
    const stop = (): void => {
      clearTimeout(holdTimer);
      window.removeEventListener("touchmove", keepFromScrolling);
      window.removeEventListener("contextmenu", keepMenuClosed, true);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", key, true);
    };
    // Once the hold is over the finger drags the subject, so the page under it stays where it is.
    const keepFromScrolling = (e: TouchEvent): void => {
      if (held && e.cancelable) e.preventDefault();
    };
    // A long press also asks for the context menu on a touch screen.
    const keepMenuClosed = (e: Event): void => e.preventDefault();
    const move = (e: PointerEvent): void => {
      const at = position(e);
      if (!held) {
        // The finger left before the hold was over: this is a scroll, and the browser has it.
        if (Math.abs(at.dx) >= HOLD_SLOP || Math.abs(at.dy) >= HOLD_SLOP) stop();
        return;
      }
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
    if (!held) {
      window.addEventListener("touchmove", keepFromScrolling, { passive: false });
      window.addEventListener("contextmenu", keepMenuClosed, true);
      holdTimer = setTimeout(() => {
        held = true;
        // The subject shows that it has been picked up before the finger moves.
        dragging = true;
        const at: DragPosition = { dx: 0, dy: 0, clientX: originX, clientY: originY };
        latest.current.onStart?.(subject, at);
        latest.current.onMove(subject, at);
      }, touchHold);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", key, true);
  }, [touchHold]);
}
