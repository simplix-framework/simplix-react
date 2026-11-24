import { chooseLayout, DEFAULT_LAYOUT_METRICS, laneGeometry, resolveProcess, showsInclusion, stackGeometry } from "@simplix-react/process-core";
import type { Id, LayoutMode } from "@simplix-react/process-core";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, FocusEvent } from "react";

import { Button } from "@simplix-react/ui";

import { cn } from "../lib/cn";
import { focusStep, moveFocus } from "../lib/keyboard";
import { useContainerWidth } from "../lib/use-container-width";
import { useProcessTranslation } from "../lib/use-process-translation";
import { viewOf } from "../lib/view-model";
import type { ProcessLanesProps, ProcessTarget } from "../types";
import { LaneGrid } from "./lane-grid";
import { StackList } from "./stack-list";

const reducedMotion = (): boolean => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A procedure drawn from its definition: steps and acts on a grid of lanes where the box it
 * stands in is wide enough, the same grid scrolled sideways where it is not, and one column of
 * step cards on a narrow box.
 *
 * The layout follows the width of the component's own box and the lanes it has to show, never
 * the width of the screen, so a narrow side panel on a wide screen gets the narrow layout.
 *
 * @example
 * ```tsx
 * <ProcessLanes definition={definition} facts={{ large: true }} onSelect={(target) => open(target)} />
 * ```
 */
