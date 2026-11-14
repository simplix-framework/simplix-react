import { laneColumn } from "@simplix-react/process-core";
import type { GridRow, Id, LaneGeometry } from "@simplix-react/process-core";
import { CornerDownRightIcon, CornerUpLeftIcon, ExternalLinkIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { jumpWords, laneLabels } from "../lib/view-model";
import type { ProcessView } from "../lib/view-model";
import type { ProcessTarget } from "../types";
import { KindIcon, Lines, RunBadge, StepNotes } from "./parts";
import type { Translate } from "./parts";

/** Props of {@link LaneGrid}. */
export interface LaneGridProps {
  view: ProcessView;
  geometry: LaneGeometry;
  /** Whether the grid is wider than its box and scrolls sideways. */
  scroll: boolean;
  /** Prefix of the element ids this instance writes, unique on the page. */
  uid: string;
  selected: ProcessTarget | null;
  /** The stop that takes the Tab key: the one last focused, or the first. */
  tabStop: string | undefined;
  onPick: (target: ProcessTarget) => void;
  onFollow: (stepId: Id) => void;
  t: Translate;
}

const stopKey = (kind: string, id: string): string => `${kind}:${id}`;

/**
 * A case as a grid of lanes: titles in the first column, the tracks jumps travel in, then one
 * column a lane. Rows and columns come from the geometry as they stand; the grid only states
 * where each thing goes and lets the browser size it.
 */
export function LaneGrid({ view, geometry, scroll, uid, selected, tabStop, onPick, onFollow, t }: LaneGridProps) {
  const grouped = geometry.lanes.some((lane) => lane.group !== undefined);
  const head = grouped ? 2 : 1;
  const columns = 1 + geometry.trackCount + geometry.lanes.length;
  const at = (row: number, column: number, rowEnd = row): CSSProperties => ({ gridRow: `${row + head + 1} / ${rowEnd + head + 2}`, gridColumn: column + 1 });
  const titleSpan = (row: number, rowEnd = row): CSSProperties => ({ gridRow: `${row + head + 1} / ${rowEnd + head + 2}`, gridColumn: `1 / ${geometry.trackCount + 2}` });
  const isPicked = (kind: ProcessTarget["kind"], id: string): boolean => selected !== null && selected.kind === kind && selected.id === id;
  const stop = (kind: string, id: string) => ({ "data-process-stop": stopKey(kind, id), tabIndex: tabStop === stopKey(kind, id) ? 0 : -1 });

  const exits = new Map<Id, number>();
  geometry.rows.forEach((row, index) => {
    if (row.kind === "exit") exits.set(row.stepId, index);
  });
  const spans = new Map(geometry.steps.map((span) => [span.stepId, span]));

  // Lane group headings: one cell over each run of neighbouring lanes that share a group.
  const groupCells: ReactNode[] = [];
  if (grouped) {
    let from = 0;
    while (from < geometry.lanes.length) {
      let to = from;
      while (to + 1 < geometry.lanes.length && geometry.lanes[to + 1].group === geometry.lanes[from].group) to += 1;
      groupCells.push(
        <div key={`group-${from}`} aria-hidden data-process-slot="lane-group" style={{ gridRow: 1, gridColumn: `${laneColumn(geometry, from) + 1} / ${laneColumn(geometry, to) + 2}` }}>
          {geometry.lanes[from].group}
        </div>,
      );
      from = to + 1;
    }
  }

  const stepCells = (stepId: Id): ReactNode => {
    const span = spans.get(stepId)!;
    const resolved = view.steps.get(stepId)!;
    const mark = view.stepMark(stepId);
    const exit = exits.get(stepId);
    return (
      <li key={stepId} data-process-step={stepId} data-process-slot="step" data-run={mark?.status}>
        <div data-process-slot="step-title" data-selected={isPicked("step", stepId) || undefined} data-run={mark?.status} style={at(span.firstRow, 0, span.lastRow)}>
          <button type="button" {...stop("step", stepId)} data-process-slot="step-button" aria-current={mark?.status === "active" ? "step" : undefined} onClick={() => onPick({ kind: "step", id: stepId })}>
            <span data-process-slot="step-number" aria-label={t("stepNumber", { number: resolved.number })}>
              {resolved.number}
            </span>
            <span data-process-slot="step-label">{resolved.step.label}</span>
          </button>
          {mark !== undefined && <RunBadge mark={mark} t={t} />}
          <StepNotes view={view} stepId={stepId} inclusion={resolved.inclusion} t={t} />
        </div>
        {geometry.rows.map((row, index) => {
          if (row.kind !== "act" || row.stepId !== stepId) return null;
          const act = view.acts.get(row.actId)!;
          const actMark = view.actMark(act.id);
          const lanes = laneLabels(view, act);
          return row.boxes.map((lane) => {
            const primary = lane === row.primary;
            return (
              <div key={`${act.id}-${lane}`} data-process-slot="act-cell" style={at(index, laneColumn(geometry, lane))}>
                <button
                  type="button"
                  {...(primary ? stop("act", act.id) : { tabIndex: -1, "aria-hidden": true })}
                  data-process-slot="act"
                  data-process-act={act.id}
                  data-kind={act.kind}
                  data-run={actMark?.status}
                  data-selected={isPicked("act", act.id) || undefined}
                  aria-label={primary ? `${t(`kind.${act.kind}`)}: ${act.label} (${lanes.join(", ")})` : undefined}
                  onClick={() => onPick(act.ref === undefined ? { kind: "act", id: act.id } : { kind: "act", id: act.id, ref: act.ref })}
                >
                  <KindIcon kind={act.kind} />
                  <span data-process-slot="act-label">{act.label}</span>
                  {actMark !== undefined && primary && <RunBadge mark={actMark} t={t} />}
                </button>
              </div>
            );
          });
        })}
        {exit !== undefined && (
          <div data-process-slot="jumps" style={at(exit, 0)}>
            {(geometry.rows[exit] as Extract<GridRow, { kind: "exit" }>).jumps.map((id) => {
              const jump = view.jumps.get(id)!;
              const Icon = jump.direction === "back" ? CornerUpLeftIcon : jump.direction === "skip" ? CornerDownRightIcon : ExternalLinkIcon;
              return (
                <button
                  key={id}
                  type="button"
                  {...stop("jump", id)}
                  data-process-slot="jump"
                  data-process-jump={id}
                  data-direction={jump.direction}
                  data-selected={isPicked("jump", id) || undefined}
                  onClick={() => {
                    onPick({ kind: "jump", id });
                    if (jump.jump.to !== undefined) onFollow(jump.jump.to);
                  }}
                >
                  <Icon aria-hidden className="size-3.5 shrink-0" />
                  <span>{jumpWords(jump, t)}</span>
                </button>
              );
            })}
          </div>
        )}
      </li>
    );
  };

  const offStep = (row: Extract<GridRow, { kind: "excluded" | "folded" }>, index: number): ReactNode => {
    const resolved = view.steps.get(row.stepId)!;
    const reason = row.kind === "folded" ? t("folded") : resolved.step.conditionLabel === undefined ? t("notApplicable") : `${t("notApplicable")}: ${resolved.step.conditionLabel}`;
    return (
      <li key={row.stepId} data-process-step={row.stepId} data-process-slot="step" data-inclusion={row.kind}>
        <div data-process-slot="step-off" style={titleSpan(index)}>
          <span data-process-slot="step-number" aria-label={t("stepNumber", { number: resolved.number })}>
            {resolved.number}
          </span>
          <span data-process-slot="step-label">{resolved.step.label}</span>
          <span data-process-slot="off-reason">{reason}</span>
        </div>
      </li>
    );
  };

  // The rows of each section, so that a section's heading and its steps are one landmark in reading order.
  const sections: { id: Id; row: number; steps: ReactNode[] }[] = [];
  const placed = new Set<Id>();
  geometry.rows.forEach((row, index) => {
    if (row.kind === "section") sections.push({ id: row.sectionId, row: index, steps: [] });
    const current = sections[sections.length - 1];
    if (current === undefined) return;
    if ((row.kind === "act" || row.kind === "entry") && !placed.has(row.stepId)) {
      placed.add(row.stepId);
      current.steps.push(stepCells(row.stepId));
    } else if (row.kind === "excluded" || row.kind === "folded") current.steps.push(offStep(row, index));
  });

  // `repeat(0, ...)` is not a track list, so a part with nothing to repeat is left out.
  const template = [
    "var(--process-title-width)",
    geometry.trackCount > 0 ? `repeat(${geometry.trackCount}, var(--process-track-width))` : "",
    geometry.lanes.length > 0 ? `repeat(${geometry.lanes.length}, minmax(var(--process-lane-min-width), 1fr))` : "",
  ]
    .filter((part) => part.length > 0)
    .join(" ");

  return (
    <div
      data-process-slot="grid"
      data-scroll={scroll || undefined}
      style={{ gridTemplateColumns: template }}
    >
      {Array.from({ length: head }, (_, row) => (
        <div key={`head-${row}`} aria-hidden data-process-slot="head-band" style={{ gridRow: row + 1, gridColumn: `1 / ${columns + 1}` }} />
      ))}
      <div aria-hidden data-process-slot="corner" style={{ gridRow: `1 / ${head + 1}`, gridColumn: 1 }} />
      {groupCells}
      {geometry.lanes.map((lane, index) => (
        <div key={lane.id} aria-hidden data-process-slot="lane-head" data-process-lane={lane.id} style={{ gridRow: head, gridColumn: laneColumn(geometry, index) + 1 }}>
          {lane.label}
        </div>
      ))}
      {geometry.rows.map((row, index) => (
        <div key={`row-${index}`} aria-hidden data-process-slot="row" data-row={row.kind} style={{ gridRow: index + head + 1, gridColumn: `1 / ${columns + 1}` }} />
      ))}
      {geometry.groups.map((group) => (
        <div key={`run-${group.key}`} aria-hidden data-process-slot="parallel-run" style={at(group.firstRow, 0, group.lastRow)} />
      ))}
      {geometry.cells.map((cell) => (
        <Lines key={`${cell.row}:${cell.column}`} cell={cell} style={at(cell.row, cell.column)} />
      ))}
      {geometry.rows.map((row, index) =>
        row.kind === "start" || row.kind === "end" ? (
          <div key={`mark-${row.kind}`} aria-hidden data-process-slot="marker-cell" style={at(index, laneColumn(geometry, row.lane))}>
            <span data-process-slot="marker" data-kind={row.kind} />
            <span data-process-slot="marker-label">{t(row.kind)}</span>
          </div>
        ) : null,
      )}
      {sections.map((section) => (
        <section key={section.id} data-process-slot="section" aria-labelledby={`${uid}-section-${section.id}`}>
          <h3 id={`${uid}-section-${section.id}`} data-process-slot="section-title" data-process-section={section.id} style={titleSpan(section.row)}>
            {view.sections.get(section.id)!.label}
          </h3>
          <ol data-process-slot="steps">{section.steps}</ol>
        </section>
      ))}
    </div>
  );
}
