[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / parsePredecessors

# Function: parsePredecessors()

> **parsePredecessors**(`text`, `sizes`): [`PredecessorRef`](../interfaces/PredecessorRef.md)[]

Defined in: [packages/gantt-core/src/duration.ts:110](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/duration.ts#L110)

Reads a predecessor list as it is typed into a task table: `3`, `3FS+2d`,
`4SS-1d`, `5FF+50%`, separated by commas or semicolons.

## Parameters

### text

`string`

### sizes

[`UnitSizes`](../type-aliases/UnitSizes.md)

## Returns

[`PredecessorRef`](../interfaces/PredecessorRef.md)[]

## Throws

ScheduleError `invalid-operation` when an entry cannot be read.
