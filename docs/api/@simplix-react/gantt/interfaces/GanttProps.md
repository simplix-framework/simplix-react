[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / GanttProps

# Interface: GanttProps

Defined in: [components/gantt.tsx:104](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L104)

Props for [Gantt](../functions/Gantt.md).

## Extends

- `Omit`\<[`GanttProviderProps`](GanttProviderProps.md), `"children"`\>.[`GanttShellProps`](GanttShellProps.md)

## Properties

### baselineNumber?

> `optional` **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:235](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L235)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`baselineNumber`](GanttProviderProps.md#baselinenumber)

***

### className?

> `optional` **className**: `string`

Defined in: [components/gantt.tsx:27](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L27)

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`className`](GanttShellProps.md#classname)

***

### columns?

> `optional` **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:237](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L237)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`columns`](GanttProviderProps.md#columns)

***

### defaultGridWidth?

> `optional` **defaultGridWidth**: `number`

Defined in: [components/gantt-chart.tsx:41](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L41)

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

Defined in: [components/gantt.tsx:29](https://github.com/simplix-react/simplix-react/blob/main/components/gantt.tsx#L29)

Replaces the built-in message of a plan without tasks.

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`emptyState`](GanttShellProps.md#emptystate)

***

### layout?

> `optional` **layout**: `Partial`\<[`GanttLayout`](GanttLayout.md)\>

Defined in: [model/gantt-store-types.ts:241](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L241)

A stored layout to open with. It overrides the single options it names.

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`layout`](GanttProviderProps.md#layout)

***

### levelingOptions?

> `optional` **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:238](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L238)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`levelingOptions`](GanttProviderProps.md#levelingoptions)

***

### onChange()?

> `optional` **onChange**: (`project`, `schedule`, `changes`) => `void`

Defined in: [model/gantt-store-types.ts:248](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L248)

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

Defined in: [model/gantt-store-types.ts:243](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L243)

Called when the layout changes, with the whole layout to store.

#### Parameters

##### layout

[`GanttLayout`](GanttLayout.md)

#### Returns

`void`

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`onLayoutChange`](GanttProviderProps.md#onlayoutchange)

***

### planFiles?

> `optional` **planFiles**: `boolean`

Defined in: [components/gantt-toolbar.tsx:40](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L40)

Shows the commands that save the plan to a file of its own form and open one.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`planFiles`](GanttToolbarProps.md#planfiles)

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [model/gantt-store-types.ts:239](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L239)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`readOnly`](GanttProviderProps.md#readonly)

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:232](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L232)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showCriticalPath`](GanttProviderProps.md#showcriticalpath)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:233](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L233)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showLinks`](GanttProviderProps.md#showlinks)

***

### showMarkers?

> `optional` **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:234](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L234)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`showMarkers`](GanttProviderProps.md#showmarkers)

***

### trailing?

> `optional` **trailing**: `ReactNode`

Defined in: [components/gantt-toolbar.tsx:42](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L42)

Extra controls at the end of the bar.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`trailing`](GanttToolbarProps.md#trailing)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:236](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L236)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`view`](GanttProviderProps.md#view)

***

### weekStartsOn?

> `optional` **weekStartsOn**: `number`

Defined in: [components/gantt-chart.tsx:43](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-chart.tsx#L43)

First day of a week column: 0 is Sunday.

#### Inherited from

[`GanttShellProps`](GanttShellProps.md).[`weekStartsOn`](GanttShellProps.md#weekstartson)

***

### xmlExchange?

> `optional` **xmlExchange**: `boolean`

Defined in: [components/gantt-toolbar.tsx:38](https://github.com/simplix-react/simplix-react/blob/main/components/gantt-toolbar.tsx#L38)

Shows the commands that read and write a Microsoft Project XML file.

#### Inherited from

[`GanttToolbarProps`](GanttToolbarProps.md).[`xmlExchange`](GanttToolbarProps.md#xmlexchange)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store-types.ts:231](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L231)

#### Inherited from

[`GanttProviderProps`](GanttProviderProps.md).[`zoom`](GanttProviderProps.md#zoom)
