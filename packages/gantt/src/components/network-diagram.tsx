import { Button } from "@simplix-react/ui";
import { Maximize, ZoomIn, ZoomOut } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { useGantt, useGanttStore } from "../context/gantt-context";
import { cn } from "../lib/cn";
import { formatDate } from "../lib/format";
import { BOX_HEIGHT, BOX_WIDTH, layoutNetwork } from "../lib/network-layout";
import { useGanttTranslation } from "../lib/use-gantt-translation";

/** The sizes the diagram can be drawn at, as shares of its natural size. */
const SCALES = [0.25, 0.35, 0.5, 0.7, 0.85, 1, 1.25, 1.5] as const;
const NATURAL = SCALES.indexOf(1);

/**
 * The network diagram: every task without tasks under it as a box, placed in
 * a column one past its latest predecessor, with a line for every dependency.
 * Critical tasks and the links between them are drawn in the destructive
 * colour. Choosing a box opens the task's information dialog. The diagram
 * zooms in steps and fits itself to the screen on request.
 */
export function NetworkDiagram() {
  const { t, language } = useGanttTranslation();
  const store = useGanttStore();
  const project = useGantt((state) => state.history.present);
  const schedule = useGantt((state) => state.schedule);
  const selection = useGantt((state) => state.selection);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState<number>(NATURAL);
  const scale = SCALES[step];

  const { nodes, edges, width, height } = useMemo(() => layoutNetwork(project, schedule), [project, schedule]);

  /** The largest step at which the whole diagram is on screen. */
  const fit = (): void => {
    const box = boxRef.current;
    if (!box) return;
    const room = Math.min(box.clientWidth / width, box.clientHeight / height);
    let next = 0;
    for (let i = 0; i < SCALES.length; i++) if (SCALES[i] <= room) next = i;
    setStep(Math.min(next, NATURAL));
    box.scrollTo({ left: 0, top: 0 });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      {/* A line of its own, so the controls never lie over a box of the diagram. */}
      <div className="flex shrink-0 items-center justify-end gap-0.5 border-b px-2 py-1" data-gantt-slot="network-zoom">
        <Button variant="ghost" size="icon-sm" aria-label={t("toolbar.zoomOut")} title={t("toolbar.zoomOut")} disabled={step === 0} onClick={() => setStep(step - 1)}>
          <ZoomOut />
        </Button>
        <span className="w-10 text-center text-xs tabular-nums text-muted-foreground" data-gantt-slot="network-scale">{`${Math.round(scale * 100)}%`}</span>
        <Button variant="ghost" size="icon-sm" aria-label={t("toolbar.zoomIn")} title={t("toolbar.zoomIn")} disabled={step === SCALES.length - 1} onClick={() => setStep(step + 1)}>
          <ZoomIn />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={t("network.fit")} title={t("network.fit")} onClick={fit}>
          <Maximize />
        </Button>
      </div>
      <div ref={boxRef} className="min-h-0 flex-1 overflow-auto" data-gantt-slot="network-diagram">
        {/* raw layout: a box of the diagram's size on screen, holding the canvas drawn at its natural size and scaled */}
        <div className="relative overflow-hidden" style={{ width: width * scale, height: height * scale }}>
          <div className="absolute left-0 top-0 origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
            <svg className="pointer-events-none absolute left-0 top-0" width={width} height={height} aria-hidden="true">
              {edges.map((edge) => (
                <path key={edge.id} d={edge.d} fill="none" strokeWidth={1.25} className={edge.critical ? "stroke-destructive" : "stroke-muted-foreground"} data-gantt-edge={edge.id} />
              ))}
            </svg>
            {nodes.map(({ task, at, x, y }) => (
              <button
                key={task.id}
                type="button"
                className={cn(
                  "absolute flex flex-col justify-center rounded-md border bg-background px-2 text-left text-xs shadow-sm",
                  at?.critical ? "border-destructive" : "border-border",
                  selection.includes(task.id) && "ring-2 ring-ring",
                )}
                style={{ left: x, top: y, width: BOX_WIDTH, height: BOX_HEIGHT }}
                data-gantt-node={task.id}
                onClick={() => store.getState().selectRow(task.id)}
                onDoubleClick={() => store.getState().openTaskDialog(task.id)}
              >
                <span className="truncate text-sm font-medium">{task.name}</span>
                {at && (
                  <span className="truncate text-muted-foreground">
                    {formatDate(at.start, language)} - {formatDate(at.finish, language)} · {at.percentComplete}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
