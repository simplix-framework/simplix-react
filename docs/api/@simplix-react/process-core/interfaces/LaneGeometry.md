[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / LaneGeometry

# Interface: LaneGeometry

Defined in: [packages/process-core/src/lane-geometry.ts:124](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L124)

A case laid out on a grid, in grid coordinates only.

Column 0 holds the step titles. Then come the tracks lines that go up travel in, the lanes one
column each, and the tracks lines that go down travel in; of each set of tracks the innermost
(track 0) stands next to the lanes. Where the reading draws what the case leaves out, the rows,
columns and lines are the same whatever the facts, and only the `off` marks differ. Heights and widths are left to whatever draws the grid;
every line is stated as pieces inside single cells, so nothing has to be measured to draw it.

## Properties

### cells

> **cells**: [`GridCell`](GridCell.md)[]

Defined in: [packages/process-core/src/lane-geometry.ts:133](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L133)

***

### groups

> **groups**: [`GroupSpan`](GroupSpan.md)[]

Defined in: [packages/process-core/src/lane-geometry.ts:135](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L135)

***

### lanes

> **lanes**: [`Lane`](Lane.md)[]

Defined in: [packages/process-core/src/lane-geometry.ts:125](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L125)

***

### leftTracks

> **leftTracks**: `number`

Defined in: [packages/process-core/src/lane-geometry.ts:127](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L127)

Tracks left of the lanes.

***

### rightTracks

> **rightTracks**: `number`

Defined in: [packages/process-core/src/lane-geometry.ts:129](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L129)

Tracks right of the lanes.

***

### rows

> **rows**: [`GridRow`](../type-aliases/GridRow.md)[]

Defined in: [packages/process-core/src/lane-geometry.ts:132](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L132)

***

### steps

> **steps**: [`StepSpan`](StepSpan.md)[]

Defined in: [packages/process-core/src/lane-geometry.ts:134](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L134)

***

### tags

> **tags**: [`JumpTag`](JumpTag.md)[]

Defined in: [packages/process-core/src/lane-geometry.ts:136](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L136)

***

### trackCount

> **trackCount**: `number`

Defined in: [packages/process-core/src/lane-geometry.ts:131](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L131)

Both together.
