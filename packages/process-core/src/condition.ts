import type { Condition, Facts } from "./types";

/** What a condition comes to under a set of facts: it holds, it fails, or a fact it needs is unknown. */
export type Verdict = "true" | "false" | "unknown";

/**
 * Evaluates a condition under the facts given, in three values.
 *
 * `all` fails as soon as one part fails and `any` holds as soon as one part holds, whatever the
 * unknown parts would have been; an empty `all` holds and an empty `any` fails.
 */
export function evaluateCondition(condition: Condition, facts: Facts): Verdict {
  if ("fact" in condition) {
    const value = facts[condition.fact];
    return value === undefined ? "unknown" : value ? "true" : "false";
  }
  if ("not" in condition) {
    const inner = evaluateCondition(condition.not, facts);
    return inner === "unknown" ? "unknown" : inner === "true" ? "false" : "true";
  }
  if ("all" in condition) {
    let unknown = false;
    for (const part of condition.all) {
      const verdict = evaluateCondition(part, facts);
      if (verdict === "false") return "false";
      if (verdict === "unknown") unknown = true;
    }
    return unknown ? "unknown" : "true";
  }
  let unknown = false;
  for (const part of condition.any) {
    const verdict = evaluateCondition(part, facts);
    if (verdict === "true") return "true";
    if (verdict === "unknown") unknown = true;
  }
  return unknown ? "unknown" : "false";
}

/** The names of the facts a condition reads, each once, in the order they are first met. */
export function conditionFacts(condition: Condition): string[] {
  const names: string[] = [];
  const visit = (node: Condition): void => {
    if ("fact" in node) {
      if (!names.includes(node.fact)) names.push(node.fact);
    } else if ("not" in node) visit(node.not);
    else if ("all" in node) node.all.forEach(visit);
    else node.any.forEach(visit);
  };
  visit(condition);
  return names;
}

/** Whether a value has the shape of a condition, at every depth. */
export function isCondition(value: unknown): value is Condition {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const node = value as Record<string, unknown>;
  const keys = Object.keys(node);
  if (keys.length !== 1) return false;
  if ("fact" in node) return typeof node.fact === "string" && node.fact.length > 0;
  if ("not" in node) return isCondition(node.not);
  const parts = "all" in node ? node.all : "any" in node ? node.any : undefined;
  return Array.isArray(parts) && parts.every(isCondition);
}
