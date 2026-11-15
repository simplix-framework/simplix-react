import { freshId } from "@simplix-react/process-core";
import type { Act, Facts, Id, ProcessDefinition, Step } from "@simplix-react/process-core";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { Badge, Button } from "@simplix-react/ui";

import { cn } from "../../lib/cn";
import type { ProcessEditing } from "../../lib/use-process-editing";
import { useProcessEditTranslation } from "../../lib/use-process-edit-translation";
import type { ProcessTarget } from "../../types";
import { ProcessLanes } from "../process-lanes";
import { ActPanel, JumpPanel, ProcedurePanel, StepPanel } from "./panels";
import { ProcessProblems, useProcessProblems } from "./process-problems";
import type { EditorProblem } from "./process-problems";

/** What the editor's panel is showing: the procedure as a whole, or one of its steps, acts or jumps. */
export type EditorTarget = { kind: "process" } | { kind: "step" | "act" | "jump"; id: Id };

/** Props of {@link ProcessEditor}. */
export interface ProcessEditorProps {
  /** The session, from {@link useProcessEditing}. */
  editing: ProcessEditing;
  /** The facts the procedure is drawn with. Left out, every conditional step is drawn as conditional. */
  facts?: Facts;
  /** Problems found by the caller's own rules. */
  problems?: readonly EditorProblem[];
  /**
   * Fields of the caller's own for the part shown, drawn under the ones this package edits. The
   * caller reads its members off `editing.definition` and writes them with `editing.apply`.
   */
  renderFields?: (target: EditorTarget, editing: ProcessEditing) => ReactNode;
  /**
   * What the panel lets the reader change. `all`: everything. `wording`: names, notes, the wording
   * of conditions, sections' and lanes' names and who is named for an act; nothing that makes,
   * removes, moves or connects a step. Pair `wording` with a session that keeps the flow.
   * @defaultValue "all"
   */
  scope?: EditorScope;
  /** The lanes an act may be given to, by id, where not every lane may take it. Left out, any lane may. */
  lanesFor?: (act: Act) => readonly Id[];
  className?: string;
}

/** What an editor lets its reader change. */
export type EditorScope = "all" | "wording";

interface Located {
  section: number;
  index: number;
  step: Step;
}

function locate(definition: ProcessDefinition, id: Id): Located | undefined {
  for (let section = 0; section < definition.sections.length; section += 1) {
    const index = definition.sections[section].steps.findIndex((step) => step.id === id);
    if (index >= 0) return { section, index, step: definition.sections[section].steps[index] };
  }
  return undefined;
}

/**
 * A procedure being edited: the procedure drawn as {@link ProcessLanes} draws it, and beside it
 * a panel that edits the part picked on the drawing. Every change is one operation of
 * `@simplix-react/process-core`, so it can be undone, and an operation that would leave the
 * definition with a problem is refused with its reason shown above the drawing.
 *
 * On a narrow box the panel stands under the drawing and the drawing takes its one-column
 * layout; every operation is a button of the panel, so none needs dragging.
 *
 * @example
 * ```tsx
 * const editing = useProcessEditing(stored);
 * return <ProcessEditor editing={editing} problems={ownRules(editing.definition)} />;
 * ```
 */
