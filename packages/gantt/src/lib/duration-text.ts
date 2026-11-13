import { formatDuration } from "@simplix-react/gantt-core";
import type { DurationUnit, DurationValue, Project } from "@simplix-react/gantt-core";

const UNITS: readonly DurationUnit[] = ["mo", "m", "h", "d", "w"];

/** The words a language writes durations with. */
export interface DurationWords {
  /** The word for each unit, such as `일` for a day. */
  units: Readonly<Record<DurationUnit, string>>;
  /** What marks an elapsed duration. The single letter `e` goes between the number and the unit; anything else goes in front. */
  elapsed: string;
}

/** Reads the duration words of the active language through the chart's translate function. */
export function durationWords(t: (key: string) => string): DurationWords {
  // A catalogue that has not loaded hands the key back; the letters stand in until it has.
  const word = (key: string, letters: string): string => {
    const text = t(key);
    return text === key || text === "" ? letters : text;
  };
  return {
    units: { m: word("unit.m", "m"), h: word("unit.h", "h"), d: word("unit.d", "d"), w: word("unit.w", "w"), mo: word("unit.mo", "mo") },
    elapsed: word("unit.elapsed", "e"),
  };
}

/** Writes a duration in the reader's words: `3일`, `연속 2일`, or `3d` and `2ed` where the words are the letters. */
export function formatDurationText(value: DurationValue, project: Project, words: DurationWords): string {
  // The letter form already holds the amount in the right unit size; only its words change.
  const canonical = formatDuration({ ...value, estimated: false }, project);
  const amount = canonical.slice(0, canonical.length - value.unit.length - (value.elapsed ? 1 : 0));
  const mark = value.estimated ? "?" : "";
  if (!value.elapsed) return `${amount}${words.units[value.unit]}${mark}`;
  return words.elapsed === "e" ? `${amount}e${words.units[value.unit]}${mark}` : `${words.elapsed}${amount}${words.units[value.unit]}${mark}`;
}

/**
 * Turns duration text in the reader's words into the letter form the engine
 * reads (`3d`, `2ed`, `5d?`). Text already in letters passes through, so both
 * forms can be typed.
 */
export function toCanonicalDuration(text: string, words: DurationWords): string {
  let rest = text.trim();
  let elapsed = false;
  const prefix = words.elapsed.trim();
  if (prefix !== "e" && prefix !== "" && rest.startsWith(prefix)) {
    elapsed = true;
    rest = rest.slice(prefix.length).trim();
  }
  const estimated = rest.endsWith("?");
  if (estimated) rest = rest.slice(0, -1).trim();
  const m = /^([+-]?\d+(?:\.\d+)?)\s*(.*)$/.exec(rest);
  if (!m) return text;
  const word = m[2].trim();
  // Longest word first, so a unit whose word starts with another's is not cut short.
  const unit = [...UNITS].sort((a, b) => words.units[b].length - words.units[a].length).find((candidate) => words.units[candidate] === word);
  if (!unit) return text;
  return `${m[1]}${elapsed ? "e" : ""}${unit}${estimated ? "?" : ""}`;
}
