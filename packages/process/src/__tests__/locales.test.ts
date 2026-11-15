import { describe, expect, it } from "vitest";

import editEn from "../locales/edit/en.json";
import editJa from "../locales/edit/ja.json";
import editKo from "../locales/edit/ko.json";
import en from "../locales/en.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";

function keysOf(catalogue: object, prefix = ""): string[] {
  return Object.entries(catalogue).flatMap(([key, value]) => (typeof value === "object" && value !== null ? keysOf(value, `${prefix}${key}.`) : [`${prefix}${key}`]));
}

describe("the translation catalogues", () => {
  it("hold the same keys in every language", () => {
    expect(keysOf(ko).sort()).toEqual(keysOf(en).sort());
    expect(keysOf(ja).sort()).toEqual(keysOf(en).sort());
    expect(keysOf(editKo).sort()).toEqual(keysOf(editEn).sort());
    expect(keysOf(editJa).sort()).toEqual(keysOf(editEn).sort());
  });
});