export function ProcessEditor({ editing, facts, problems = [], renderFields, scope = "all", lanesFor, className }: ProcessEditorProps) {
  const t = useProcessEditTranslation();
  const { definition } = editing;
  const [picked, setPicked] = useState<EditorTarget>({ kind: "process" });

  // A part taken out by an edit or an undo leaves the panel on the procedure.
  const target: EditorTarget = useMemo(() => {
    if (picked.kind === "process") return picked;
    const steps = definition.sections.flatMap((section) => section.steps);
    const there = picked.kind === "step" ? steps.some((step) => step.id === picked.id) : picked.kind === "act" ? steps.some((step) => step.acts.some((act) => act.id === picked.id)) : definition.jumps.some((jump) => jump.id === picked.id);
    return there ? picked : { kind: "process" };
  }, [picked, definition]);

  const listed = useProcessProblems(definition, problems);

  const show = (subject: Id): void => {
    const steps = definition.sections.flatMap((section) => section.steps);
    if (steps.some((step) => step.id === subject)) setPicked({ kind: "step", id: subject });
    else if (steps.some((step) => step.acts.some((act) => act.id === subject))) setPicked({ kind: "act", id: subject });
    else if (definition.jumps.some((jump) => jump.id === subject)) setPicked({ kind: "jump", id: subject });
    else setPicked({ kind: "process" });
  };

  const addStep = (section: Id, at?: number): void => {
    const lane = definition.lanes[0];
    if (lane === undefined) return;
    const id = freshId(definition, "step-");
    const result = editing.apply({ type: "add-step", section, at, step: { id, label: t("newStep"), acts: [{ id: freshId(definition, "act-"), lanes: [lane.id], kind: "do", label: t("newAct") }] } });
    if (result.ok) setPicked({ kind: "step", id });
  };

  const selected: ProcessTarget | null = target.kind === "process" ? null : { kind: target.kind, id: target.id };
  const at = target.kind === "step" ? locate(definition, target.id) : undefined;
  const actOwner = target.kind === "act" ? definition.sections.flatMap((section) => section.steps).find((step) => step.acts.some((act) => act.id === target.id)) : undefined;
  const jump = target.kind === "jump" ? definition.jumps.find((one) => one.id === target.id) : undefined;

  return (
    <div data-process-editor data-scope={scope} className={cn("text-foreground", className)}>
      <div role="toolbar" aria-label={t("edit")} data-process-slot="editor-bar">
        <Button type="button" size="sm" variant="outline" disabled={!editing.canUndo} onClick={editing.undo}>
          {t("undo")}
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={!editing.canRedo} onClick={editing.redo}>
          {t("redo")}
        </Button>
        <span data-process-slot="editor-gap" />
        <Badge variant={listed.length === 0 ? "secondary" : "destructive"} data-process-slot="editor-count" data-problems={listed.length}>
          {listed.length === 0 ? t("noProblems") : t("problemCount", { count: listed.length })}
        </Badge>
      </div>
      {editing.refusal !== null && (
        <p role="alert" data-process-slot="editor-refusal" data-refusal={editing.refusal.code}>
          {t(`refusal.${editing.refusal.code}`)}
        </p>
      )}
      {editing.consequences.length > 0 && (
        <p role="status" data-process-slot="editor-consequence">
          {[...new Set(editing.consequences.map((consequence) => t(`consequence.${consequence.kind}`)))].join(" · ")}
        </p>
      )}
      <div data-process-slot="editor-body">
        <div data-process-slot="editor-canvas">
          <ProcessLanes definition={definition} facts={facts} selected={selected} onSelect={(next) => setPicked({ kind: next.kind, id: next.id })} scrollToActive={false} />
        </div>
        <aside aria-label={t("edit")} data-process-slot="editor-panel" data-target={target.kind}>
          {target.kind !== "process" && (
            <Button type="button" size="sm" variant="ghost" data-process-slot="editor-back" onClick={() => setPicked({ kind: "process" })}>
              ← {t("backToProcedure")}
            </Button>
          )}
          {target.kind === "process" && <ProcedurePanel editing={editing} scope={scope} onAddStep={addStep} onShow={show} />}
          {at !== undefined && <StepPanel editing={editing} scope={scope} section={at.section} index={at.index} step={at.step} onAddStep={addStep} onShow={show} />}
          {actOwner !== undefined && target.kind === "act" && <ActPanel editing={editing} scope={scope} lanesFor={lanesFor} step={actOwner} actId={target.id} onShow={show} />}
          {jump !== undefined && <JumpPanel editing={editing} scope={scope} jump={jump} />}
          {renderFields !== undefined && <div data-process-slot="editor-own">{renderFields(target, editing)}</div>}
        </aside>
      </div>
      {listed.length > 0 && <ProcessProblems definition={definition} problems={problems} onShow={show} />}
    </div>
  );
}
