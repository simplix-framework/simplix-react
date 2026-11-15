import { laneColumn } from "@simplix-react/process-core";
import type { GridRow, Id, LaneGeometry, Segment } from "@simplix-react/process-core";
import type { CSSProperties, ReactNode } from "react";

import { jumpSpoken, jumpWords, laneLabels } from "../lib/view-model";
import type { ProcessView } from "../lib/view-model";
import type { ProcessTarget } from "../types";
import { ActTags, Lines, Node, runWords, stepNo, StepNotes } from "./parts";
import type { Translate } from "./parts";

/** Props of {@link LaneGrid}. */
export interface LaneGridProps {
  view: ProcessView;
  geometry: LaneGeometry;
  /** Whether the grid is wider than its box and scrolls sideways. */
  scroll: boolean;
  /** Prefix of the element ids this instance writes, unique on the page. */
  uid: string;
  /** The lanes drawn with the reader's own tint, by id. */
  highlight: ReadonlySet<Id>;
  selected: ProcessTarget | null;
  marks?: Readonly<Record<string, string>>;
  /** The stop that takes the Tab key: the one last focused, or the first. */
  tabStop: string | undefined;
  onPick: (target: ProcessTarget) => void;
  onFollow: (stepId: Id) => void;
  t: Translate;
}

const stopKey = (kind: string, id: string): string => `${kind}:${id}`;

/**
 * A case as a grid of lanes: titles in the first column, the tracks jumps travel in, then one
 * column a lane with a dashed line down its middle. An act is a node on that line with its label
 * under it; the acts of a step stand on one row and the lines between them are drawn from the
 * geometry, piece by piece inside each cell, so nothing is measured.
 */
