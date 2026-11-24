[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / Segment

# Interface: Segment

Defined in: [packages/process-core/src/lane-geometry.ts:28](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L28)

One piece of a line inside one cell, from one of the cell's points to another.

## Properties

### arrow?

> `optional` **arrow**: `boolean`

Defined in: [packages/process-core/src/lane-geometry.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L33)

An arrowhead at `to`, pointing the way the piece runs.

***

### from

> **from**: [`SegmentEnd`](../type-aliases/SegmentEnd.md)

Defined in: [packages/process-core/src/lane-geometry.ts:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L29)

***

### hop?

> `optional` **hop**: `boolean`

Defined in: [packages/process-core/src/lane-geometry.ts:37](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L37)

A piece running across that passes over a line running up or down which it does not join: it is drawn with a hop over that line.

***

### off?

> `optional` **off**: `boolean`

Defined in: [packages/process-core/src/lane-geometry.ts:39](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L39)

A piece only steps or acts the case leaves out are reached by: it is drawn as left out.

***

### style

> **style**: [`SegmentStyle`](../type-aliases/SegmentStyle.md)

Defined in: [packages/process-core/src/lane-geometry.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L31)

***

### tail?

> `optional` **tail**: `boolean`

Defined in: [packages/process-core/src/lane-geometry.ts:35](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L35)

A second arrowhead just past the bend, on a piece that turns into a line already running: it shows the way the two go on.

***

### to

> **to**: [`SegmentEnd`](../type-aliases/SegmentEnd.md)

Defined in: [packages/process-core/src/lane-geometry.ts:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L30)
