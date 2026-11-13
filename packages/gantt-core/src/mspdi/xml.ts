import { ScheduleError } from "../errors";

/**
 * One element of a parsed XML document. Every value is kept as the string the
 * document holds; nothing is converted to a number or a boolean.
 */
export interface XmlElement {
  /** Qualified name as written, prefix included. */
  readonly name: string;
  readonly attributes: Readonly<Record<string, string>>;
  readonly children: readonly XmlElement[];
  /** Character data directly inside the element (text and CDATA), entities decoded. */
  readonly text: string;
}

interface MutableElement {
  name: string;
  attributes: Record<string, string>;
  children: MutableElement[];
  text: string;
}

const NAME_START = /[A-Za-z_:À-￿]/;
const NAME_CHAR = /[A-Za-z0-9_:.\-·À-￿]/;
const NAMED_ENTITIES: Readonly<Record<string, string>> = {
  lt: "<",
  gt: ">",
  amp: "&",
  quot: '"',
  apos: "'",
};

function fail(message: string, position: number): never {
  throw new ScheduleError("invalid-xml", `${message} at offset ${position}`);
}

function decodeEntities(raw: string, offset: number): string {
  if (!raw.includes("&")) {
    return raw;
  }
  let out = "";
  let i = 0;
  while (i < raw.length) {
    const amp = raw.indexOf("&", i);
    if (amp < 0) {
      out += raw.slice(i);
      break;
    }
    out += raw.slice(i, amp);
    const semi = raw.indexOf(";", amp);
    if (semi < 0) {
      fail("Unterminated entity reference", offset + amp);
    }
    const ref = raw.slice(amp + 1, semi);
    if (ref.startsWith("#")) {
      const hex = ref.startsWith("#x");
      const digits = ref.slice(hex ? 2 : 1);
      if (!(hex ? /^[0-9A-Fa-f]+$/ : /^[0-9]+$/).test(digits)) {
        fail(`Bad character reference "&${ref};"`, offset + amp);
      }
      const code = Number.parseInt(digits, hex ? 16 : 10);
      if (code > 0x10ffff || code === 0) {
        fail(`Character reference out of range "&${ref};"`, offset + amp);
      }
      out += String.fromCodePoint(code);
    } else {
      const value = NAMED_ENTITIES[ref];
      if (value === undefined) {
        fail(`Unknown entity "&${ref};"`, offset + amp);
      }
      out += value;
    }
    i = semi + 1;
  }
  return out;
}

class Parser {
  private pos = 0;

  constructor(private readonly src: string) {}

  parse(): XmlElement {
    this.skipMisc(true);
    if (this.src[this.pos] !== "<") {
      fail("Expected the root element", this.pos);
    }
    const root = this.element();
    this.skipMisc(false);
    if (this.pos < this.src.length) {
      fail("Content after the root element", this.pos);
    }
    return root;
  }

  /** Skips whitespace, comments, processing instructions and, in the prolog, a doctype. */
  private skipMisc(prolog: boolean): void {
    for (;;) {
      this.skipSpace();
      if (this.src.startsWith("<?", this.pos)) {
        this.skipPast("?>", "Unterminated processing instruction");
      } else if (this.src.startsWith("<!--", this.pos)) {
        this.skipComment();
      } else if (prolog && this.src.startsWith("<!DOCTYPE", this.pos)) {
        const end = this.src.indexOf(">", this.pos);
        const bracket = this.src.indexOf("[", this.pos);
        if (end < 0) {
          fail("Unterminated doctype", this.pos);
        }
        if (bracket >= 0 && bracket < end) {
          fail("Doctype internal subsets are not supported", this.pos);
        }
        this.pos = end + 1;
      } else {
        return;
      }
    }
  }

  private skipSpace(): void {
    while (this.pos < this.src.length && /\s/.test(this.src[this.pos] ?? "")) {
      this.pos++;
    }
  }

  private skipPast(terminator: string, message: string): void {
    const end = this.src.indexOf(terminator, this.pos);
    if (end < 0) {
      fail(message, this.pos);
    }
    this.pos = end + terminator.length;
  }

  private skipComment(): void {
    const end = this.src.indexOf("-->", this.pos + 4);
    if (end < 0) {
      fail("Unterminated comment", this.pos);
    }
    if (this.src.slice(this.pos + 4, end).includes("--")) {
      fail("Double hyphen inside a comment", this.pos);
    }
    this.pos = end + 3;
  }

  private name(): string {
    const start = this.pos;
    if (!NAME_START.test(this.src[this.pos] ?? "")) {
      fail("Expected a name", this.pos);
    }
    this.pos++;
    while (this.pos < this.src.length && NAME_CHAR.test(this.src[this.pos] ?? "")) {
      this.pos++;
    }
    return this.src.slice(start, this.pos);
  }

  private element(): MutableElement {
    this.pos++; // "<"
    const el: MutableElement = { name: this.name(), attributes: {}, children: [], text: "" };
    for (;;) {
      const before = this.pos;
      this.skipSpace();
      const ch = this.src[this.pos];
      if (ch === "/") {
        if (this.src[this.pos + 1] !== ">") {
          fail("Expected />", this.pos);
        }
        this.pos += 2;
        return el;
      }
      if (ch === ">") {
        this.pos++;
        break;
      }
      if (ch === undefined) {
        fail(`Unterminated start tag <${el.name}>`, this.pos);
      }
      if (before === this.pos) {
        fail("Expected whitespace before an attribute", this.pos);
      }
      this.attribute(el);
    }
    this.content(el);
    return el;
  }

