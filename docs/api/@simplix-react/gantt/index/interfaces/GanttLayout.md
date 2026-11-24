[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [index](../README.md) / GanttLayout

# Interface: GanttLayout

Defined in: [model/gantt-store-types.ts:43](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L43)

How a chart is laid out and what it shows, apart from the plan itself: the
part an application stores per reader and hands back when the chart opens.

## Properties

### barColoring

> **barColoring**: [`BarColoring`](../type-aliases/BarColoring.md)

Defined in: [model/gantt-store-types.ts:57](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L57)

***

### barText

> **barText**: [`BarText`](../type-aliases/BarText.md)

Defined in: [model/gantt-store-types.ts:56](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L56)

***

### baselineNumber

> **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:55](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L55)

***

### collapsed

> **collapsed**: readonly `string`[]

Defined in: [model/gantt-store-types.ts:50](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L50)

***

### columns

> **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:45](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L45)

***

### columnWidths

> **columnWidths**: [`ColumnWidths`](../type-aliases/ColumnWidths.md)

Defined in: [model/gantt-store-types.ts:46](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L46)

***

### gridWidth

> **gridWidth**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L48)

Width of the task table, or `null` to fit its columns.

***

### pane

> **pane**: [`GanttPane`](../type-aliases/GanttPane.md)

Defined in: [model/gantt-store-types.ts:60](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L60)

Whether the Gantt view shows the table, the timeline or both.

***

### showCriticalPath

> **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:51](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L51)

***

### showLinks

> **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:52](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L52)

***

### showMarkers

> **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L53)

***

### showProgressLine

> **showProgressLine**: `boolean`

Defined in: [model/gantt-store-types.ts:54](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L54)

***

### view

> **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:44](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L44)

***

### viewOptions

> **viewOptions**: [`ViewOptions`](ViewOptions.md)

Defined in: [model/gantt-store-types.ts:58](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L58)

***

### zoom

> **zoom**: `number`

Defined in: [model/gantt-store-types.ts:49](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L49)
