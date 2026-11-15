import { applyEdit, commitEdit, createHistory, redoEdit, undoEdit } from "@simplix-react/process-core";
import type { EditConsequence, EditHistory, EditOperation, EditRefusal, EditResult, ProcessDefinition } from "@simplix-react/process-core";
import { useCallback, useMemo, useRef, useState } from "react";

/** A definition being edited: what it is now, how to change it, and what the last change did. */
export interface ProcessEditing {
  /** The definition as it stands. */
  definition: ProcessDefinition;
  /** The definition the session started from. */
  initial: ProcessDefinition;
  /** Applies one operation. A refused operation changes nothing and is kept in `refusal`. */
  apply: (operation: EditOperation) => EditResult;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /** Why the last operation was not applied, until the next one is. */
  refusal: EditRefusal | null;
  /** What the last applied operation changed besides the part it named. */
  consequences: readonly EditConsequence[];
  /** Starts over from another definition, dropping the history. */
  reset: (definition: ProcessDefinition) => void;
}

interface State {
  history: EditHistory<ProcessDefinition>;
  initial: ProcessDefinition;
  refusal: EditRefusal | null;
  consequences: readonly EditConsequence[];
}

/**
 * Keeps a definition through an editing session: every applied operation is a step undo can
 * take back, and a refused one is kept with its reason for the editor to show.
 *
 * @example
 * ```tsx
 * const editing = useProcessEditing(stored);
 * return <ProcessEditor editing={editing} />;
 * ```
 */
export function useProcessEditing(initial: ProcessDefinition): ProcessEditing {
  const [state, setState] = useState<State>(() => ({ history: createHistory(initial), initial, refusal: null, consequences: [] }));
  // Read by `apply`, so two operations applied in one handler build on one another.
  const latest = useRef(state);
  const put = useCallback((next: State): void => {
    latest.current = next;
    setState(next);
  }, []);

  const apply = useCallback(
    (operation: EditOperation): EditResult => {
      const now = latest.current;
      const result = applyEdit(now.history.present, operation);
      if (result.ok) put({ ...now, history: commitEdit(now.history, result.definition, operation.type), refusal: null, consequences: result.consequences });
      else put({ ...now, refusal: result.refusal, consequences: [] });
      return result;
    },
    [put],
  );
  const undo = useCallback((): void => put({ ...latest.current, history: undoEdit(latest.current.history), refusal: null, consequences: [] }), [put]);
  const redo = useCallback((): void => put({ ...latest.current, history: redoEdit(latest.current.history), refusal: null, consequences: [] }), [put]);
  const reset = useCallback((definition: ProcessDefinition): void => put({ history: createHistory(definition), initial: definition, refusal: null, consequences: [] }), [put]);

  return useMemo(
    () => ({
      definition: state.history.present,
      initial: state.initial,
      apply,
      undo,
      redo,
      canUndo: state.history.past.length > 0,
      canRedo: state.history.future.length > 0,
      refusal: state.refusal,
      consequences: state.consequences,
      reset,
    }),
    [state, apply, undo, redo, reset],
  );
}
