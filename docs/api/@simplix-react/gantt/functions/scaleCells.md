[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / scaleCells

# Function: scaleCells()

> **scaleCells**(`scale`, `unit`, `fromX`, `toX`, `weekStartsOn?`): [`ScaleCell`](../interfaces/ScaleCell.md)[]

Defined in: [lib/time-scale.ts:110](https://github.com/simplix-react/simplix-react/blob/main/lib/time-scale.ts#L110)

The header cells of one unit between two pixels of the scale. Only the
cells that intersect the pixel range are returned, so a long plan costs no
more than what is on screen.

## Parameters

### scale

[`TimeScale`](../interfaces/TimeScale.md)

### unit

[`ScaleUnit`](../type-aliases/ScaleUnit.md)

### fromX

`number`

### toX

`number`

### weekStartsOn?

`number` = `0`

## Returns

[`ScaleCell`](../interfaces/ScaleCell.md)[]