export function ProcessLanes({
  definition,
  facts,
  run,
  layout = "auto",
  defaultLayout = "lanes",
  metrics,
  visibleLanes,
  onVisibleLanesChange,
  highlightLanes,
  leftOut = "drawn",
  laneFilter = false,
  selected = null,
  marks,
  onSelect,
  renderDetail,
  scrollToActive = true,
  className,
}: ProcessLanesProps) {
  const t = useProcessTranslation();
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(root);
  const sizes = useMemo(() => ({ ...DEFAULT_LAYOUT_METRICS, ...metrics }), [metrics]);

  const process = useMemo(() => resolveProcess(definition, facts, { leftOut }), [definition, facts, leftOut]);
  const view = useMemo(() => viewOf(process, run), [process, run]);

  const [ownLanes, setOwnLanes] = useState<Id[] | undefined>(undefined);
  const chosen = visibleLanes ?? ownLanes;
  const shownIds = useMemo(() => (chosen === undefined ? process.lanes.map((lane) => lane.id) : process.lanes.filter((lane) => chosen.includes(lane.id)).map((lane) => lane.id)), [chosen, process]);
  const shown = useMemo(() => new Set(shownIds), [shownIds]);
  const highlight = useMemo(() => new Set(highlightLanes ?? []), [highlightLanes]);
  const setLanes = (lanes: Id[]): void => {
    if (visibleLanes === undefined) setOwnLanes(lanes);
    onVisibleLanesChange?.(lanes);
  };

  const geometry = useMemo(() => laneGeometry(process, { lanes: shownIds }), [process, shownIds]);
  const blocks = useMemo(() => stackGeometry(process), [process]);

  // The layout in use is kept so that a width sitting on a threshold does not flip it back and forth.
  const previous = useRef<LayoutMode | undefined>(undefined);
  const measured = { width: width ?? 0, laneCount: geometry.lanes.length, trackCount: geometry.trackCount };
  let mode: LayoutMode;
  if (layout === "stack") mode = "stack";
  else if (width === undefined) mode = layout === "lanes" && defaultLayout === "stack" ? "lanes" : defaultLayout;
  // Asked to keep the lanes, the choice is only between showing them whole and scrolling them.
  else if (layout === "lanes") mode = chooseLayout({ ...measured, previous: previous.current === "stack" ? undefined : previous.current }, { ...sizes, stackBelow: 0 });
  else mode = chooseLayout({ ...measured, previous: previous.current }, sizes);
  useEffect(() => {
    if (width !== undefined) previous.current = mode;
  }, [mode, width]);

  const [focused, setFocused] = useState<string | undefined>(undefined);
  const firstStop = useMemo(() => {
    for (const section of process.sections) {
      for (const step of section.steps) if (showsInclusion(process, step.inclusion)) return `step:${step.step.id}`;
    }
    return undefined;
  }, [process]);
  const tabStop = focused ?? (selected === null ? firstStop : `${selected.kind}:${selected.id}`);
  const onFocus = (event: FocusEvent<HTMLElement>): void => {
    const key = (event.target as HTMLElement).closest<HTMLElement>("[data-process-stop]")?.dataset.processStop;
    if (key !== undefined) setFocused(key);
  };

  const pick = (target: ProcessTarget): void => onSelect?.(target);
  const follow = (stepId: Id): void => focusStep(root.current, stepId, !reducedMotion());

  // Once, when the layout is first known: bring the step in progress into view.
  const scrolled = useRef(false);
  useEffect(() => {
    if (scrolled.current || !scrollToActive || width === undefined || run === undefined) return;
    scrolled.current = true;
    const active = Object.keys(run.steps).find((id) => run.steps[id].status === "active");
    if (active === undefined) return;
    root.current?.querySelector<HTMLElement>(`[data-process-step="${CSS.escape(active)}"] [data-process-stop]`)?.scrollIntoView({ block: "center", inline: "nearest" });
  }, [run, scrollToActive, width]);

  const groups = [...new Set(process.lanes.map((lane) => lane.group).filter((group): group is string => group !== undefined))];
  const toggle = (ids: Id[]): void => {
    const all = ids.every((id) => shown.has(id));
    const next = process.lanes.map((lane) => lane.id).filter((id) => (ids.includes(id) ? !all : shown.has(id)));
    setLanes(next);
  };
  const style = {
    "--process-title-width": `${sizes.titleWidth}px`,
    "--process-track-width": `${sizes.trackWidth}px`,
    "--process-lane-min-width": `${sizes.laneMinWidth}px`,
  } as CSSProperties;
  const empty = !process.sections.some((section) => section.steps.length > 0);

  return (
    <div ref={root} role="group" aria-label={definition.name} data-process-root data-layout={mode} data-lanes={geometry.lanes.length} data-tracks={geometry.trackCount} className={cn("text-foreground", className)} style={style} onKeyDown={moveFocus} onFocus={onFocus}>
      {laneFilter && process.lanes.length > 1 && (
        <div role="group" aria-label={t("lanes")} data-process-slot="lane-filter">
          <Button type="button" size="xs" variant={shown.size === process.lanes.length ? "secondary" : "outline"} data-process-slot="lane-toggle" aria-pressed={shown.size === process.lanes.length} onClick={() => setLanes(process.lanes.map((lane) => lane.id))}>
            {t("allLanes")}
          </Button>
          {groups.map((group) => {
            const ids = process.lanes.filter((lane) => lane.group === group).map((lane) => lane.id);
            const pressed = ids.every((id) => shown.has(id));
            return (
              <Button key={`group-${group}`} type="button" size="xs" variant={pressed ? "secondary" : "outline"} data-process-slot="lane-toggle" data-group aria-pressed={pressed} onClick={() => toggle(ids)}>
                {group}
              </Button>
            );
          })}
          {process.lanes.map((lane) => (
            <Button key={lane.id} type="button" size="xs" variant={shown.has(lane.id) ? "secondary" : "outline"} data-process-slot="lane-toggle" data-process-lane-toggle={lane.id} aria-pressed={shown.has(lane.id)} onClick={() => toggle([lane.id])}>
              {lane.label}
            </Button>
          ))}
        </div>
      )}
      {empty ? (
        <p data-process-slot="empty">{t("empty")}</p>
      ) : mode === "stack" ? (
        <>
          {process.sections.length > 1 && (
            <nav aria-label={t("sections")} data-process-slot="section-nav">
              {process.sections.map(({ section }) => (
                <Button key={section.id} type="button" size="xs" variant="outline" data-process-slot="section-link" onClick={() => root.current?.querySelector(`[data-process-section="${CSS.escape(section.id)}"]`)?.scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" })}>
                  {section.label}
                </Button>
              ))}
            </nav>
          )}
          <StackList view={view} blocks={blocks} lanes={shown} highlight={highlight} uid={uid} selected={selected} marks={marks} tabStop={tabStop} onPick={pick} onFollow={follow} renderDetail={renderDetail} t={t} />
        </>
      ) : (
        <>
          <div data-process-slot="scroll">
            <LaneGrid view={view} geometry={geometry} uid={uid} highlight={highlight} scroll={mode === "lanes-scroll"} selected={selected} marks={marks} tabStop={tabStop} onPick={pick} onFollow={follow} t={t} />
          </div>
          {selected !== null && renderDetail !== undefined && (
            <aside aria-label={t("detail")} data-process-slot="detail">
              {renderDetail(selected)}
            </aside>
          )}
        </>
      )}
    </div>
  );
}