  private attribute(el: MutableElement): void {
    const name = this.name();
    this.skipSpace();
    if (this.src[this.pos] !== "=") {
      fail(`Expected = after attribute ${name}`, this.pos);
    }
    this.pos++;
    this.skipSpace();
    const quote = this.src[this.pos];
    if (quote !== '"' && quote !== "'") {
      fail(`Expected a quoted value for attribute ${name}`, this.pos);
    }
    const end = this.src.indexOf(quote, this.pos + 1);
    if (end < 0) {
      fail(`Unterminated value of attribute ${name}`, this.pos);
    }
    const raw = this.src.slice(this.pos + 1, end);
    if (raw.includes("<")) {
      fail(`Character < inside attribute ${name}`, this.pos);
    }
    if (Object.hasOwn(el.attributes, name)) {
      fail(`Duplicate attribute ${name}`, this.pos);
    }
    el.attributes[name] = decodeEntities(raw, this.pos + 1);
    this.pos = end + 1;
  }

  private content(el: MutableElement): void {
    for (;;) {
      const lt = this.src.indexOf("<", this.pos);
      if (lt < 0) {
        fail(`Missing end tag </${el.name}>`, this.pos);
      }
      if (lt > this.pos) {
        const raw = this.src.slice(this.pos, lt);
        if (raw.includes("]]>")) {
          fail("Sequence ]]> in text", this.pos);
        }
        el.text += decodeEntities(raw, this.pos);
        this.pos = lt;
      }
      if (this.src.startsWith("</", this.pos)) {
        this.pos += 2;
        const name = this.name();
        if (name !== el.name) {
          fail(`End tag </${name}> does not match <${el.name}>`, this.pos);
        }
        this.skipSpace();
        if (this.src[this.pos] !== ">") {
          fail(`Expected > to close </${name}>`, this.pos);
        }
        this.pos++;
        return;
      }
      if (this.src.startsWith("<![CDATA[", this.pos)) {
        const end = this.src.indexOf("]]>", this.pos + 9);
        if (end < 0) {
          fail("Unterminated CDATA section", this.pos);
        }
        el.text += this.src.slice(this.pos + 9, end);
        this.pos = end + 3;
      } else if (this.src.startsWith("<!--", this.pos)) {
        this.skipComment();
      } else if (this.src.startsWith("<?", this.pos)) {
        this.skipPast("?>", "Unterminated processing instruction");
      } else if (this.src.startsWith("<!", this.pos)) {
        fail("Unexpected markup declaration", this.pos);
      } else {
        el.children.push(this.element());
      }
    }
  }
}

/**
 * Parses an XML document into its root element. A leading byte order mark is
 * ignored. Raises `ScheduleError("invalid-xml")` for a document that is not
 * well formed.
 */
export function parseXml(source: string): XmlElement {
  const text = source.charCodeAt(0) === 0xfeff ? source.slice(1) : source;
  return new Parser(text).parse();
}

/** First child element with the given name, or undefined. */
export function childElement(el: XmlElement, name: string): XmlElement | undefined {
  return el.children.find((c) => c.name === name);
}

/** Every child element with the given name, in document order. */
export function childElements(el: XmlElement, name: string): XmlElement[] {
  return el.children.filter((c) => c.name === name);
}

/** Text of the first child element with the given name, or undefined when it is absent. */
export function childText(el: XmlElement, name: string): string | undefined {
  return childElement(el, name)?.text;
}

// Characters XML 1.0 cannot carry at all, even as a character reference.
// eslint-disable-next-line no-control-regex
const FORBIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/;

function checkWritable(value: string): void {
  if (FORBIDDEN.test(value)) {
    throw new ScheduleError("invalid-xml", `Value holds a character XML cannot represent: ${JSON.stringify(value)}`);
  }
}

/** Escapes character data for an element body. */
export function escapeXmlText(value: string): string {
  checkWritable(value);
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#13;");
}

/** Escapes a value for a double-quoted attribute. */
export function escapeXmlAttribute(value: string): string {
  return escapeXmlText(value).replace(/"/g, "&quot;").replace(/\t/g, "&#9;").replace(/\n/g, "&#10;");
}

/**
 * Builds an indented XML document element by element. Elements are written
 * in the order the calls are made.
 */
export class XmlWriter {
  private readonly parts: string[] = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'];
  private readonly open: string[] = [];

  /** Opens an element; every later call writes inside it until `end`. */
  start(name: string, attributes: Readonly<Record<string, string>> = {}): this {
    const attrs = Object.entries(attributes)
      .map(([key, value]) => ` ${key}="${escapeXmlAttribute(value)}"`)
      .join("");
    this.parts.push(`${"\t".repeat(this.open.length)}<${name}${attrs}>\n`);
    this.open.push(name);
    return this;
  }

  /** Closes the most recently opened element. */
  end(): this {
    const name = this.open.pop();
    if (name === undefined) {
      throw new ScheduleError("invalid-operation", "No open XML element to close");
    }
    this.parts.push(`${"\t".repeat(this.open.length)}</${name}>\n`);
    return this;
  }

  /** Writes an element holding only text. Nothing is written for undefined. */
  leaf(name: string, value: string | undefined): this {
    if (value !== undefined) {
      this.parts.push(`${"\t".repeat(this.open.length)}<${name}>${escapeXmlText(value)}</${name}>\n`);
    }
    return this;
  }

  /** The finished document. Raises when an element is still open. */
  toString(): string {
    if (this.open.length > 0) {
      throw new ScheduleError("invalid-operation", `XML element <${this.open[this.open.length - 1]}> is not closed`);
    }
    return this.parts.join("");
  }
}
