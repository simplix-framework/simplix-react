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

Defined in: [model/gantt-store.ts:147](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L147)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`baselineNumber`](CreateGanttStoreOptions.md#baselinenumber)

***

### children

> **children**: `ReactNode`

Defined in: [context/gantt-context.tsx:15](https://github.com/simplix-react/simplix-react/blob/main/context/gantt-context.tsx#L15)

***

### defaultProject

> **defaultProject**: `Project`

Defined in: [context/gantt-context.tsx:14](https://github.com/simplix-react/simplix-react/blob/main/context/gantt-context.tsx#L14)

The plan the chart opens with. Later changes are made through the store.

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

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`onChange`](CreateGanttStoreOptions.md#onchange)

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [model/gantt-store.ts:145](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L145)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`showCriticalPath`](CreateGanttStoreOptions.md#showcriticalpath)

***

### showLinks?

> `optional` **showLinks**: `boolean`

Defined in: [model/gantt-store.ts:146](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L146)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`showLinks`](CreateGanttStoreOptions.md#showlinks)

***

### view?

> `optional` **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store.ts:148](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L148)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`view`](CreateGanttStoreOptions.md#view)

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [model/gantt-store.ts:144](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L144)

#### Inherited from

[`CreateGanttStoreOptions`](CreateGanttStoreOptions.md).[`zoom`](CreateGanttStoreOptions.md#zoom)
