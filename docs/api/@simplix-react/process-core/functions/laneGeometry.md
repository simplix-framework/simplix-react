[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / laneGeometry

# Function: laneGeometry()

> **laneGeometry**(`process`, `options?`): [`LaneGeometry`](../interfaces/LaneGeometry.md)

Defined in: [packages/process-core/src/lane-geometry.ts:252](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L252)

Lays a case out as a lane grid.

The acts of a step stand on one row, each a node in the column of its lane, joined in order;
an act that would make the row turn back starts another row of the same step. Between rows
runs a `flow` row that carries the line from one lane to the next.

A jump leaves the first act of its step and arrives at the first act of its target. A line
that goes up, a jump back or a rework line, leaves leftwards and joins its nodes from the left;
a jump ahead goes down on the right and joins its nodes from the right. On either side a line
runs on the act's own row where nothing stands on that side of the act, and otherwise over a
`gate` row above it, dropping into the node beside the lane's own line.

A line that goes up rises in the nearest column to the left of the acts it joins that nothing
stands in on the rows it passes: a lane where one is clear, and otherwise a track left of the lanes.

A step with a rework line gets a `rework` row under its acts: the line leaves its last act and
crosses leftwards to a turn-back node. Where the step's acts stand on one row and the first act
stands left of the last, the node stands under the first act and the line goes straight up into
it; otherwise it comes back the way a jump back does.

Every line that arrives at one step on one side travels in one track column, so their vertical
parts stand on one line.

A parallel run forks and joins. The line from the step before it reaches a row above the run
and drops from there into the first act of each of its steps; the lines out of their last acts
meet on a row below the run, and one line goes on from there. A branch drops straight down its
lane where no node of another step of the run stands in the way, and otherwise goes round by a
track on the right.

A step or an act the case leaves out stands where it would otherwise, where the reading draws
such parts. The line of the stated order runs through it, marked `off` from the last act of the
case before it to the first act of the case after it; its own jumps and rework line are `off` too.

## Parameters

### process

[`ResolvedProcess`](../interfaces/ResolvedProcess.md)

### options?

[`LaneGeometryOptions`](../interfaces/LaneGeometryOptions.md) = `{}`

## Returns

[`LaneGeometry`](../interfaces/LaneGeometry.md)
