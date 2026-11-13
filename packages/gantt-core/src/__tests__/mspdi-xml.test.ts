import { describe, expect, it } from "vitest";
import { ScheduleError } from "../errors";
import {
  decodeDurationFormat,
  encodeDurationFormat,
  formatMspdiDuration,
  parseMspdiDuration,
} from "../mspdi/codes";
import { childElement, childText, escapeXmlText, parseXml, XmlWriter } from "../mspdi/xml";
import { formatClockTime, formatLocalDateTime, parseClockTime, parseLocalDateTime } from "../time";

describe("parseXml", () => {
  it("decodes the five named entities and numeric references", () => {
    const root = parseXml("<a>&lt;&gt;&amp;&quot;&apos; &#65;&#x42;&#x1F600;</a>");
    expect(root.text).toBe("<>&\"' AB\u{1F600}");
  });

  it("keeps CDATA verbatim and joins it with surrounding text", () => {
    expect(parseXml("<a>x<![CDATA[<b>&amp;</b>]]>y</a>").text).toBe("x<b>&amp;</b>y");
  });

  it("reads attributes in both quote styles with entities", () => {
    const root = parseXml(`<a one="1" two='t&amp;"q"' xmlns="urn:x"/>`);
    expect(root.attributes).toEqual({ one: "1", two: 't&"q"', xmlns: "urn:x" });
    expect(root.children).toEqual([]);
  });

  it("skips a BOM, the declaration, comments, processing instructions and a doctype", () => {
    const root = parseXml("﻿<?xml version=\"1.0\"?>\n<!DOCTYPE p>\n<!-- c --><p><?pi x?><!-- c2 --><q>1</q></p>\n<!-- end -->");
    expect(root.name).toBe("p");
    expect(childText(root, "q")).toBe("1");
  });

  it("keeps every value as text: 1.10 and a leading-zero UID survive", () => {
    const root = parseXml("<Task><UID>007</UID><Version>1.10</Version><Empty/></Task>");
    expect(childText(root, "UID")).toBe("007");
    expect(childText(root, "Version")).toBe("1.10");
    expect(childElement(root, "Empty")?.text).toBe("");
  });

  it.each([
    ["unclosed element", "<a><b></a>"],
    ["mismatched end tag", "<a></b>"],
    ["unknown entity", "<a>&nbsp;</a>"],
    ["bare ampersand", "<a>a & b</a>"],
    ["unquoted attribute", "<a x=1/>"],
    ["duplicate attribute", "<a x='1' x='2'/>"],
    ["two roots", "<a/><b/>"],
    ["text after root", "<a/>x"],
    ["no root", "<?xml version='1.0'?>"],
    ["unterminated CDATA", "<a><![CDATA[x</a>"],
    ["unterminated comment", "<a><!-- x</a>"],
    ["empty document", ""],
    ["bad character reference", "<a>&#xZZ;</a>"],
  ])("raises invalid-xml for %s", (_label, source) => {
    expect(() => parseXml(source)).toThrow(ScheduleError);
    expect(() => parseXml(source)).toThrow(expect.objectContaining({ code: "invalid-xml" }));
  });
});

describe("XmlWriter", () => {
  it("escapes text and attributes so the parser reads them back", () => {
    const value = "a<b>&\"c\"'\r\n\td";
    const xml = new XmlWriter().start("r", { k: value }).leaf("v", value).leaf("skipped", undefined).end().toString();
    const root = parseXml(xml);
    expect(root.attributes.k).toBe(value);
    expect(childText(root, "v")).toBe(value);
    expect(childElement(root, "skipped")).toBeUndefined();
  });

  it("refuses a character XML cannot carry and an unclosed element", () => {
    expect(() => escapeXmlText("a\u0001")).toThrow(expect.objectContaining({ code: "invalid-xml" }));
    expect(() => new XmlWriter().start("r").toString()).toThrow(ScheduleError);
  });
});

describe("MSPDI duration and date helpers", () => {
  it.each([
    ["PT8H0M0S", 480],
    ["PT0H0M0S", 0],
    ["PT1H30M30S", 90.5],
    ["PT1234H5M0S", 74045],
    ["-PT4H0M0S", -240],
  ])("parses %s and formats it back", (text, minutes) => {
    expect(parseMspdiDuration(text)).toBe(minutes);
    expect(formatMspdiDuration(minutes)).toBe(text);
  });

  it("reads other xsd:duration forms and writes the hour form", () => {
    expect(parseMspdiDuration("P1DT2H")).toBe(1560);
    expect(parseMspdiDuration("PT0.5H")).toBe(30);
    expect(formatMspdiDuration(1560)).toBe("PT26H0M0S");
  });

  it.each(["", "P", "PT", "8H", "P1Y", "P2M", "PTxH"])("rejects %j", (text) => {
    expect(() => parseMspdiDuration(text)).toThrow(expect.objectContaining({ code: "invalid-duration" }));
  });

  it("decodes and encodes every DurationFormat code", () => {
    expect(decodeDurationFormat(7)).toEqual({ unit: "d", elapsed: false, estimated: false, percent: false });
    expect(decodeDurationFormat(40)).toEqual({ unit: "d", elapsed: true, estimated: true, percent: false });
    expect(decodeDurationFormat(52)).toEqual({ elapsed: true, estimated: true, percent: true });
    expect(decodeDurationFormat(53)).toEqual({ elapsed: false, estimated: true, percent: false });
    expect(decodeDurationFormat(13)).toBeUndefined();
    for (const code of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]) {
      const f = decodeDurationFormat(code);
      expect(f?.unit).toBeDefined();
      expect(encodeDurationFormat(f?.unit ?? "m", f?.elapsed, f?.estimated)).toBe(code);
    }
  });

  it("parses and formats local date-times and clock times", () => {
    for (const text of ["2018-10-18T08:00:00", "2000-02-29T23:59:00", "1999-12-31T00:00:00"]) {
      expect(formatLocalDateTime(parseLocalDateTime(text))).toBe(text);
    }
    expect(formatClockTime(parseClockTime("13:00:00"))).toBe("13:00:00");
  });
});
