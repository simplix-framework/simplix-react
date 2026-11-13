[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / GanttProviderProps

# Interface: GanttProviderProps

Defined in: [context/gantt-context.tsx:12](https://github.com/simplix-react/simplix-react/blob/main/context/gantt-context.tsx#L12)

Props for [GanttProvider](../functions/GanttProvider.md).

## Extends

- [`CreateGanttStoreOptions`](CreateGanttStoreOptions.md)

## Properties

### baselineNumber?

> `optional` **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:156](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L156)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`baselineNumber`](CreateGanttStoreOptions.md#baselinenumber)

***

### children

> **children**: `ReactNode`

Defined in: [context/gantt-context.tsx:15](https://github.com/simplix-react/simplix-react/blob/main/context/gantt-context.tsx#L15)

***

### columns?

> `optional` **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:158](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L158)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`columns`](CreateGanttStoreOptions.md#columns)

***

### defaultProject

> **defaultProject**: `Project`

Defined in: [context/gantt-context.tsx:14](https://github.com/simplix-react/simplix-react/blob/main/context/gantt-context.tsx#L14)

The plan the chart opens with. Later changes are made through the store.

***

### levelingOptions?

> `optional` **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:159](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L159)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`levelingOptions`](CreateGanttStoreOptions.md#levelingoptions)

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

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`onChange`](CreateGanttStoreOptions.md#onchange)

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:153](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L153)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`showCriticalPath`](CreateGanttStoreOptions.md#showcriticalpath)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:154](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L154)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`showLinks`](CreateGanttStoreOptions.md#showlinks)

***

### showMarkers?

> `optional` **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:155](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L155)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`showMarkers`](CreateGanttStoreOptions.md#showmarkers)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:157](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L157)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`view`](CreateGanttStoreOptions.md#view)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store-types.ts:152](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L152)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`zoom`](CreateGanttStoreOptions.md#zoom)
