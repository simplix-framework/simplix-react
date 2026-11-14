import { Badge } from "@simplix-react/ui";
import type { Act, GridCell, Inclusion, ResolvedStep, RunMark, Segment, SegmentEnd } from "@simplix-react/process-core";
import { CheckIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import type { ProcessView } from "../lib/view-model";

/** The translate function of this package's own wording. */
export type Translate = (key: string, values?: Record<string, string | number | boolean>) => string;

/** A step's number as the grid writes it: two digits, so that a column of them lines up. */
export const stepNo = (number: number): string => String(number).padStart(2, "0");

/** The shape of a segment whichever way it was stated: its two ends in alphabetical order. */
export function shapeOf(segment: Segment): string {
  return [segment.from, segment.to].sort().join("_");
}

/** Which way a line runs as it leaves a cell by each edge. */
const LEAVING: Partial<Record<SegmentEnd, "down" | "up" | "left" | "right">> = { top: "up", bottom: "down", left: "left", right: "right" };

/** Which way an arrowhead at a segment's `to` end points, and where on the cell it stands. */
function arrowOf(segment: Segment): { direction: "down" | "right" | "left" | "up"; at: string } {
  const from: SegmentEnd = segment.from;
  if (segment.to === "center") {
    if (from === "top") return { direction: "down", at: "node" };
    return { direction: from === "right" ? "left" : "right", at: "node" };
  }
  if (segment.to === "side-bottom" || segment.to === "rside-bottom") return { direction: "down", at: segment.to === "side-bottom" ? "side" : "rside" };
  return { direction: segment.to === "left" ? "left" : "right", at: "edge" };
}

/**
 * The lines of one grid cell. Decoration only: what the lines say is spoken by the steps and
 * jumps themselves.
 *
 * @param on whether a line of the stated order has been reached by the running case
 */
export function Lines({ cell, mid, on, style }: { cell: GridCell; mid: "node" | "half" | "gate"; on: (segment: Segment) => boolean; style: CSSProperties }) {
  return (
    <div aria-hidden data-process-slot="lines" data-process-cell={`${cell.row}:${cell.column}`} data-mid={mid} style={style}>
      {cell.segments.map((segment) => (
        <i key={`${segment.from}-${segment.to}-${segment.style}`} data-process-seg={shapeOf(segment)} data-style={segment.style} data-hop={segment.hop || undefined} data-on={on(segment) || undefined} />
      ))}
      {cell.segments
        .filter((segment) => segment.arrow === true)
        .map((segment) => {
          const arrow = arrowOf(segment);
          return <i key={`arrow-${segment.from}-${segment.to}-${segment.style}`} data-process-arrow={arrow.direction} data-at={arrow.at} data-style={segment.style} data-on={on(segment) || undefined} />;
        })}
      {cell.segments
        .filter((segment) => segment.tail === true)
        .map((segment) => (
          <i key={`tail-${segment.from}-${segment.to}-${segment.style}`} data-process-arrow={LEAVING[segment.to] ?? "down"} data-at="bend" data-style={segment.style} data-on={on(segment) || undefined} />
        ))}
    </div>
  );
}

/**
 * The circle an act is drawn as. The first act of a step is filled and the acts that take over
 * from it are outlined, each with its place in the step; a finished act carries a check instead,
 * and the act in progress is ringed.
 */
export function Node({ order, first, mark }: { order: number; first: boolean; mark: RunMark | undefined }) {
  return (
    <span data-process-slot="node" data-first={first || undefined} data-run={mark?.status}>
      {mark?.status === "done" ? <CheckIcon aria-hidden className="size-3" strokeWidth={3} /> : order}
    </span>
  );
}

/** The marks an act carries beside its label. */
export function ActTags({ act }: { act: Act }) {
  if (act.tags === undefined || act.tags.length === 0) return null;
  return (
    <Badge variant="success" size="sm" data-process-slot="act-tags">
      {act.tags.join(" · ")}
    </Badge>
  );
}

/** How a step or an act of a running case stands, in words: its status and who holds it. */
export function runWords(mark: RunMark, t: Translate): string {
  const words = [t(`status.${mark.status}`)];
  if (mark.assignee !== undefined) words.push(mark.assignee);
  if (mark.count !== undefined) words.push(t("count", { count: mark.count }));
  return words.join(" · ");
}

/**
 * The marks under a step's title: its condition, a parallel run, a repeat, the jumps that arrive
 * at it, its rework ground, then its note and the acts the case leaves out.
 */
export function StepNotes({ view, step, inclusion, arrivals, mark, t }: { view: ProcessView; step: ResolvedStep; inclusion: Inclusion; arrivals: readonly string[]; mark: RunMark | undefined; t: Translate }) {
  const left = step.acts.filter((entry) => entry.inclusion === "excluded");
  const end = step.step.repeat === undefined ? undefined : view.steps.get(step.step.repeat.endedBy);
  // Green says done or in progress and nothing else: what a step is (repeating, part of a parallel run) is marked in a neutral colour.
  const tags: ReactNode[] = [];
  if (inclusion === "conditional") {
    tags.push(
      <Badge key="condition" variant="warning" size="sm">
        {step.step.conditionLabel === undefined ? t("conditional") : `${t("condition")} · ${step.step.conditionLabel}`}
      </Badge>,
    );
  }
  if (end !== undefined) {
    tags.push(
      <Badge key="repeat" variant="secondary" size="sm">
        {t("repeat", { step: stepNo(end.number) })}
      </Badge>,
    );
  }
  if (step.step.parallel !== undefined) {
    tags.push(
      <Badge key="parallel" variant="secondary" size="sm">
        {`∥ ${t("parallel")}`}
      </Badge>,
    );
  }
  for (const id of arrivals) {
    const jump = view.jumps.get(id);
    if (jump === undefined) continue;
    tags.push(
      <Badge key={`from-${id}`} variant="outline" size="sm" data-direction={jump.direction}>
        {t(`from.${jump.direction}`, { number: stepNo(jump.fromNumber) })}
      </Badge>,
    );
  }
  if (step.step.rework !== undefined) {
    tags.push(
      <Badge key="rework" variant="outline" size="sm" data-direction="back">
        {`↺ ${step.step.rework.label}`}
      </Badge>,
    );
  }
  return (
    <>
      {step.step.note !== undefined && <span data-process-slot="note">{step.step.note}</span>}
      {mark !== undefined &&
        (mark.status === "active" ? (
          <span data-process-slot="run" data-status="active">
            <Badge variant="success" size="sm">
              {t("status.active")}
            </Badge>
            {[mark.assignee, mark.count === undefined ? undefined : t("count", { count: mark.count })].filter((part) => part !== undefined).join(" · ")}
          </span>
        ) : (
          <span data-process-slot="run" data-status={mark.status}>
            {runWords(mark, t)}
          </span>
        ))}
      {tags.length > 0 && <span data-process-slot="chips">{tags}</span>}
      {left.map(({ act }) => (
        <span key={act.id} data-process-slot="left-out">
          {act.conditionLabel === undefined ? `${t("notApplicable")}: ${act.label}` : `${t("notApplicable")}: ${act.label} (${act.conditionLabel})`}
        </span>
      ))}
    </>
  );
}
