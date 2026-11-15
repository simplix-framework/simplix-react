/** The definitions an editing session went through: the ones before the present for undo, the ones after it for redo. */
export interface EditHistory<T> {
  readonly past: readonly HistoryEntry<T>[];
  readonly present: T;
  readonly future: readonly HistoryEntry<T>[];
  /** How many states undo can reach before the oldest is dropped. */
  readonly limit: number;
}

/** A state with the name of the change that led away from it. */
export interface HistoryEntry<T> {
  readonly state: T;
  readonly label: string;
}

/** Starts a history at `initial`. */
export function createHistory<T>(initial: T, limit = 100): EditHistory<T> {
  return { past: [], present: initial, future: [], limit };
}

/** Records `next` as the present. The same value is not recorded, and what was undone can no longer be redone. */
export function commitEdit<T>(history: EditHistory<T>, next: T, label = ""): EditHistory<T> {
  if (next === history.present) return history;
  const past = [...history.past, { state: history.present, label }];
  return { ...history, past: past.slice(Math.max(0, past.length - history.limit)), present: next, future: [] };
}

/** Goes back one change, or returns the history as it is when there is none. */
export function undoEdit<T>(history: EditHistory<T>): EditHistory<T> {
  const entry = history.past[history.past.length - 1];
  if (entry === undefined) return history;
  return { ...history, past: history.past.slice(0, -1), present: entry.state, future: [{ state: history.present, label: entry.label }, ...history.future] };
}

/** Applies again the change last undone, or returns the history as it is when there is none. */
export function redoEdit<T>(history: EditHistory<T>): EditHistory<T> {
  const entry = history.future[0];
  if (entry === undefined) return history;
  return { ...history, past: [...history.past, { state: history.present, label: entry.label }], present: entry.state, future: history.future.slice(1) };
}
