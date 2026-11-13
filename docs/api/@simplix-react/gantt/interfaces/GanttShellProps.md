[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / GanttShellProps

# Interface: GanttShellProps

Defined in: [components/gantt.tsx:19](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L19)

Props for [GanttShell](../functions/GanttShell.md).

## Extends

- [`GanttChartProps`](GanttChartProps.md).`Pick`\<[`GanttToolbarProps`](GanttToolbarProps.md), `"xmlExchange"` \| `"trailing"`\>

## Extended by

- [`GanttProps`](GanttProps.md)

## Properties

### className?

> `optional` **className**: `string`

Defined in: [components/gantt.tsx:20](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L20)

***

### defaultGridWidth?

> `optional` **defaultGridWidth**: `number`

Defined in: [components/gantt-chart.tsx:43](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L43)

Width the task table opens at. It can be dragged wider or narrower.

#### Inherited from

[`GanttChartProps`](GanttChartProps.md).[`defaultGridWidth`](GanttChartProps.md#defaultgridwidth)

***

### emptyState?

> `optional` **emptyState**: `ReactNode`

Defined in: [components/gantt.tsx:22](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L22)

Replaces the built-in message of a plan without tasks.

***

### trailing?

> `optional` **trailing**: `ReactNode`

Defined in: [components/gantt-toolbar.tsx:71](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L71)

Extra controls at the end of the bar.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`trailing`](GanttToolbarProps.md#trailing)

***

### weekStartsOn?

> `optional` **weekStartsOn**: `number`

Defined in: [components/gantt-chart.tsx:45](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L45)

First day of a week column: 0 is Sunday.

#### Inherited from

[`GanttChartProps`](GanttChartProps.md).[`weekStartsOn`](GanttChartProps.md#weekstartson)

***

### xmlExchange?

> `optional` **xmlExchange**: `boolean`

Defined in: [components/gantt-toolbar.tsx:69](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L69)

Shows the commands that read and write a Microsoft Project XML file.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`xmlExchange`](GanttToolbarProps.md#xmlexchange)
