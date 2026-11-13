[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / GanttProps

# Interface: GanttProps

Defined in: [components/gantt.tsx:93](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L93)

Props for [Gantt](../functions/Gantt.md).

## Extends

- `Omit`\<[`GanttProviderProps`](GanttProviderProps.md), `"children"`\>.[`GanttShellProps`](GanttShellProps.md)

## Properties

### baselineNumber?

> `optional` **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:215](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L215)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`baselineNumber`](GanttProviderProps.md#baselinenumber)

***

### className?

> `optional` **className**: `string`

Defined in: [components/gantt.tsx:24](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L24)

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`className`](GanttShellProps.md#classname)

***

### columns?

> `optional` **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:217](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L217)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`columns`](GanttProviderProps.md#columns)

***

### defaultGridWidth?

> `optional` **defaultGridWidth**: `number`

Defined in: [components/gantt-chart.tsx:52](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L52)

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

Defined in: [components/gantt.tsx:26](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L26)

Replaces the built-in message of a plan without tasks.

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`emptyState`](GanttShellProps.md#emptystate)

***

### layout?

> `optional` **layout**: `Partial`\<[`GanttLayout`](GanttLayout.md)\>

Defined in: [model/gantt-store-types.ts:221](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L221)

A stored layout to open with. It overrides the single options it names.

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`layout`](GanttProviderProps.md#layout)

***

### levelingOptions?

> `optional` **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:218](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L218)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`levelingOptions`](GanttProviderProps.md#levelingoptions)

***

### onChange()?

> `optional` **onChange**: (`project`, `schedule`, `changes`) => `void`

Defined in: [model/gantt-store-types.ts:228](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L228)

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

### onLayoutChange()?

> `optional` **onLayoutChange**: (`layout`) => `void`

Defined in: [model/gantt-store-types.ts:223](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L223)

Called when the layout changes, with the whole layout to store.

#### Parameters

##### layout

[`GanttLayout`](GanttLayout.md)

#### Returns

`void`

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`onLayoutChange`](GanttProviderProps.md#onlayoutchange)

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [model/gantt-store-types.ts:219](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L219)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`readOnly`](GanttProviderProps.md#readonly)

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:212](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L212)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showCriticalPath`](GanttProviderProps.md#showcriticalpath)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:213](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L213)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showLinks`](GanttProviderProps.md#showlinks)

***

### showMarkers?

> `optional` **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:214](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L214)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showMarkers`](GanttProviderProps.md#showmarkers)

***

### trailing?

> `optional` **trailing**: `ReactNode`

Defined in: [components/gantt-toolbar.tsx:79](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L79)

Extra controls at the end of the bar.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`trailing`](GanttToolbarProps.md#trailing)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:216](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L216)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`view`](GanttProviderProps.md#view)

***

### weekStartsOn?

> `optional` **weekStartsOn**: `number`

Defined in: [components/gantt-chart.tsx:54](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L54)

First day of a week column: 0 is Sunday.

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`weekStartsOn`](GanttShellProps.md#weekstartson)

***

### xmlExchange?

> `optional` **xmlExchange**: `boolean`

Defined in: [components/gantt-toolbar.tsx:77](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L77)

Shows the commands that read and write a Microsoft Project XML file.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`xmlExchange`](GanttToolbarProps.md#xmlexchange)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store-types.ts:211](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L211)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`zoom`](GanttProviderProps.md#zoom)
