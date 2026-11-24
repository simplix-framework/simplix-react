[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [index](../README.md) / CreateGanttStoreOptions

# Interface: CreateGanttStoreOptions

Defined in: [model/gantt-store-types.ts:232](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L232)

Options for `createGanttStore`.

## Extended by

- [`GanttProviderProps`](GanttProviderProps.md)

## Properties

### baselineNumber?

> `optional` **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:237](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L237)

***

### columns?

> `optional` **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:239](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L239)

***

### layout?

> `optional` **layout**: `Partial`\<[`GanttLayout`](GanttLayout.md)\>

Defined in: [model/gantt-store-types.ts:243](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L243)

A stored layout to open with. It overrides the single options it names.

***

### levelingOptions?

> `optional` **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:240](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L240)

***

### onChange()?

> `optional` **onChange**: (`project`, `schedule`, `changes`) => `void`

Defined in: [model/gantt-store-types.ts:250](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L250)

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

***

### onLayoutChange()?

> `optional` **onLayoutChange**: (`layout`) => `void`

Defined in: [model/gantt-store-types.ts:245](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L245)

Called when the layout changes, with the whole layout to store.

#### Parameters

##### layout

[`GanttLayout`](GanttLayout.md)

#### Returns

`void`

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [model/gantt-store-types.ts:241](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L241)

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:234](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L234)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:235](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L235)

***

### showMarkers?

> `optional` **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:236](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L236)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:238](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L238)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store-types.ts:233](https://github.com/simplix-framework/simplix-react/blob/main/model/gantt-store-types.ts#L233)
