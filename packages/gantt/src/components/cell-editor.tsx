import type { KeyboardEvent } from "react";

import { MAX_DATE, MIN_DATE } from "../lib/grid-columns";

/** Props for {@link CellEditor}. */
export interface CellEditorProps {
  type: "text" | "date" | "number";
  /** Holds a number to 0 to 100. */
  bounded?: boolean;
  initial: string;
  label: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

/** The input a cell turns into while it is edited: Enter or leaving it commits, Escape cancels. */
export function CellEditor({ type, bounded = false, initial, label, onCommit, onCancel }: CellEditorProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    // The chart's own shortcuts must not see keys typed into a cell.
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      // Marking the input settled keeps the blur that follows its removal from committing a second time.
      event.currentTarget.dataset.settled = "true";
      onCommit(event.currentTarget.value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.currentTarget.dataset.settled = "true";
      onCancel();
    }
  };
  return (
    <input
      autoFocus
      type={type}
      aria-label={label}
      defaultValue={initial}
      min={bounded ? 0 : type === "date" ? MIN_DATE : undefined}
      max={bounded ? 100 : type === "date" ? MAX_DATE : undefined}
      className="h-full w-full min-w-0 border-2 border-ring bg-background px-1.5 text-sm text-foreground outline-none"
      onFocus={(event) => {
        if (type === "text") event.currentTarget.select();
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (event.currentTarget.dataset.settled !== "true") onCommit(event.currentTarget.value);
      }}
    />
  );
}
