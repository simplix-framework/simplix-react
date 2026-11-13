import { useFlatUIComponents } from "@simplix-react/ui";
import { useId } from "react";
import type { ReactNode } from "react";

/** The name of a weekday, Sunday first, in the reader's language. 1970-01-04 was a Sunday. */
export function weekdayName(weekday: number, language: string, width: "long" | "short" = "long"): string {
  return new Intl.DateTimeFormat(language, { weekday: width, timeZone: "UTC" }).format(new Date((3 + weekday) * 86_400_000));
}

/** Props for {@link Field}. */
export interface FieldProps {
  label: string;
  /** Spans both columns of a two-column dialog grid. */
  wide?: boolean;
  /** Renders the control; the id ties it to the label. */
  children: (id: string) => ReactNode;
}

/** A labelled control of a dialog: the label above, the control under it. */
export function Field({ label, wide = false, children }: FieldProps) {
  const ui = useFlatUIComponents();
  const id = useId();
  return (
    <div className={wide ? "col-span-2 flex flex-col gap-1.5" : "flex flex-col gap-1.5"}>
      <ui.Label htmlFor={id}>{label}</ui.Label>
      {children(id)}
    </div>
  );
}

/** Props for {@link Toggle}. */
export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Sits on the baseline of the fields beside it in a dialog grid. */
  aligned?: boolean;
}

/** A checkbox with its label beside it. */
export function Toggle({ label, checked, onChange, aligned = true }: ToggleProps) {
  const ui = useFlatUIComponents();
  const id = useId();
  return (
    <div className={aligned ? "flex items-center gap-2 self-end pb-2" : "flex items-center gap-1.5"}>
      <ui.Checkbox id={id} checked={checked} onCheckedChange={(value) => onChange(value === true)} />
      <ui.Label htmlFor={id}>{label}</ui.Label>
    </div>
  );
}
