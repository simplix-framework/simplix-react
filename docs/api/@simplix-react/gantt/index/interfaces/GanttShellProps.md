[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [index](../README.md) / GanttShellProps

# Interface: GanttShellProps

Defined in: [components/gantt.tsx:26](https://github.com/simplix-framework/simplix-react/blob/main/components/gantt.tsx#L26)

Props for [GanttShell](../functions/GanttShell.md).

## Extends

- [`GanttChartProps`](GanttChartProps.md).`Pick`\<[`GanttToolbarProps`](GanttToolbarProps.md), `"xmlExchange"` \| `"planFiles"` \| `"trailing"`\>

## Extended by

- [`GanttProps`](GanttProps.md)

## Properties

### className?

> `optional` **className**: `string`

Defined in: [components/gantt.tsx:27](https://github.com/simplix-framework/simplix-react/blob/main/components/gantt.tsx#L27)

***

### defaultGridWidth?

> `optional` **defaultGridWidth**: `number`

Defined in: [components/gantt-chart.tsx:41](https://github.com/simplix-framework/simplix-react/blob/main/components/gantt-chart.tsx#L41)

Width the task table opens at. It can be dragged wider or narrower.

#### Inherited from

[`GanttChartProps`](GanttChartProps.md).[`defaultGridWidth`](GanttChartProps.md#defaultgridwidth)

***

### emptyState?

> `optional` **emptyState**: `ReactNode`

Defined in: [components/gantt.tsx:29](https://github.com/simplix-framework/simplix-react/blob/main/components/gantt.tsx#L29)

Replaces the built-in message of a plan without tasks.

***

### planFiles?

> `optional` **planFiles**: `boolean`

Defined in: [components/gantt-toolbar.tsx:40](https://github.com/simplix-framework/simplix-react/blob/main/components/gantt-toolbar.tsx#L40)

Shows the commands that save the plan to a file of its own form and open one.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`planFiles`](GanttToolbarProps.md#planfiles)

***

### trailing?

> `optional` **trailing**: `ReactNode`

Defined in: [components/gantt-toolbar.tsx:42](https://github.com/simplix-framework/simplix-react/blob/main/components/gantt-toolbar.tsx#L42)

Extra controls at the end of the bar.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`trailing`](GanttToolbarProps.md#trailing)

***

### weekStartsOn?

> `optional` **weekStartsOn**: `number`

Defined in: [components/gantt-chart.tsx:43](https://github.com/simplix-framework/simplix-react/blob/main/components/gantt-chart.tsx#L43)

First day of a week column: 0 is Sunday.

#### Inherited from

[`GanttChartProps`](GanttChartProps.md).[`weekStartsOn`](GanttChartProps.md#weekstartson)

***

### xmlExchange?

> `optional` **xmlExchange**: `boolean`

Defined in: [components/gantt-toolbar.tsx:38](https://github.com/simplix-framework/simplix-react/blob/main/components/gantt-toolbar.tsx#L38)

Shows the commands that read and write a Microsoft Project XML file.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`xmlExchange`](GanttToolbarProps.md#xmlexchange)