export function LaneGrid({ view, geometry, scroll, uid, highlight, selected, marks, tabStop, onPick, onFollow, t }: LaneGridProps) {
  const grouped = geometry.lanes.some((lane) => lane.group !== undefined);
  const head = grouped ? 2 : 1;
  const columns = 1 + geometry.leftTracks + geometry.lanes.length + geometry.rightTracks;
  // Titles and headings may reach over the tracks on the left, which hold lines and no words.
  const titleColumns = `1 / ${geometry.leftTracks + 2}`;
  const at = (row: number, column: number, rowEnd = row): CSSProperties => ({ gridRow: `${row + head + 1} / ${rowEnd + head + 2}`, gridColumn: column + 1 });
  const across = (row: number): CSSProperties => ({ gridRow: row + head + 1, gridColumn: `1 / ${columns + 1}` });
  const isPicked = (kind: ProcessTarget["kind"], id: string): boolean => selected !== null && selected.kind === kind && selected.id === id;
  const stop = (kind: string, id: string) => ({ "data-process-stop": stopKey(kind, id), tabIndex: tabStop === stopKey(kind, id) ? 0 : -1 });

  const spans = new Map(geometry.steps.map((span) => [span.stepId, span]));
  /** The step each row belongs to: the rows of a step, and before them the rows that lead into it. */
  const stepOf: (Id | undefined)[] = [];
  const nextStep: (Id | undefined)[] = new Array(geometry.rows.length).fill(undefined);
  geometry.rows.forEach((row, index) => {
    stepOf[index] = row.kind === "acts" || row.kind === "gate" || row.kind === "rework" ? row.stepId : undefined;
  });
  let upcoming: Id | undefined;
  for (let index = geometry.rows.length - 1; index >= 0; index -= 1) {
    nextStep[index] = upcoming;
    const row = geometry.rows[index];
    if (row.kind === "acts" && spans.get(row.stepId)?.node.row === index) upcoming = row.stepId;
  }
  const reached = (stepId: Id | undefined): boolean => {
    if (stepId === undefined) return geometry.steps.length > 0 && geometry.steps.every((span) => view.stepMark(span.stepId)?.status === "done" || view.stepMark(span.stepId)?.status === "skipped");
    const status = view.stepMark(stepId)?.status;
    return status === "done" || status === "active";
  };
  /** A line of the stated order is drawn reached once the running case has come to the step it leads into. */
  const onLine = (row: number) => (segment: Segment): boolean => {
    if (segment.style !== "flow" && segment.style !== "repeat") return false;
    const kind = geometry.rows[row].kind;
    // On a step's own rows the line coming in from above leads into that step; every other piece leads into the next one.
    if (kind === "gate" || (kind === "acts" && segment.from === "top")) return reached(stepOf[row]);
    return reached(nextStep[row]);
  };

  // The lanes that hold the act in progress: of the step in progress, the acts marked so, or all of its acts where none is.
  const currentLanes = new Set<Id>();
  for (const span of geometry.steps) {
    if (view.stepMark(span.stepId)?.status !== "active") continue;
    const acts = view.steps.get(span.stepId)!.acts.filter((entry) => entry.inclusion !== "excluded").map((entry) => entry.act);
    const marked = acts.filter((act) => view.actMark(act.id)?.status === "active");
    for (const act of marked.length > 0 ? marked : acts) act.lanes.forEach((lane) => currentLanes.add(lane));
  }

  // Lane group headings: one cell over each run of neighbouring lanes that share a group, shaded in turn.
  const groupCells: ReactNode[] = [];
  const band: boolean[] = [];
  let from = 0;
  let runIndex = 0;
  while (from < geometry.lanes.length) {
    let to = from;
    while (to + 1 < geometry.lanes.length && geometry.lanes[to + 1].group === geometry.lanes[from].group) to += 1;
    for (let lane = from; lane <= to; lane += 1) band[lane] = grouped ? runIndex % 2 === 1 : lane % 2 === 1;
    if (grouped) {
      groupCells.push(
        <div key={`group-${from}`} aria-hidden data-process-slot="lane-group" data-band={runIndex % 2 === 1 || undefined} style={{ gridRow: 1, gridColumn: `${laneColumn(geometry, from) + 1} / ${laneColumn(geometry, to) + 2}` }}>
          {geometry.lanes[from].group}
        </div>,
      );
    }
    from = to + 1;
    runIndex += 1;
  }

  const stepCells = (stepId: Id): ReactNode => {
    const span = spans.get(stepId)!;
    const resolved = view.steps.get(stepId)!;
    const mark = view.stepMark(stepId);
    return (
      <li key={stepId} data-process-step={stepId} data-process-slot="step" data-run={mark?.status}>
        <div data-process-slot="step-title" data-selected={isPicked("step", stepId) || undefined} data-mark={marks?.[stepId]} data-run={mark?.status} data-parallel={resolved.step.parallel !== undefined || undefined} style={at(span.firstRow, 0, span.lastRow)}>
          <button type="button" {...stop("step", stepId)} data-process-slot="step-button" aria-current={mark?.status === "active" ? "step" : undefined} onClick={() => onPick({ kind: "step", id: stepId })}>
            <span data-process-slot="step-number" aria-label={t("stepNumber", { number: resolved.number })}>
              {stepNo(resolved.number)}
            </span>
            <span data-process-slot="step-label">{resolved.step.label}</span>
          </button>
          <StepNotes view={view} step={resolved} inclusion={resolved.inclusion} arrivals={span.arrivals} mark={mark} t={t} />
          {span.jumps.map((id) => {
            const jump = view.jumps.get(id)!;
            return (
              <button
                key={id}
                type="button"
                {...stop("jump", id)}
                data-process-slot="jump"
                data-process-jump={id}
                data-direction={jump.direction}
                data-selected={isPicked("jump", id) || undefined} data-mark={marks?.[id]}
                aria-label={jumpSpoken(jump, t)}
                onClick={() => {
                  onPick({ kind: "jump", id });
                  if (jump.jump.to !== undefined) onFollow(jump.jump.to);
                }}
              >
                {jumpWords(jump, t)}
              </button>
            );
          })}
        </div>
        {geometry.rows.map((row, index) => {
          if (row.kind !== "acts" || row.stepId !== stepId) return null;
          return row.acts.map((entry) => {
            const act = view.acts.get(entry.actId)!;
            const actMark = view.actMark(act.id) ?? (mark?.status === "done" || mark?.status === "skipped" ? { status: mark.status } : undefined);
            return entry.boxes.map((lane) => {
              const main = lane === entry.enter;
              return (
                <div key={`${act.id}-${lane}`} data-process-slot="act-cell" style={at(index, laneColumn(geometry, lane))}>
                  {main ? (
                    <button
                      type="button"
                      {...stop("act", act.id)}
                      data-process-slot="act"
                      data-process-act={act.id}
                      data-kind={act.kind}
                      data-run={actMark?.status}
                      data-selected={isPicked("act", act.id) || undefined} data-mark={marks?.[act.id]}
                      aria-label={[`${t(`kind.${act.kind}`)}: ${act.label}`, laneLabels(view, act).join(", "), actMark === undefined ? "" : runWords(actMark, t)].filter((part) => part.length > 0).join(", ")}
                      onClick={() => onPick(act.ref === undefined ? { kind: "act", id: act.id } : { kind: "act", id: act.id, ref: act.ref })}
                    >
                      <Node order={entry.order} first={entry.order === 1} mark={actMark} />
                      <span data-process-slot="act-line">
                        <span data-process-slot="act-label">{act.label}</span>
                        <ActTags act={act} />
                        {actMark?.assignee !== undefined && <span data-process-slot="act-holder">{actMark.assignee}</span>}
                      </span>
                    </button>
                  ) : (
                    <span aria-hidden data-process-slot="act" data-shadow>
                      <Node order={entry.order} first={entry.order === 1} mark={actMark} />
                    </span>
                  )}
                </div>
              );
            });
          });
        })}
      </li>
    );
  };

  const offStep = (row: Extract<GridRow, { kind: "excluded" | "folded" }>, index: number): ReactNode => {
    const resolved = view.steps.get(row.stepId)!;
    const reason = row.kind === "folded" ? t("folded") : resolved.step.conditionLabel === undefined ? t("notApplicable") : `${t("notApplicable")}: ${resolved.step.conditionLabel}`;
    return (
      <li key={row.stepId} data-process-step={row.stepId} data-process-slot="step" data-inclusion={row.kind}>
        <div data-process-slot="step-off" style={{ gridRow: index + head + 1, gridColumn: titleColumns }}>
          <span data-process-slot="step-number" aria-label={t("stepNumber", { number: resolved.number })}>
            {stepNo(resolved.number)}
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
    if ((row.kind === "acts" || row.kind === "gate") && !placed.has(row.stepId)) {
      placed.add(row.stepId);
      current.steps.push(stepCells(row.stepId));
    } else if (row.kind === "excluded" || row.kind === "folded") current.steps.push(offStep(row, index));
  });

  // `repeat(0, ...)` is not a track list, so a part with nothing to repeat is left out.
  const template = [
    "var(--process-title-width)",
    geometry.leftTracks > 0 ? `repeat(${geometry.leftTracks}, var(--process-track-width))` : "",
    // A grid that scrolls gives each lane its least width: a share of a width measured from the
    // lanes' own unbroken names would draw every lane wider than that and scroll further.
    geometry.lanes.length > 0 ? `repeat(${geometry.lanes.length}, ${scroll ? "var(--process-lane-min-width)" : "minmax(var(--process-lane-min-width), 1fr)"})` : "",
    geometry.rightTracks > 0 ? `repeat(${geometry.rightTracks}, var(--process-track-width))` : "",
  ]
    .filter((part) => part.length > 0)
    .join(" ");
  const bodyRows = `${head + 1} / ${geometry.rows.length + head + 1}`;

  return (
    <div data-process-slot="grid" data-scroll={scroll || undefined} data-grouped={grouped || undefined} style={{ gridTemplateColumns: template }}>
      {Array.from({ length: head }, (_, row) => (
        <div key={`head-${row}`} aria-hidden data-process-slot="head-band" data-head-row={row + 1} style={{ gridRow: row + 1, gridColumn: `1 / ${columns + 1}` }} />
      ))}
      <div aria-hidden data-process-slot="corner" style={{ gridRow: `1 / ${head + 1}`, gridColumn: 1 }} />
      {groupCells}
      {geometry.lanes.map((lane, index) => (
        <div key={lane.id} aria-hidden data-process-slot="lane-head" data-process-lane={lane.id} data-highlight={highlight.has(lane.id) || undefined} data-current={currentLanes.has(lane.id) || undefined} style={{ gridRow: head, gridColumn: laneColumn(geometry, index) + 1 }}>
          <span data-process-slot="lane-name">{highlight.has(lane.id) ? `${t("myLane")} · ${lane.label}` : lane.label}</span>
          {lane.caption !== undefined && <span data-process-slot="lane-caption">{lane.caption}</span>}
        </div>
      ))}
      {geometry.rows.length > 0 &&
        geometry.lanes.map((lane, index) => (
          <div key={`life-${lane.id}`} aria-hidden data-process-slot="lane" data-band={band[index] || undefined} data-highlight={highlight.has(lane.id) || undefined} style={{ gridRow: bodyRows, gridColumn: laneColumn(geometry, index) + 1 }} />
        ))}
      {geometry.rows.map((row, index) => {
        const owner = stepOf[index];
        const first = owner !== undefined && spans.get(owner)?.firstRow === index;
        const last = owner !== undefined && spans.get(owner)?.lastRow === index;
        return <div key={`row-${index}`} aria-hidden data-process-slot="row" data-row={row.kind} data-step-start={first || undefined} data-step-end={last || undefined} data-run={owner === undefined ? undefined : view.stepMark(owner)?.status} style={across(index)} />;
      })}
      {geometry.rows.length > 0 && <div aria-hidden data-process-slot="title-backdrop" style={{ gridRow: bodyRows, gridColumn: 1 }} />}
      {geometry.groups.map((group) => (
        <div key={`run-${group.key}`} aria-hidden data-process-slot="parallel-run" style={at(group.firstRow, 0, group.lastRow)} />
      ))}
      {geometry.cells.map((cell) => {
        const kind = geometry.rows[cell.row].kind;
        return <Lines key={`${cell.row}:${cell.column}`} cell={cell} mid={kind === "acts" || kind === "rework" ? "node" : kind === "gate" ? "gate" : "half"} on={onLine(cell.row)} style={at(cell.row, cell.column)} />;
      })}
      {geometry.rows.map((row, index) => {
        if (row.kind === "start" || row.kind === "end") {
          return (
            <div key={`mark-${row.kind}`} aria-hidden data-process-slot="marker-cell" style={at(index, laneColumn(geometry, row.lane))}>
              <span data-process-slot="marker" data-kind={row.kind} />
              <span data-process-slot="marker-label">{t(row.kind)}</span>
            </div>
          );
        }
        if (row.kind !== "rework") return null;
        const label = view.steps.get(row.stepId)!.step.rework!.label;
        return [
          <div key={`rework-${row.stepId}`} aria-hidden data-process-slot="rework-cell" style={at(index, laneColumn(geometry, row.lane))}>
            <span data-process-slot="node" data-rework>
              ↺
            </span>
            <span data-process-slot="act-label">{t("reworkAgain")}</span>
          </div>,
          <div key={`via-${row.stepId}`} aria-hidden data-process-slot="via-cell" style={at(index, laneColumn(geometry, row.from))}>
            {row.from !== row.lane && <span data-process-slot="via" />}
            <span data-process-slot="line-tag" data-direction="back">
              {label}
            </span>
          </div>,
        ];
      })}
      {geometry.tags.map((tag) => (
        <div key={`tag-${tag.jumpId}`} aria-hidden data-process-slot="tag-cell" data-side={tag.side} data-gate={tag.gate || undefined} style={at(tag.row, tag.column)}>
          <span data-process-slot="line-tag" data-direction={view.jumps.get(tag.jumpId)!.direction}>
            {view.jumps.get(tag.jumpId)!.jump.label}
          </span>
        </div>
      ))}
      {sections.map((section) => (
        <section key={section.id} data-process-slot="section" aria-labelledby={`${uid}-section-${section.id}`}>
          <h3 id={`${uid}-section-${section.id}`} data-process-slot="section-title" data-process-section={section.id} style={{ gridRow: section.row + head + 1, gridColumn: titleColumns }}>
            {view.sections.get(section.id)!.label}
          </h3>
          <ol data-process-slot="steps">{section.steps}</ol>
        </section>
      ))}
    </div>
  );
}
