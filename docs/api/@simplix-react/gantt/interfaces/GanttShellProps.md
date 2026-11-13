[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / GanttShellProps

# Interface: GanttShellProps

Defined in: [components/gantt.tsx:23](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L23)

Props for [GanttShell](../functions/GanttShell.md).

## Extends

- [`GanttChartProps`](GanttChartProps.md).`Pick`\<[`GanttToolbarProps`](GanttToolbarProps.md), `"xmlExchange"` \| `"trailing"`\>

## Extended by

- [`GanttProps`](GanttProps.md)

## Properties

### className?

> `optional` **className**: `string`

Defined in: [components/gantt.tsx:24](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L24)

***

### defaultGridWidth?

> `optional` **defaultGridWidth**: `number`

Defined in: [components/gantt-chart.tsx:44](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L44)

Width the task table opens at. It can be dragged wider or narrower.

#### Inherited from

[`GanttChartProps`](GanttChartProps.md).[`defaultGridWidth`](GanttChartProps.md#defaultgridwidth)

***

### emptyState?

> `optional` **emptyState**: `ReactNode`

Defined in: [components/gantt.tsx:26](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L26)

Replaces the built-in message of a plan without tasks.

***

### trailing?

> `optional` **trailing**: `ReactNode`

Defined in: [components/gantt-toolbar.tsx:79](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L79)

Extra controls at the end of the bar.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`trailing`](GanttToolbarProps.md#trailing)

***

### weekStartsOn?

> `optional` **weekStartsOn**: `number`

Defined in: [components/gantt-chart.tsx:46](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L46)

First day of a week column: 0 is Sunday.

#### Inherited from

[`GanttChartProps`](GanttChartProps.md).[`weekStartsOn`](GanttChartProps.md#weekstartson)

***

### xmlExchange?

> `optional` **xmlExchange**: `boolean`

Defined in: [components/gantt-toolbar.tsx:77](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L77)

Shows the commands that read and write a Microsoft Project XML file.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`xmlExchange`](GanttToolbarProps.md#xmlexchange)
