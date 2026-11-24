[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / TreeTableProps

# Interface: TreeTableProps\<T\>

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:337](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L337)

## Type Parameters

### T

`T`

## Properties

### actions?

> `optional` **actions**: [`RowActionDef`](RowActionDef.md)\<`T`\>[]

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:345](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L345)

***

### actionVariant?

> `optional` **actionVariant**: [`ActionVariant`](../type-aliases/ActionVariant.md)

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:346](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L346)

***

### activeRowId?

> `optional` **activeRowId**: `string` \| `null`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:344](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L344)

***

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:363](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L363)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:362](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L362)

***

### data

> **data**: `T`[]

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:338](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L338)

***

### density?

> `optional` **density**: `"default"` \| `"compact"` \| `"comfortable"`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:353](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L353)

***

### headerActions?

> `optional` **headerActions**: `ReactNode`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:347](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L347)

***

### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:339](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L339)

***

### onRowClick()?

> `optional` **onRowClick**: (`row`) => `void`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:343](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L343)

#### Parameters

##### row

`T`

#### Returns

`void`

***

### onSortChange()?

> `optional` **onSortChange**: (`sort`) => `void`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:342](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L342)

#### Parameters

##### sort

[`SortState`](SortState.md)

#### Returns

`void`

***

### rounded?

> `optional` **rounded**: `"none"` \| `"sm"` \| `"lg"` \| `"md"`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:354](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L354)

***

### searchFields?

> `optional` **searchFields**: keyof `T` & `string`[]

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:348](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L348)

***

### searchPredicate()?

> `optional` **searchPredicate**: (`row`, `query`) => `boolean`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:350](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L350)

Callback-based search predicate. OR-combined with searchFields.

#### Parameters

##### row

`T`

##### query

`string`

#### Returns

`boolean`

***

### size?

> `optional` **size**: `"sm"` \| `"lg"` \| `"md"`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:352](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L352)

***

### sort?

> `optional` **sort**: [`SortState`](SortState.md) \| `null`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:341](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L341)

***

### stickyHeader?

> `optional` **stickyHeader**: `boolean`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:361](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L361)

Sticks the header row to the top of the nearest scrollable ancestor
(e.g. a page, dialog, or detail-pane body) once scrolling would hide it.
The table keeps its own horizontal scrollbar; the floating header scrolls
with its columns. Enabled by default; pass `false` to disable.

***

### tree?

> `optional` **tree**: [`TreeConfig`](TreeConfig.md)\<`T`\>

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:340](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L340)

***

### variant?

> `optional` **variant**: `"default"` \| `"bordered"` \| `"striped"`

Defined in: [packages/ui/src/crud/tree/crud-tree.tsx:351](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/tree/crud-tree.tsx#L351)
