/**
 * An undo and redo stack over immutable values. Every state is kept whole, so
 * values that share unchanged parts cost little.
 */
export interface History<T> {
  readonly past: readonly HistoryEntry<T>[];
  readonly present: T;
  readonly future: readonly HistoryEntry<T>[];
  /** States kept for undo before the oldest is dropped. */
  readonly limit: number;
}

/** A state and the label of the change that replaced it. */
export interface HistoryEntry<T> {
  readonly state: T;
  readonly label: string;
}

/** Starts a history at `initial`, keeping up to `limit` states for undo. */
export function createHistory<T>(initial: T, limit = 200): History<T> {
  return { past: [], present: initial, future: [], limit };
}

/**
 * Records a change. The label names it for an undo menu. A change to the
 * identical value is not recorded, and anything undone is discarded.
 */
export function commit<T>(history: History<T>, next: T, label = ""): History<T> {
  if (next === history.present) return history;
  const past = [...history.past, { state: history.present, label }];
  return { ...history, past: past.slice(Math.max(0, past.length - history.limit)), present: next, future: [] };
}

/** Steps back one change. Returns the history unchanged when there is none. */
export function undo<T>(history: History<T>): History<T> {
  const entry = history.past[history.past.length - 1];
  if (!entry) return history;
  return {
    ...history,
    past: history.past.slice(0, -1),
    present: entry.state,
    future: [{ state: history.present, label: entry.label }, ...history.future],
  };
}

/** Steps forward one undone change. Returns the history unchanged when there is none. */
export function redo<T>(history: History<T>): History<T> {
  const entry = history.future[0];
  if (!entry) return history;
  return {
    ...history,
    past: [...history.past, { state: history.present, label: entry.label }],
    present: entry.state,
    future: history.future.slice(1),
  };
}

/** Label of the change undo would revert, or `null`. */
export function undoLabel<T>(history: History<T>): string | null {
  return history.past[history.past.length - 1]?.label ?? null;
}

/** Label of the change redo would reapply, or `null`. */
export function redoLabel<T>(history: History<T>): string | null {
  return history.future[0]?.label ?? null;
}
