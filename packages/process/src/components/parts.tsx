import type { GridCell, Inclusion, RunMark, Segment, SegmentEnd } from "@simplix-react/process-core";
import { CheckIcon, CircleDashedIcon, CircleDotIcon, PencilLineIcon, RepeatIcon, ShieldCheckIcon, SkipForwardIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import type { ProcessView } from "../lib/view-model";

/** The translate function of this package's own wording. */
export type Translate = (key: string, values?: Record<string, string | number | boolean>) => string;

const LETTER: Record<SegmentEnd, string> = { top: "t", bottom: "b", left: "l", right: "r", center: "c" };
const ORDER = "tblrc";

/** The shape of a segment whichever way it was stated: its two ends, in a fixed order. */
export function shapeOf(segment: Segment): string {
  const ends = [LETTER[segment.from], LETTER[segment.to]].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  return ends.join("");
}

/** The lines of one grid cell. Decoration only: what the lines say is spoken by the steps and jumps themselves. */
export function Lines({ cell, style }: { cell: GridCell; style: CSSProperties }) {
  return (
    <div aria-hidden data-process-slot="lines" data-process-cell={`${cell.row}:${cell.column}`} style={style}>
      {cell.segments.map((segment) => (
        <i key={`${segment.from}-${segment.to}-${segment.style}`} data-process-seg={shapeOf(segment)} data-style={segment.style} />
      ))}
      {cell.segments
        .filter((segment) => segment.arrow === true)
        .map((segment) => (
          <i key={`arrow-${segment.from}-${segment.style}`} data-process-arrow={segment.from === "top" ? "down" : "right"} data-style={segment.style} />
        ))}
    </div>
  );
}

/** A small label beside a title: a condition, a parallel run, a repeat. */
export function Chip({ tone, children }: { tone?: "muted" | "accent" | "warn"; children: ReactNode }) {
  return (
    <span data-process-slot="chip" data-tone={tone ?? "muted"}>
      {children}
    </span>
  );
}

/** How a step or an act of a running case stands: an icon, and the words beside it. */
export function RunBadge({ mark, t }: { mark: RunMark; t: Translate }) {
  const Icon = mark.status === "done" ? CheckIcon : mark.status === "active" ? CircleDotIcon : mark.status === "skipped" ? SkipForwardIcon : CircleDashedIcon;
  return (
    <span data-process-slot="run" data-status={mark.status}>
      <Icon aria-hidden className="size-3.5 shrink-0" />
      <span>{mark.assignee === undefined ? t(`status.${mark.status}`) : `${t(`status.${mark.status}`)} · ${mark.assignee}`}</span>
      {mark.count !== undefined && <span>{t("count", { count: mark.count })}</span>}
    </span>
  );
}

/** The icon of an act's kind. */
export function KindIcon({ kind }: { kind: "do" | "check" }) {
  const Icon = kind === "do" ? PencilLineIcon : ShieldCheckIcon;
  return <Icon aria-hidden className="size-3.5 shrink-0" />;
}

/** The labels under a step's title: whether it is conditional, part of a parallel run, repeating, and its note. */
export function StepNotes({ view, stepId, inclusion, t }: { view: ProcessView; stepId: string; inclusion: Inclusion; t: Translate }) {
  const { step, acts } = view.steps.get(stepId)!;
  const left = acts.filter((entry) => entry.inclusion === "excluded");
  const end = step.repeat === undefined ? undefined : view.steps.get(step.repeat.endedBy);
  return (
    <>
      {(inclusion === "conditional" || step.parallel !== undefined || end !== undefined) && (
        <span data-process-slot="chips">
          {inclusion === "conditional" && <Chip tone="warn">{step.conditionLabel === undefined ? t("conditional") : `${t("conditional")}: ${step.conditionLabel}`}</Chip>}
          {step.parallel !== undefined && <Chip tone="accent">{t("parallel")}</Chip>}
          {end !== undefined && (
            <Chip tone="accent">
              <RepeatIcon aria-hidden className="size-3 shrink-0" />
              {t("repeat", { step: end.step.label })}
            </Chip>
          )}
        </span>
      )}
      {step.note !== undefined && <span data-process-slot="note">{step.note}</span>}
      {left.map(({ act }) => (
        <span key={act.id} data-process-slot="left-out">
          {act.conditionLabel === undefined ? `${t("notApplicable")}: ${act.label}` : `${t("notApplicable")}: ${act.label} (${act.conditionLabel})`}
        </span>
      ))}
    </>
  );
}
