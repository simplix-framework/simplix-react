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

Defined in: [model/gantt-store-types.ts:156](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L156)

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

Defined in: [model/gantt-store-types.ts:158](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L158)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`columns`](GanttProviderProps.md#columns)

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

### levelingOptions?

> `optional` **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:159](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L159)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`levelingOptions`](GanttProviderProps.md#levelingoptions)

***

### onChange()?

> `optional` **onChange**: (`project`, `schedule`, `changes`) => `void`

Defined in: [model/gantt-store-types.ts:164](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L164)

Called after every accepted change of the plan, undo and redo included,
with the records that differ from the plan before it.

#### Parameters

##### project

`Project`

##### schedule

`Schedule`

##### changes

readonly `ProjectChange`[]

#### Returns

`void`

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`onChange`](GanttProviderProps.md#onchange)

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:153](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L153)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showCriticalPath`](GanttProviderProps.md#showcriticalpath)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:154](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L154)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showLinks`](GanttProviderProps.md#showlinks)

***

### showMarkers?

> `optional` **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:155](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L155)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showMarkers`](GanttProviderProps.md#showmarkers)

***

### trailing?

> `optional` **trailing**: `ReactNode`

Defined in: [components/gantt-toolbar.tsx:71](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L71)

Extra controls at the end of the bar.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`trailing`](GanttToolbarProps.md#trailing)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:157](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L157)

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

Defined in: [components/gantt-toolbar.tsx:69](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L69)

Shows the commands that read and write a Microsoft Project XML file.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`xmlExchange`](GanttToolbarProps.md#xmlexchange)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store-types.ts:152](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L152)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`zoom`](GanttProviderProps.md#zoom)
