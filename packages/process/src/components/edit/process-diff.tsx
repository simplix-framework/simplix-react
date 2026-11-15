import { diffDefinitions } from "@simplix-react/process-core";
import type { DefinitionChange, Facts, Id, ProcessDefinition } from "@simplix-react/process-core";
import { useMemo, useState } from "react";

import { Badge, Button } from "@simplix-react/ui";

import { cn } from "../../lib/cn";
import { useProcessEditTranslation } from "../../lib/use-process-edit-translation";
import type { ProcessTarget } from "../../types";
import { ProcessLanes } from "../process-lanes";

/** Props of {@link ProcessDiff}. */
export interface ProcessDiffProps {
  /** The earlier version. */
  before: ProcessDefinition;
  /** The version compared with it, which is the one drawn. */
  after: ProcessDefinition;
  facts?: Facts;
  /** The reader's word for a member of the caller's own that differs; left out, the member's name is shown. */
  fieldLabel?: (field: string) => string | undefined;
  className?: string;
}

const TONE = { added: "success", removed: "destructive", changed: "warning", moved: "secondary" } as const;

function labels(definition: ProcessDefinition): Map<string, string> {
  const names = new Map<string, string>();
  names.set(`process:${definition.id}`, definition.name);
  for (const lane of definition.lanes) names.set(`lane:${lane.id}`, lane.label);
  for (const section of definition.sections) {
    names.set(`section:${section.id}`, section.label);
    for (const step of section.steps) {
      names.set(`step:${step.id}`, step.label);
      for (const act of step.acts) names.set(`act:${act.id}`, `${step.label} · ${act.label}`);
    }
  }
  for (const jump of definition.jumps) names.set(`jump:${jump.id}`, jump.label);
  return names;
}

/**
 * What differs between two versions of a procedure: the later version drawn with its added,
 * changed and moved parts marked, and under it every difference as a line that names the part.
 * A line about a step, an act or a jump of the later version shows that part on the drawing.
 *
 * @example
 * ```tsx
 * <ProcessDiff before={published} after={draft} />
 * ```
 */
export function ProcessDiff({ before, after, facts, fieldLabel, className }: ProcessDiffProps) {
  const t = useProcessEditTranslation();
  const changes = useMemo(() => diffDefinitions(before, after), [before, after]);
  const [selected, setSelected] = useState<ProcessTarget | null>(null);
  const names = useMemo(() => ({ before: labels(before), after: labels(after) }), [before, after]);
  const marks = useMemo(() => {
    const made: Record<Id, string> = {};
    // A part both moved and changed is drawn as changed.
    for (const change of changes) if (change.kind !== "removed" && (change.subject === "step" || change.subject === "act" || change.subject === "jump")) made[change.id] = made[change.id] === "changed" ? "changed" : change.kind;
    return made;
  }, [changes]);
  const nameOf = (change: DefinitionChange): string => (change.kind === "removed" ? names.before : names.after).get(`${change.subject}:${change.id}`) ?? change.id;
  const fieldName = (field: string): string => fieldLabel?.(field) ?? t(`field.${field}`, { defaultValue: field });
  const shown = (change: DefinitionChange): boolean => change.kind !== "removed" && (change.subject === "step" || change.subject === "act" || change.subject === "jump");

  return (
    <div data-process-diff data-changes={changes.length} className={cn("text-foreground", className)}>
      <ProcessLanes definition={after} facts={facts} marks={marks} selected={selected} onSelect={setSelected} scrollToActive={false} />
      {changes.length === 0 ? (
        <p data-process-slot="diff-none">{t("diff.none")}</p>
      ) : (
        <ul data-process-slot="diff-list">
          {changes.map((change, index) => (
            <li key={`${change.subject}-${change.id}-${change.kind}-${index}`} data-process-slot="diff-row" data-kind={change.kind} data-subject={change.subject} data-process-change={change.id}>
              <Badge variant={TONE[change.kind]}>{t(`diff.${change.kind}`)}</Badge>
              <span data-process-slot="diff-subject">{t(`diff.subject.${change.subject}`)}</span>
              {shown(change) ? (
                <Button type="button" size="xs" variant="ghost" onClick={() => setSelected({ kind: change.subject as ProcessTarget["kind"], id: change.id })}>
                  {nameOf(change)}
                </Button>
              ) : (
                <span data-process-slot="diff-name">{nameOf(change)}</span>
              )}
              {change.fields !== undefined && <span data-process-slot="diff-fields">{t("diff.fields", { fields: change.fields.map(fieldName).join(", ") })}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
