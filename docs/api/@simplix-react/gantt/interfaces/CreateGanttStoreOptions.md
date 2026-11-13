[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / CreateGanttStoreOptions

# Interface: CreateGanttStoreOptions

Defined in: [model/gantt-store-types.ts:210](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L210)

Options for `createGanttStore`.

## Extended by

- [`GanttProviderProps`](GanttProviderProps.md)

## Properties

### baselineNumber?

> `optional` **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:215](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L215)

***

### columns?

> `optional` **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:217](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L217)

***

### layout?

> `optional` **layout**: `Partial`\<[`GanttLayout`](GanttLayout.md)\>

Defined in: [model/gantt-store-types.ts:221](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L221)

A stored layout to open with. It overrides the single options it names.

***

### levelingOptions?

> `optional` **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:218](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L218)

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

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [model/gantt-store-types.ts:219](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L219)

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:212](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L212)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:213](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L213)

***

### showMarkers?

> `optional` **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:214](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L214)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:216](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L216)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store-types.ts:211](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L211)
