import { validateDefinition } from "@simplix-react/process-core";
import type { Id, ProcessDefinition } from "@simplix-react/process-core";
import { useMemo } from "react";

import { Button } from "@simplix-react/ui";

import { useProcessEditTranslation } from "../../lib/use-process-edit-translation";

/** A problem the caller found by rules of its own, shown beside the ones the definition format has. */
export interface EditorProblem {
  /** The lane, section, step, act or jump it is about; picking the problem shows that part. */
  subject: Id;
  message: string;
}

/** Props of {@link ProcessProblems}. */
export interface ProcessProblemsProps {
  definition: ProcessDefinition;
  /** Problems found by the caller's own rules, listed after the format's. */
  problems?: readonly EditorProblem[];
  /** Called with the part a problem is about when the reader picks it; left out, the problems are only read. */
  onShow?: (subject: Id) => void;
}

/** Every problem of a definition in the reader's words: the ones the format has, then the caller's. */
export function useProcessProblems(definition: ProcessDefinition, problems: readonly EditorProblem[] = []): EditorProblem[] {
  const t = useProcessEditTranslation();
  const own = useMemo(() => validateDefinition(definition), [definition]);
  return useMemo(() => [...own.map((problem) => ({ subject: problem.subject, message: t(`refusal.${problem.code}`) })), ...problems], [own, problems, t]);
}

/**
 * What stands in the way of a definition being used, as a list: the problems of the format and
 * the ones the caller found. With none it says so, so a check before publishing reads as passed.
 */
export function ProcessProblems({ definition, problems, onShow }: ProcessProblemsProps) {
  const t = useProcessEditTranslation();
  const listed = useProcessProblems(definition, problems);
  return (
    <section aria-label={t("problems")} data-process-slot="editor-problems" data-problems={listed.length}>
      <h3 data-process-slot="editor-heading">{t("problems")}</h3>
      {listed.length === 0 ? (
        <p data-process-slot="editor-hint">{t("noProblems")}</p>
      ) : (
        <ul>
          {listed.map((problem, index) => (
            <li key={`${problem.subject}-${index}`}>
              {onShow === undefined ? (
                <span data-process-problem={problem.subject}>{problem.message}</span>
              ) : (
                <Button type="button" size="sm" variant="ghost" data-process-problem={problem.subject} onClick={() => onShow(problem.subject)}>
                  {problem.message}
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
