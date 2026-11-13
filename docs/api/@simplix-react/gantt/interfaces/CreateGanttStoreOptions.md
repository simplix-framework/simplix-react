[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / CreateGanttStoreOptions

# Interface: CreateGanttStoreOptions

Defined in: [model/gantt-store.ts:143](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L143)

Options for [createGanttStore](../functions/createGanttStore.md).

## Extended by

- [`GanttProviderProps`](GanttProviderProps.md)

## Properties

### baselineNumber?

> `optional` **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store.ts:147](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L147)

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

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store.ts:145](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L145)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store.ts:146](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L146)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store.ts:148](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L148)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store.ts:144](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L144)
