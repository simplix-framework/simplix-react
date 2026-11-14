import { PROCESS_FORMAT, PROCESS_VERSION } from "../types";
import type { Act, Condition, Jump, Lane, ProcessDefinition, Section, Step } from "../types";

export const lane = (id: string, label = id, group?: string): Lane => (group === undefined ? { id, label } : { id, label, group });

export const act = (id: string, lanes: string | string[], kind: Act["kind"] = "do", extra: Partial<Act> = {}): Act => ({
  id,
  lanes: typeof lanes === "string" ? [lanes] : lanes,
  kind,
  label: id,
  ...extra,
});

export const step = (id: string, acts: Act[], extra: Partial<Step> = {}): Step => ({ id, label: id, acts, ...extra });

export const section = (id: string, steps: Step[]): Section => ({ id, label: id, steps });

export const jump = (id: string, from: string, to: string): Jump => ({ id, from, to, label: id });

export const definition = (lanes: Lane[], sections: Section[], jumps: Jump[] = []): ProcessDefinition => ({
  format: PROCESS_FORMAT,
  version: PROCESS_VERSION,
  id: "p",
  name: "p",
  lanes,
  sections,
  jumps,
});

export const fact = (name: string): Condition => ({ fact: name });

/** A purchase request: a rework jump, a step only large purchases take, an act two lanes perform together. */
export function purchaseRequest(): ProcessDefinition {
  return definition(
    [lane("requester"), lane("manager"), lane("finance"), lane("buyer")],
    [
      section("request", [
        step("draft", [act("write", "requester"), act("review", "manager", "check")]),
        step("budget", [act("budget-check", "finance", "check")], { condition: fact("large"), conditionLabel: "large purchase" }),
        step("approve", [act("sign", "manager", "check")]),
      ]),
      section("order", [
        step("quote", [act("collect", "buyer"), act("compare", ["buyer", "requester"])]),
        step("place", [act("order", "buyer")]),
        step("receive", [act("inspect", "requester", "check"), act("pay", "finance")]),
      ]),
    ],
    [jump("rework", "approve", "draft"), jump("requote", "receive", "quote"), jump("direct", "draft", "place")],
  );
}

/** An equipment inspection: a parallel run, a repeating step, a jump ahead, a jump out to another procedure. */
export function equipmentInspection(): ProcessDefinition {
  return definition(
    [lane("operator"), lane("inspector"), lane("maintenance"), lane("safety")],
    [
      section("prepare", [
        step("plan", [act("schedule", "inspector")]),
        step("lockout", [act("isolate", "operator"), act("verify", "safety", "check")], { parallel: "ready" }),
        step("tools", [act("stage", "maintenance")], { parallel: "ready" }),
      ]),
      section("inspect", [
        step("reading", [act("measure", "inspector")], { repeat: { endedBy: "close" } }),
        step("repair", [act("fix", "maintenance"), act("retest", "inspector", "check")], { condition: fact("defect") }),
        step("close", [act("release", "operator"), act("sign-off", "safety", "check")]),
      ]),
    ],
    [jump("no-defect", "reading", "close"), { id: "escalate", from: "repair", external: "incident", label: "escalate" }],
  );
}
