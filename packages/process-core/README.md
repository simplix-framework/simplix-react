# @simplix-react/process-core

A procedure as data, with no runtime dependency and no UI: the definition format, its validation, conditions over the facts of a case, the reading order, the layout of lanes and of one column, editing operations with undo, and the comparison of two versions.

`@simplix-react/process` draws a procedure on top of it. Use this package alone to validate, edit or compare definitions on a server, in a CLI or in a test.

## Installation

```bash
pnpm add @simplix-react/process-core
```

## The definition

A procedure is a list of sections, and a section is a list of steps. The steps have one order, the order they are written in. What departs from that order is stated on the steps and beside them.

| Part | Meaning |
| --- | --- |
| `lanes` | Who performs acts: a role, a department, a system. |
| `sections[].steps[]` | A step is an ordered run of acts. |
| `acts[]` | One thing one lane, or several lanes together, does. `do` performs, `check` confirms. |
| `condition` | A step or an act applies only where the condition holds for the facts of the case. |
| `parallel` | Neighbouring steps that share a key proceed together. |
| `repeat` | The step is performed again until the step it names is performed. |
| `jumps[]` | A move back to an earlier step, ahead to a later one, or out to another procedure. |

A member this package does not know is kept as it stands by every function, so a product stores its own fields on the same definition.

## Quick start

```ts
import { applyEdit, diffDefinitions, parseDefinition, validateDefinition } from "@simplix-react/process-core";

const published = parseDefinition(storedText);
validateDefinition(published); // [] when nothing is wrong

const result = applyEdit(published, { type: "remove-step", id: "review" });
if (result.ok) {
  result.consequences; // the jumps removed with the step, a repeat cleared, a parallel run left
  diffDefinitions(published, result.definition); // what a reader of the new version should look at
} else {
  result.refusal; // why the operation was not applied
}
```

## Editing

`applyEdit(definition, operation)` returns a new definition and leaves the one given as it is.

- **An operation is applied only when it leaves no problem `validateDefinition` did not already report.** A definition without problems stays without them; a draft that has problems can still be edited, and no edit adds one.
- **What depends on a step follows it.** Removing a step removes the jumps from and to it and clears a repeat it ended. A step put between two steps of a parallel run joins the run, and a run left with one step loses its key. Each is listed in `consequences`.
- **A refusal carries its reason**: the code of the problem it would have left, or `unknown-subject`, `lane-in-use`, `nothing-to-change`.
- **A patch member given as `undefined` is taken off the part**, and a member of the caller's own is set like any other.

- **With `keepFlow` an operation that changes what the procedure does is refused as `flow-changed`.** `sameFlow` and `flowOf` tell what a procedure does apart from its wording, its sections, its lanes and who is named for an act.

`createHistory`, `commitEdit`, `undoEdit` and `redoEdit` keep the definitions an editing session went through. `freshId` gives an id nothing in the definition carries.

## Comparing versions

`diffDefinitions(before, after)` matches parts by id and lists them as `added`, `removed`, `changed` (with the members that differ) or `moved` (another parent, or another order among the parts both versions hold).

## Reading and layout

| Function | Result |
| --- | --- |
| `resolveProcess` | The steps and acts that apply for the facts given, and the ones left out with their condition. Its `leftOut` option says whether the layouts keep what is left out in place (`drawn`, the default) or fold it (`folded`). |
| `readingOrder` | Sections, steps, acts and jumps in the one order every view follows. |
| `laneGeometry` | The procedure on a grid of lanes: rows, columns and the pieces of every line. Under `drawn` the grid is the same whatever the facts, and the acts, lines and jumps of what the case leaves out carry `off`. |
| `stackGeometry` | The procedure as one column of step cards. |
| `chooseLayout` | Which of the two a box of a given width takes. |
