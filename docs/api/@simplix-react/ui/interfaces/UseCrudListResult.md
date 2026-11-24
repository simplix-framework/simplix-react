[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / UseCrudListResult

# Interface: UseCrudListResult\<T\>

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:112](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L112)

Complete state returned by [useCrudList](../functions/useCrudList.md).

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`[]

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:113](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L113)

***

### emptyReason

> **emptyReason**: [`EmptyReason`](../type-aliases/EmptyReason.md) \| `null`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:131](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L131)

***

### error

> **error**: `Error` \| `null`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:115](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L115)

***

### failureCount

> **failureCount**: `number`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:126](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L126)

Consecutive failed fetch attempts on the underlying query. Greater than `0`
with `error === null` means a retry is pending.

***

### filters

> **filters**: [`CrudListFilters`](CrudListFilters.md)

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:127](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L127)

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:114](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L114)

***

### isPaused

> **isPaused**: `boolean`

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:121](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L121)

Whether the underlying query is in flight but stalled (React Query
`fetchStatus === "paused"`). Such a query reports `isLoading: false` and
`error: null`; consult this before treating an empty `data` as "no data".

***

### pagination

> **pagination**: [`CrudListPagination`](CrudListPagination.md)

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:129](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L129)

***

### selection

> **selection**: [`CrudListSelection`](CrudListSelection.md)\<`T`\>

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:130](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L130)

***

### sort

> **sort**: [`CrudListSort`](CrudListSort.md)

Defined in: [packages/ui/src/crud/list/use-crud-list.ts:128](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/use-crud-list.ts#L128)
