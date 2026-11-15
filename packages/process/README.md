# @simplix-react/process

A procedure drawn from its definition: steps and acts on a grid of lanes with jumps, parallel runs and conditions, laid out as one column in a narrow box. The editor and the comparison of two versions are a separate entry point, so a screen that only draws a procedure loads no editing code.

The model is `@simplix-react/process-core`.

## Installation

```bash
pnpm add @simplix-react/process @simplix-react/process-core
```

```css
@import "@simplix-react/process/styles.css";
```

## Drawing a procedure

```tsx
import { ProcessLanes } from "@simplix-react/process";

<ProcessLanes definition={definition} facts={{ large: true }} run={runState} selected={selected} onSelect={setSelected} />;
```

- The layout follows the width of the component's own box, never the screen: lanes side by side where they fit, the same grid scrolled sideways where they do not, and one column of step cards in a narrow box.
- `run` marks how far a case has come; the act in progress carries a ring that spreads and fades.
- `highlightLanes` tints the lanes the reader holds, and `marks` sets a word on a step, an act or a jump as `data-mark`.
- Colours, type sizes and radii are the theme tokens of `@simplix-react/ui`; the markup is the same under every design.

## Editing a procedure

```tsx
import { ProcessEditor, useProcessEditing } from "@simplix-react/process/edit";

function Settings({ stored }: { stored: ProcessDefinition }) {
  const editing = useProcessEditing(stored);
  return <ProcessEditor editing={editing} problems={ownRules(editing.definition)} />;
}
```

- The editor draws the procedure and, beside it, a panel that edits the part picked on the drawing. In a narrow box the panel stands under the drawing.
- Every change is one operation of `process-core`, so it can be undone. An operation that would leave a problem is refused, and its reason is shown above the drawing.
- `problems` lists what the caller's own rules find beside the problems of the format, and `renderFields` draws the caller's own fields for the part picked.
- `ProcessProblems` is the list of problems on its own, for a check before publishing.

## Comparing two versions

```tsx
import { ProcessDiff } from "@simplix-react/process/edit";

<ProcessDiff before={published} after={draft} />;
```

The later version is drawn with its added, changed and moved parts marked, and every difference is listed under it by the name of its part.
