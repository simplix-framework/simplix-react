import type { KeyboardEvent } from "react";

const STOP = "[data-process-stop]";
const STEP = "[data-process-step]";

/**
 * Moves focus between the stops of a procedure with the arrow keys.
 *
 * The stops stand in the document in reading order: a step's title, its acts, then the jumps that
 * leave it. Up and Down go to the title of the step before and after, Left and Right to the stop
 * before and after inside the step, Home and End to the first and last step.
 */
export function moveFocus(event: KeyboardEvent<HTMLElement>): void {
  const current = (event.target as HTMLElement).closest<HTMLElement>(STOP);
  if (current === null) return;
  const root = event.currentTarget;
  const step = current.closest<HTMLElement>(STEP);
  const steps = [...root.querySelectorAll<HTMLElement>(STEP)].filter((entry) => entry.querySelector(STOP) !== null);
  const index = step === null ? -1 : steps.indexOf(step);
  let target: HTMLElement | null | undefined;
  if (event.key === "ArrowDown") target = steps[index + 1]?.querySelector<HTMLElement>(STOP);
  else if (event.key === "ArrowUp") target = index > 0 ? steps[index - 1].querySelector<HTMLElement>(STOP) : undefined;
  else if (event.key === "Home") target = steps[0]?.querySelector<HTMLElement>(STOP);
  else if (event.key === "End") target = steps[steps.length - 1]?.querySelector<HTMLElement>(STOP);
  else if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && step !== null) {
    // The title, then the acts, then the jumps, whatever order the layout writes them in.
    const rank = (stop: HTMLElement): number => ["step", "act", "jump"].indexOf((stop.dataset.processStop ?? "").split(":")[0]);
    const stops = [...step.querySelectorAll<HTMLElement>(STOP)].map((stop, order) => ({ stop, order })).sort((a, b) => rank(a.stop) - rank(b.stop) || a.order - b.order).map((entry) => entry.stop);
    target = stops[stops.indexOf(current) + (event.key === "ArrowRight" ? 1 : -1)];
  } else return;
  event.preventDefault();
  target?.focus();
}

/** Brings a step into view and puts focus on its title, as a jump's line does when it is followed. */
export function focusStep(root: HTMLElement | null, stepId: string, smooth: boolean): void {
  const step = root?.querySelector<HTMLElement>(`[data-process-step="${CSS.escape(stepId)}"]`);
  const stop = step?.querySelector<HTMLElement>(STOP);
  if (stop === undefined || stop === null) return;
  stop.scrollIntoView({ block: "center", inline: "nearest", behavior: smooth ? "smooth" : "auto" });
  stop.focus({ preventScroll: true });
}
