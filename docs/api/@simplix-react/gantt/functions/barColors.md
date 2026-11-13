[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / barColors

# Function: barColors()

> **barColors**(`project`, `coloring`): (`task`) => `string` \| `undefined`

Defined in: [lib/bar-color.ts:13](https://github.com/simplix-react/simplix-react/blob/main/lib/bar-color.ts#L13)

Returns the colour of each task's bar under a colouring, or `undefined`
where the bar keeps the chart's own colour. The screen and the PDF both
ask here, so a bar is the same colour in both.

## Parameters

### project

`Project`

### coloring

[`BarColoring`](../type-aliases/BarColoring.md)

## Returns

> (`task`): `string` \| `undefined`

### Parameters

#### task

`Task`

### Returns

`string` \| `undefined`
