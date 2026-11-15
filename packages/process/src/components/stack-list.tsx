import type { Id, StackBlock } from "@simplix-react/process-core";
import type { ReactNode } from "react";

import { jumpSpoken, jumpWords } from "../lib/view-model";
import type { ProcessView } from "../lib/view-model";
import type { ProcessTarget } from "../types";
import { ActTags, Node, runWords, stepNo, StepNotes } from "./parts";
import type { Translate } from "./parts";

/** Props of {@link StackList}. */
export interface StackListProps {
  view: ProcessView;
  blocks: StackBlock[];
  /** The lanes shown, by id. An act none of whose lanes is among them is left off its card. */
  lanes: ReadonlySet<Id>;
  /** The lanes the reader holds, by id. */
  highlight: ReadonlySet<Id>;
  /** Prefix of the element ids this instance writes, unique on the page. */
  uid: string;
  selected: ProcessTarget | null;
  marks?: Readonly<Record<string, string>>;
  tabStop: string | undefined;
  onPick: (target: ProcessTarget) => void;
  onFollow: (stepId: Id) => void;
  renderDetail?: (target: ProcessTarget) => ReactNode;
  t: Translate;
}

type StepBlock = Extract<StackBlock, { kind: "step" }>;

/**
 * A case as one column: a card a step, its acts listed as the nodes they are on the lane grid
 * with the lanes that perform them, and under them the jumps that leave it, each a line that
 * goes to the step it names. One rail runs down the column through every step's number and
 * nodes, from a start mark to an end mark, drawn as done as far as the running case has come.
 */
