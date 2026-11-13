import { describe, expect, it } from "vitest";

import en from "../locales/en.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";

declare global {
  interface ImportMeta {
    /** Vite's file glob, as far as this file uses it. */
    glob(patterns: string[], options: { query: "?raw"; import: "default"; eager: true }): Record<string, string>;
  }
}

/** The text of every source file of the package, the tests and the catalogues left out. */
const SOURCES = import.meta.glob(["../**/*.ts", "../**/*.tsx", "!../__tests__/**"], { query: "?raw", import: "default", eager: true });

function keysOf(catalogue: object, prefix = ""): string[] {
  return Object.entries(catalogue).flatMap(([key, value]) => (typeof value === "object" && value !== null ? keysOf(value, `${prefix}${key}.`) : [`${prefix}${key}`]));
}

describe("the translation catalogues", () => {
  it("hold the same keys in every language", () => {
    const keys = keysOf(en).sort();
    expect(keysOf(ko).sort()).toEqual(keys);
    expect(keysOf(ja).sort()).toEqual(keys);
  });

  it("hold no key the chart never asks for", () => {
    const code = Object.values(SOURCES).join("\n");
    expect(Object.keys(SOURCES).length).toBeGreaterThan(40);
    // A key is asked for by name, or made from a fixed start and a value: `view.${id}`.
    const named = new Set([...code.matchAll(/["'`]([a-zA-Z]+(?:\.[a-zA-Z0-9_-]+)+)["'`]/g)].map((match) => match[1]));
    const starts = [...new Set([...code.matchAll(/`([a-zA-Z.]+\.)\$\{/g)].map((match) => match[1]))];
    // What a made key ends in is not checked for these: their values are lists in the code.
    const unused = keysOf(en).filter((key) => !named.has(key) && !starts.some((start) => key.startsWith(start)));
    expect(unused).toEqual([]);
  });
});
