[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / CreateGanttStoreOptions

# Interface: CreateGanttStoreOptions

Defined in: [model/gantt-store-types.ts:151](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L151)

Options for `createGanttStore`.

## Extended by

- [`GanttProviderProps`](GanttProviderProps.md)

## Properties

### baselineNumber?

> `optional` **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:156](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L156)

***

### columns?

> `optional` **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:158](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L158)

***

### levelingOptions?

> `optional` **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:159](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L159)

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

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:153](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L153)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:154](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L154)

***

### showMarkers?

> `optional` **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:155](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L155)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:157](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L157)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store-types.ts:152](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L152)