export function StackList({ view, blocks, lanes, highlight, uid, selected, marks, tabStop, onPick, onFollow, renderDetail, t }: StackListProps) {
  const isPicked = (kind: ProcessTarget["kind"], id: string): boolean => selected !== null && selected.kind === kind && selected.id === id;
  const stop = (kind: string, id: string) => ({ "data-process-stop": `${kind}:${id}`, tabIndex: tabStop === `${kind}:${id}` ? 0 : -1 });
  const arrivals = new Map<Id, Id[]>();
  for (const jump of view.process.jumps) {
    if (jump.drawn && jump.jump.to !== undefined) arrivals.set(jump.jump.to, [...(arrivals.get(jump.jump.to) ?? []), jump.jump.id]);
  }

  const card = (block: StepBlock): ReactNode => {
    const resolved = view.steps.get(block.stepId)!;
    const mark = view.stepMark(block.stepId);
    const acts = block.acts.filter((entry) => entry.lanes.some((lane) => lanes.has(lane)));
    const off = block.inclusion === "excluded" || acts.length === 0;
    const reason = block.inclusion !== "excluded" ? t("folded") : resolved.step.conditionLabel === undefined ? t("notApplicable") : `${t("notApplicable")}: ${resolved.step.conditionLabel}`;
    const picked = selected !== null && (isPicked("step", block.stepId) || acts.some((entry) => isPicked("act", entry.actId)) || block.jumps.some((entry) => isPicked("jump", entry.jumpId)));
    return (
      <li key={block.stepId} data-process-step={block.stepId} data-process-slot="card" data-inclusion={off ? (block.inclusion === "excluded" ? "excluded" : "folded") : block.inclusion} data-run={mark?.status}>
        {off ? (
          <div data-process-slot="step-off">
            <span data-process-slot="step-number" aria-label={t("stepNumber", { number: block.number })}>
              {stepNo(block.number)}
            </span>
            <span data-process-slot="step-label">{resolved.step.label}</span>
            <span data-process-slot="off-reason">{reason}</span>
          </div>
        ) : (
          <>
            <div data-process-slot="card-head" data-selected={isPicked("step", block.stepId) || undefined} data-mark={marks?.[block.stepId]}>
              <button type="button" {...stop("step", block.stepId)} data-process-slot="step-button" aria-current={mark?.status === "active" ? "step" : undefined} onClick={() => onPick({ kind: "step", id: block.stepId })}>
                <span data-process-slot="step-number" aria-label={t("stepNumber", { number: block.number })}>
                  {stepNo(block.number)}
                </span>
                <span data-process-slot="step-label">{resolved.step.label}</span>
              </button>
              <StepNotes view={view} step={resolved} inclusion={block.inclusion} arrivals={arrivals.get(block.stepId) ?? []} mark={mark} t={t} />
            </div>
            <ol data-process-slot="card-acts">
              {acts.map((entry, index) => {
                const act = view.acts.get(entry.actId)!;
                const actMark = view.actMark(act.id) ?? (mark?.status === "done" || mark?.status === "skipped" ? { status: mark.status } : undefined);
                return (
                  <li key={act.id}>
                    <button
                      type="button"
                      {...stop("act", act.id)}
                      data-process-slot="act"
                      data-process-act={act.id}
                      data-kind={act.kind}
                      data-selected={isPicked("act", act.id) || undefined} data-mark={marks?.[act.id]}
                      onClick={() => onPick(act.ref === undefined ? { kind: "act", id: act.id } : { kind: "act", id: act.id, ref: act.ref })}
                    >
                      <Node order={index + 1} first={index === 0} mark={actMark} />
                      <span data-process-slot="act-text">
                        <span className="sr-only">{`${t(`kind.${act.kind}`)}: `}</span>
                        <span data-process-slot="act-label">{act.label}</span>
                        <span data-process-slot="act-lanes">
                          {entry.lanes.map((lane) => (highlight.has(lane) ? `${t("myLane")} · ${view.lanes.get(lane)?.label ?? lane}` : (view.lanes.get(lane)?.label ?? lane))).join(" · ")}
                          {actMark === undefined ? "" : ` · ${runWords(actMark, t)}`}
                        </span>
                      </span>
                      <ActTags act={act} />
                    </button>
                  </li>
                );
              })}
            </ol>
            {block.jumps.length > 0 && (
              <div data-process-slot="jumps">
                {block.jumps.map((entry) => {
                  const jump = view.jumps.get(entry.jumpId)!;
                  return (
                    <button
                      key={entry.jumpId}
                      type="button"
                      {...stop("jump", entry.jumpId)}
                      data-process-slot="jump"
                      data-process-jump={entry.jumpId}
                      data-direction={jump.direction}
                      data-selected={isPicked("jump", entry.jumpId) || undefined} data-mark={marks?.[entry.jumpId]}
                      aria-label={jumpSpoken(jump, t)}
                      onClick={() => {
                        onPick({ kind: "jump", id: entry.jumpId });
                        if (jump.jump.to !== undefined) onFollow(jump.jump.to);
                      }}
                    >
                      {jumpWords(jump, t)}
                    </button>
                  );
                })}
              </div>
            )}
            {picked && renderDetail !== undefined && <div data-process-slot="detail">{renderDetail(selected!)}</div>}
          </>
        )}
      </li>
    );
  };

  // Sections hold their steps; a parallel run is a list of its own inside the section's list.
  const sections: ReactNode[] = [];
  let index = 0;
  while (index < blocks.length) {
    const head = blocks[index];
    if (head.kind !== "section") {
      index += 1;
      continue;
    }
    const items: ReactNode[] = [];
    index += 1;
    while (index < blocks.length && blocks[index].kind !== "section") {
      const block = blocks[index];
      if (block.kind === "step") items.push(card(block));
      else if (block.kind === "group-start") {
        const run: ReactNode[] = [];
        index += 1;
        while (index < blocks.length && blocks[index].kind === "step") {
          run.push(card(blocks[index] as StepBlock));
          index += 1;
        }
        items.push(
          <li key={`run-${block.key}`} data-process-slot="parallel-run">
            <span data-process-slot="parallel-title">
              <span data-process-slot="parallel-name">{`∥ ${t("parallel")}`}</span>
              <span data-process-slot="parallel-hint">{t("parallelHint")}</span>
            </span>
            <ol data-process-slot="steps">{run}</ol>
          </li>,
        );
        continue;
      }
      index += 1;
    }
    const id = `${uid}-section-${head.sectionId}`;
    sections.push(
      <section key={head.sectionId} data-process-slot="section" aria-labelledby={id}>
        <h3 id={id} data-process-slot="section-title" data-process-section={head.sectionId}>
          {view.sections.get(head.sectionId)!.label}
        </h3>
        <ol data-process-slot="steps">{items}</ol>
      </section>,
    );
  }
  // The column reads as one line of history: a start mark, the steps on a rail, an end mark.
  return (
    <div data-process-slot="stack">
      <div aria-hidden data-process-slot="stack-marker" data-kind="start">
        <span data-process-slot="marker" data-kind="start" />
        <span data-process-slot="marker-label">{t("start")}</span>
      </div>
      {sections}
      <div aria-hidden data-process-slot="stack-marker" data-kind="end">
        <span data-process-slot="marker" data-kind="end" />
        <span data-process-slot="marker-label">{t("end")}</span>
      </div>
    </div>
  );
}
