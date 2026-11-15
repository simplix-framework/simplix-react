import { freshId } from "@simplix-react/process-core";
import type { Act, Condition, Id, Jump, Patch, Step } from "@simplix-react/process-core";
import { useEffect, useId, useState } from "react";
import type { ReactNode } from "react";

import { Button, Checkbox, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@simplix-react/ui";

import type { ProcessEditing } from "../../lib/use-process-editing";
import { useProcessEditTranslation } from "../../lib/use-process-edit-translation";

type Words = ReturnType<typeof useProcessEditTranslation>;

/** One labelled field of a panel. */
function Field({ label, children, htmlFor }: { label: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div data-process-slot="editor-field">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

/** A line of text that becomes one edit when the reader leaves it or presses Enter, never one a keystroke. */
function TextField({ label, value, onCommit, name, placeholder }: { label: string; value: string; onCommit: (next: string) => void; name: string; placeholder?: string }) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const commit = (): void => {
    if (draft !== value) onCommit(draft);
  };
  return (
    <Field label={label} htmlFor={id}>
      <Input
        id={id}
        value={draft}
        placeholder={placeholder}
        data-process-field={name}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit();
        }}
      />
    </Field>
  );
}

function Choice({ label, value, options, onCommit, name }: { label: string; value: string; options: readonly { value: string; label: string }[]; onCommit: (next: string) => void; name: string }) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id}>
      <Select value={value} onValueChange={onCommit}>
        <SelectTrigger id={id} data-process-field={name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function Tick({ label, checked, onCommit, name, disabled }: { label: string; checked: boolean; onCommit: (next: boolean) => void; name: string; disabled?: boolean }) {
  const id = useId();
  return (
    <div data-process-slot="editor-tick">
      <Checkbox id={id} checked={checked} disabled={disabled} data-process-field={name} onCheckedChange={(next) => onCommit(next === true)} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

/** A row of a list in a panel: its name, and the buttons that move, show or remove it. */
function Row({ children, onUp, onDown, onRemove, onShow, t, subject, fixed = false }: { children: ReactNode; onUp?: () => void; onDown?: () => void; onRemove?: () => void; onShow?: () => void; t: Words; subject: Id; fixed?: boolean }) {
  return (
    <li data-process-slot="editor-row" data-process-row={subject}>
      <div data-process-slot="editor-row-main">{children}</div>
      <div data-process-slot="editor-row-actions">
        {onShow !== undefined && (
          <Button type="button" size="xs" variant="outline" data-process-do="show" onClick={onShow}>
            {t("edit")}
          </Button>
        )}
        {!fixed && (
          <>
            <Button type="button" size="xs" variant="outline" data-process-do="up" disabled={onUp === undefined} onClick={onUp}>
              {t("moveUp")}
            </Button>
            <Button type="button" size="xs" variant="outline" data-process-do="down" disabled={onDown === undefined} onClick={onDown}>
              {t("moveDown")}
            </Button>
          </>
        )}
        {onRemove !== undefined && (
          <Button type="button" size="xs" variant="outline" data-process-do="remove" onClick={onRemove}>
            {t("remove")}
          </Button>
        )}
      </div>
    </li>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return <h3 data-process-slot="editor-heading">{children}</h3>;
}

/** The fact a condition names when it is one fact or its negation; `null` for a condition over several. */
function simple(condition: Condition | undefined): { fact: string; not: boolean } | null {
  if (condition === undefined) return { fact: "", not: false };
  if ("fact" in condition) return { fact: condition.fact, not: false };
  if ("not" in condition && "fact" in condition.not) return { fact: condition.not.fact, not: true };
  return null;
}

/** The condition of a step or an act: one fact, whether it applies when the fact does not hold, and the wording shown for it. */
function ConditionFields({ condition, conditionLabel, onCommit, t, wordingOnly = false }: { wordingOnly?: boolean; condition: Condition | undefined; conditionLabel: string | undefined; onCommit: (patch: { condition?: Condition | undefined; conditionLabel?: string | undefined }) => void; t: Words }) {
  // Where the flow is kept, the condition stands as it is and only its wording is the reader's to change.
  if (wordingOnly) return condition === undefined ? null : <TextField label={t("conditionLabel")} name="condition-label" value={conditionLabel ?? ""} onCommit={(next) => onCommit({ conditionLabel: next === "" ? undefined : next })} />;
  const one = simple(condition);
  if (one === null) return <p data-process-slot="editor-hint">{t("conditionCompound")}</p>;
  const made = (fact: string, not: boolean): Condition | undefined => (fact === "" ? undefined : not ? { not: { fact } } : { fact });
  return (
    <>
      <TextField label={t("conditionFact")} name="condition-fact" value={one.fact} onCommit={(fact) => onCommit({ condition: made(fact.trim(), one.not), ...(fact.trim() === "" ? { conditionLabel: undefined } : {}) })} />
      {one.fact !== "" && (
        <>
          <Tick label={t("conditionNot")} name="condition-not" checked={one.not} onCommit={(not) => onCommit({ condition: made(one.fact, not) })} />
          <TextField label={t("conditionLabel")} name="condition-label" value={conditionLabel ?? ""} onCommit={(next) => onCommit({ conditionLabel: next === "" ? undefined : next })} />
        </>
      )}
    </>
  );
}

interface PanelProps {
  editing: ProcessEditing;
  /** `wording` leaves out every control that makes, removes, moves or connects a step. */
  scope: "all" | "wording";
}

/** The procedure as a whole: its name, its lanes, and its sections with the steps under each. */
export function ProcedurePanel({ editing, scope, onAddStep, onShow }: PanelProps & { onAddStep: (section: Id, at?: number) => void; onShow: (subject: Id) => void }) {
  const t = useProcessEditTranslation();
  const { definition, apply } = editing;
  const all = scope === "all";
  return (
    <>
      <Heading>{t("procedure")}</Heading>
      <TextField label={t("name")} name="name" value={definition.name} onCommit={(name) => apply({ type: "rename", name })} />
      <Heading>{t("lanes")}</Heading>
      <ul data-process-slot="editor-list" data-process-list="lanes">
        {definition.lanes.map((lane, index) => (
          <Row key={lane.id} subject={lane.id} t={t} onUp={index > 0 ? () => apply({ type: "move-lane", id: lane.id, to: index - 1 }) : undefined} onDown={index < definition.lanes.length - 1 ? () => apply({ type: "move-lane", id: lane.id, to: index + 1 }) : undefined} onRemove={all ? () => apply({ type: "remove-lane", id: lane.id }) : undefined}>
            <TextField label={t("label")} name="lane-label" value={lane.label} onCommit={(label) => apply({ type: "update-lane", id: lane.id, patch: { label } })} />
            <TextField label={t("group")} name="lane-group" value={lane.group ?? ""} onCommit={(group) => apply({ type: "update-lane", id: lane.id, patch: { group: group === "" ? undefined : group } })} />
          </Row>
        ))}
      </ul>
      {all && (
        <Button type="button" size="sm" variant="outline" data-process-do="add-lane" onClick={() => apply({ type: "add-lane", lane: { id: freshId(definition, "lane-"), label: t("newLane") } })}>
          {t("addLane")}
        </Button>
      )}
      <Heading>{t("sections")}</Heading>
      <ul data-process-slot="editor-list" data-process-list="sections">
        {definition.sections.map((section, index) => (
          <Row key={section.id} subject={section.id} t={t} fixed={!all} onUp={index > 0 ? () => apply({ type: "move-section", id: section.id, to: index - 1 }) : undefined} onDown={index < definition.sections.length - 1 ? () => apply({ type: "move-section", id: section.id, to: index + 1 }) : undefined} onRemove={all ? () => apply({ type: "remove-section", id: section.id }) : undefined}>
            <TextField label={t("label")} name="section-label" value={section.label} onCommit={(label) => apply({ type: "update-section", id: section.id, patch: { label } })} />
            <ul data-process-slot="editor-sublist">
              {section.steps.map((step) => (
                <li key={step.id}>
                  <Button type="button" size="xs" variant="ghost" data-process-open={step.id} onClick={() => onShow(step.id)}>
                    {step.label}
                  </Button>
                </li>
              ))}
            </ul>
            {all && (
              <Button type="button" size="xs" variant="outline" data-process-do="add-step" disabled={definition.lanes.length === 0} onClick={() => onAddStep(section.id)}>
                {t("addStep")}
              </Button>
            )}
          </Row>
        ))}
      </ul>
      {all && (
        <>
        {definition.lanes.length === 0 && <p data-process-slot="editor-hint">{t("noLane")}</p>}
        <Button type="button" size="sm" variant="outline" data-process-do="add-section" onClick={() => apply({ type: "add-section", section: { id: freshId(definition, "section-"), label: t("newSection") } })}>
          {t("addSection")}
        </Button>
        </>
      )}
    </>
  );
}

/** One step: its name and wording, where it stands, what it proceeds with, its acts and the jumps that leave it. */
export function StepPanel({ editing, scope, section, index, step, onAddStep, onShow }: PanelProps & { section: number; index: number; step: Step; onAddStep: (section: Id, at?: number) => void; onShow: (subject: Id) => void }) {
  const t = useProcessEditTranslation();
  const { definition, apply } = editing;
  const here = definition.sections[section];
  const wording = scope === "wording";
  const all = definition.sections.flatMap((one) => one.steps);
  const position = all.findIndex((one) => one.id === step.id);
  const previous = here.steps[index - 1];
  const withPrevious = previous !== undefined && step.parallel !== undefined && previous.parallel === step.parallel;

  const up = index > 0 ? () => apply({ type: "move-step", id: step.id, section: here.id, to: index - 1 }) : section > 0 ? () => apply({ type: "move-step", id: step.id, section: definition.sections[section - 1].id, to: definition.sections[section - 1].steps.length }) : undefined;
  const down = index < here.steps.length - 1 ? () => apply({ type: "move-step", id: step.id, section: here.id, to: index + 1 }) : section < definition.sections.length - 1 ? () => apply({ type: "move-step", id: step.id, section: definition.sections[section + 1].id, to: 0 }) : undefined;

  const setWithPrevious = (on: boolean): void => {
    if (previous === undefined) return;
    if (on) {
      apply({ type: "set-parallel", steps: [previous.id, step.id], key: previous.parallel ?? step.parallel ?? freshId(definition, "together-") });
      return;
    }
    // The step and the steps of the run after it go on as a run of their own, where there are two or more.
    const rest = [step.id];
    for (let at = index + 1; at < here.steps.length && here.steps[at].parallel === step.parallel; at += 1) rest.push(here.steps[at].id);
    apply(rest.length >= 2 ? { type: "set-parallel", steps: rest, key: freshId(definition, "together-") } : { type: "set-parallel", steps: rest });
  };

  const later = all.slice(position + 1);
  const jumps = definition.jumps.filter((jump) => jump.from === step.id);
  const addJump = (): void => {
    const to = all.find((one) => one.id !== step.id);
    const id = freshId(definition, "jump-");
    const result = apply({ type: "add-jump", jump: to === undefined ? { id, from: step.id, external: t("newJump"), label: t("newJump") } : { id, from: step.id, to: to.id, label: t("newJump") } });
    if (result.ok) onShow(id);
  };
  const addAct = (): void => {
    const lane = step.acts[step.acts.length - 1]?.lanes[0] ?? definition.lanes[0]?.id;
    if (lane === undefined) return;
    const id = freshId(definition, "act-");
    const result = apply({ type: "add-act", step: step.id, act: { id, lanes: [lane], kind: "do", label: t("newAct") } });
    if (result.ok) onShow(id);
  };

  return (
    <>
      <Heading>{t("steps")}</Heading>
      <TextField label={t("label")} name="step-label" value={step.label} onCommit={(label) => apply({ type: "update-step", id: step.id, patch: { label } })} />
      <TextField label={t("note")} name="step-note" value={step.note ?? ""} onCommit={(note) => apply({ type: "update-step", id: step.id, patch: { note: note === "" ? undefined : note } })} />
      {!wording && (
        <>
        <div data-process-slot="editor-actions">
          <Button type="button" size="sm" variant="outline" data-process-do="step-up" disabled={up === undefined} onClick={up}>
            {t("moveUp")}
          </Button>
          <Button type="button" size="sm" variant="outline" data-process-do="step-down" disabled={down === undefined} onClick={down}>
            {t("moveDown")}
          </Button>
          <Button type="button" size="sm" variant="outline" data-process-do="step-after" onClick={() => onAddStep(here.id, index + 1)}>
            {t("addStepAfter")}
          </Button>
          <Button type="button" size="sm" variant="outline" data-process-do="step-remove" onClick={() => apply({ type: "remove-step", id: step.id })}>
            {t("remove")}
          </Button>
        </div>
        <Tick label={t("parallelWithPrevious")} name="step-parallel" checked={withPrevious} disabled={previous === undefined} onCommit={setWithPrevious} />
        <Choice
          label={t("repeat")}
          name="step-repeat"
          value={step.repeat?.endedBy ?? ""}
          options={[{ value: "", label: t("repeatNone") }, ...later.map((one) => ({ value: one.id, label: one.label }))].map((option) => ({ ...option, value: option.value === "" ? "-" : option.value }))}
          onCommit={(next) => apply({ type: "update-step", id: step.id, patch: { repeat: next === "-" ? undefined : { endedBy: next } } })}
        />
        </>
      )}
      {(!wording || step.rework !== undefined) && <TextField label={t("rework")} name="step-rework" value={step.rework?.label ?? ""} onCommit={(label) => apply({ type: "update-step", id: step.id, patch: { rework: label === "" ? undefined : { ...step.rework, label } } })} />}
      {(!wording || step.condition !== undefined) && <Heading>{t("condition")}</Heading>}
      <ConditionFields t={t} wordingOnly={wording} condition={step.condition} conditionLabel={step.conditionLabel} onCommit={(patch) => apply({ type: "update-step", id: step.id, patch })} />
      <Heading>{t("acts")}</Heading>
      <ul data-process-slot="editor-list" data-process-list="acts">
        {step.acts.map((act, at) => (
          <Row key={act.id} subject={act.id} t={t} fixed={wording} onShow={() => onShow(act.id)} onUp={at > 0 ? () => apply({ type: "move-act", id: act.id, to: at - 1 }) : undefined} onDown={at < step.acts.length - 1 ? () => apply({ type: "move-act", id: act.id, to: at + 1 }) : undefined} onRemove={!wording && step.acts.length > 1 ? () => apply({ type: "remove-act", id: act.id }) : undefined}>
            <span data-process-slot="editor-name">{act.label}</span>
          </Row>
        ))}
      </ul>
      {!wording && (
        <Button type="button" size="sm" variant="outline" data-process-do="add-act" onClick={addAct}>
          {t("addAct")}
        </Button>
      )}
      {(!wording || jumps.length > 0) && <Heading>{t("jumps")}</Heading>}
      <ul data-process-slot="editor-list" data-process-list="jumps">
        {jumps.map((jump) => (
          <li key={jump.id} data-process-slot="editor-row" data-process-row={jump.id}>
            <Button type="button" size="xs" variant="ghost" data-process-open={jump.id} onClick={() => onShow(jump.id)}>
              {jump.label}
            </Button>
          </li>
        ))}
      </ul>
      {!wording && (
        <Button type="button" size="sm" variant="outline" data-process-do="add-jump" onClick={addJump}>
          {t("addJump")}
        </Button>
      )}
    </>
  );
}

/** One act: its name, whether it performs or confirms, the lanes that perform it, and its condition. */
export function ActPanel({ editing, scope, lanesFor, step, actId, onShow }: PanelProps & { step: Step; actId: Id; onShow: (subject: Id) => void; lanesFor?: (act: Act) => readonly Id[] }) {
  const t = useProcessEditTranslation();
  const { definition, apply } = editing;
  const act = step.acts.find((one) => one.id === actId) as Act;
  const wording = scope === "wording";
  // The lanes the act may be given to; a lane it stands in now is listed whatever the caller allows.
  const allowed = lanesFor?.(act);
  const offered = definition.lanes.filter((lane) => allowed === undefined || allowed.includes(lane.id) || act.lanes.includes(lane.id));
  // Where the flow is kept an act stays with as many lanes as it has: picking another lane moves it there.
  const give = (lane: Id): void => patch({ lanes: act.lanes.length === 1 ? [lane] : act.lanes });
  const patch = (next: Patch<Omit<Act, "id">>): void => {
    apply({ type: "update-act", id: act.id, patch: next });
  };
  const toggle = (lane: Id, on: boolean): void => patch({ lanes: on ? [...act.lanes, lane] : act.lanes.filter((one) => one !== lane) });
  return (
    <>
      <Heading>{t("acts")}</Heading>
      <Button type="button" size="xs" variant="ghost" data-process-open={step.id} onClick={() => onShow(step.id)}>
        {step.label}
      </Button>
      <TextField label={t("label")} name="act-label" value={act.label} onCommit={(label) => patch({ label })} />
      {!wording && <Choice label={t("kind")} name="act-kind" value={act.kind} options={[{ value: "do", label: t("kindDo") }, { value: "check", label: t("kindCheck") }]} onCommit={(kind) => patch({ kind: kind === "check" ? "check" : "do" })} />}
      <Heading>{t("performedBy")}</Heading>
      <div data-process-slot="editor-ticks" data-process-list="act-lanes">
        {offered.map((lane) => (
          <Tick key={lane.id} label={lane.label} name={`act-lane-${lane.id}`} checked={act.lanes.includes(lane.id)} disabled={wording && act.lanes.length > 1} onCommit={(on) => (wording ? on && give(lane.id) : toggle(lane.id, on))} />
        ))}
      </div>
      <TextField label={t("tags")} name="act-tags" placeholder={t("tagsHint")} value={(act.tags ?? []).join(", ")} onCommit={(text) => {
        const tags = text.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "");
        patch({ tags: tags.length === 0 ? undefined : tags });
      }} />
      {(!wording || act.condition !== undefined) && <Heading>{t("condition")}</Heading>}
      <ConditionFields t={t} wordingOnly={wording} condition={act.condition} conditionLabel={act.conditionLabel} onCommit={(next) => patch(next)} />
      {!wording && (
        <div data-process-slot="editor-actions">
          <Button type="button" size="sm" variant="outline" data-process-do="act-remove" disabled={step.acts.length < 2} onClick={() => apply({ type: "remove-act", id: act.id })}>
            {t("remove")}
          </Button>
        </div>
      )}
    </>
  );
}

/** One jump: its name, the step it leaves, and the step or the other procedure it goes to. */
export function JumpPanel({ editing, scope, jump }: PanelProps & { jump: Jump }) {
  const t = useProcessEditTranslation();
  const { definition, apply } = editing;
  const steps = definition.sections.flatMap((section) => section.steps).map((step) => ({ value: step.id, label: step.label }));
  const out = jump.external !== undefined;
  const firstOther = steps.find((step) => step.value !== jump.from)?.value;
  return (
    <>
      <Heading>{t("jumps")}</Heading>
      <TextField label={t("label")} name="jump-label" value={jump.label} onCommit={(label) => apply({ type: "update-jump", id: jump.id, patch: { label } })} />
      {scope === "all" && (
        <>
        <Choice label={t("jumpFrom")} name="jump-from" value={jump.from} options={steps} onCommit={(from) => apply({ type: "update-jump", id: jump.id, patch: { from } })} />
        <Tick label={t("jumpOut")} name="jump-out" checked={out} onCommit={(on) => apply({ type: "update-jump", id: jump.id, patch: on ? { to: undefined, external: t("newJump") } : { external: undefined, to: firstOther } })} />
        {out ? (
          <TextField label={t("jumpExternal")} name="jump-external" value={jump.external ?? ""} onCommit={(external) => apply({ type: "update-jump", id: jump.id, patch: { external } })} />
        ) : (
          <Choice label={t("jumpTo")} name="jump-to" value={jump.to ?? ""} options={steps.filter((step) => step.value !== jump.from)} onCommit={(to) => apply({ type: "update-jump", id: jump.id, patch: { to } })} />
        )}
        <div data-process-slot="editor-actions">
          <Button type="button" size="sm" variant="outline" data-process-do="jump-remove" onClick={() => apply({ type: "remove-jump", id: jump.id })}>
            {t("remove")}
          </Button>
        </div>
        </>
      )}
    </>
  );
}
