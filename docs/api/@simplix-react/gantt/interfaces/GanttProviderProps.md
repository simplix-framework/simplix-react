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

Defined in: [model/gantt-store-types.ts:215](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L215)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`baselineNumber`](CreateGanttStoreOptions.md#baselinenumber)

***

### children

> **children**: `ReactNode`

Defined in: [context/gantt-context.tsx:15](https://github.com/simplix-react/simplix-react/blob/main/context/gantt-context.tsx#L15)

***

### columns?

> `optional` **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:217](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L217)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`columns`](CreateGanttStoreOptions.md#columns)

***

### defaultProject

> **defaultProject**: `Project`

Defined in: [context/gantt-context.tsx:14](https://github.com/simplix-react/simplix-react/blob/main/context/gantt-context.tsx#L14)

The plan the chart opens with. Later changes are made through the store.

***

### layout?

> `optional` **layout**: `Partial`\<[`GanttLayout`](GanttLayout.md)\>

Defined in: [model/gantt-store-types.ts:221](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L221)

A stored layout to open with. It overrides the single options it names.

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`layout`](CreateGanttStoreOptions.md#layout)

***

### levelingOptions?

> `optional` **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:218](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L218)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`levelingOptions`](CreateGanttStoreOptions.md#levelingoptions)

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

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`onChange`](CreateGanttStoreOptions.md#onchange)

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

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`onLayoutChange`](CreateGanttStoreOptions.md#onlayoutchange)

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [model/gantt-store-types.ts:219](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L219)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`readOnly`](CreateGanttStoreOptions.md#readonly)

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:212](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L212)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`showCriticalPath`](CreateGanttStoreOptions.md#showcriticalpath)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:213](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L213)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`showLinks`](CreateGanttStoreOptions.md#showlinks)

***

### showMarkers?

> `optional` **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:214](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L214)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`showMarkers`](CreateGanttStoreOptions.md#showmarkers)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:216](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L216)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`view`](CreateGanttStoreOptions.md#view)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store-types.ts:211](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L211)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`zoom`](CreateGanttStoreOptions.md#zoom)
