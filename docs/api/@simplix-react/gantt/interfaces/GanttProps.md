[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / GanttProps

# Interface: GanttProps

Defined in: [components/gantt.tsx:85](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L85)

Props for [Gantt](../functions/Gantt.md).

## Extends

- `Omit`\<[`GanttProviderProps`](GanttProviderProps.md), `"children"`\>.[`GanttShellProps`](GanttShellProps.md)

## Properties

### baselineNumber?

> `optional` **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store.ts:147](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L147)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`baselineNumber`](GanttProviderProps.md#baselinenumber)

***

### className?

> `optional` **className**: `string`

Defined in: [components/gantt.tsx:20](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L20)

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`className`](GanttShellProps.md#classname)

***

### columns?

> `optional` **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [components/gantt-chart.tsx:41](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L41)

Columns of the task table, in order.

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`columns`](GanttShellProps.md#columns)

***

### defaultGridWidth?

> `optional` **defaultGridWidth**: `number`

Defined in: [components/gantt-chart.tsx:43](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L43)

Width the task table opens at. It can be dragged wider or narrower.

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`defaultGridWidth`](GanttShellProps.md#defaultgridwidth)

***

### defaultProject

> **defaultProject**: `Project`

Defined in: [context/gantt-context.tsx:14](https://github.com/simplix-react/simplix-react/blob/main/context/gantt-context.tsx#L14)

The plan the chart opens with. Later changes are made through the store.

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`defaultProject`](GanttProviderProps.md#defaultproject)

***

### emptyState?

> `optional` **emptyState**: `ReactNode`

Defined in: [components/gantt.tsx:22](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L22)

Replaces the built-in message of a plan without tasks.

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`emptyState`](GanttShellProps.md#emptystate)

***

### onChange()?

> `optional` **onChange**: (`project`, `schedule`) => `void`

Defined in: [model/gantt-store.ts:150](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L150)

Called after every accepted change of the plan, undo and redo included.

#### Parameters

##### project

`Project`

##### schedule

`Schedule`

#### Returns

`void`

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`onChange`](GanttProviderProps.md#onchange)

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store.ts:145](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L145)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showCriticalPath`](GanttProviderProps.md#showcriticalpath)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store.ts:146](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L146)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showLinks`](GanttProviderProps.md#showlinks)

***

### trailing?

> `optional` **trailing**: `ReactNode`

Defined in: [components/gantt-toolbar.tsx:70](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L70)

Extra controls at the end of the bar.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`trailing`](GanttToolbarProps.md#trailing)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store.ts:148](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L148)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`view`](GanttProviderProps.md#view)

***

### weekStartsOn?

> `optional` **weekStartsOn**: `number`

Defined in: [components/gantt-chart.tsx:45](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L45)

First day of a week column: 0 is Sunday.

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`weekStartsOn`](GanttShellProps.md#weekstartson)

***

### xmlExchange?

> `optional` **xmlExchange**: `boolean`

Defined in: [components/gantt-toolbar.tsx:68](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L68)

Shows the commands that read and write a Microsoft Project XML file.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`xmlExchange`](GanttToolbarProps.md#xmlexchange)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store.ts:144](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L144)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`zoom`](GanttProviderProps.md#zoom)
