[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ListPaginationProps

# Interface: ListPaginationProps

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1960](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1960)

Props for the List.Pagination sub-component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1977](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1977)

***

### compactBreakpoint?

> `optional` **compactBreakpoint**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1976](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1976)

Breakpoint (px) below which the compact variant is used. Defaults to `640`.

***

### onPageChange()

> **onPageChange**: (`page`) => `void`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1970](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1970)

#### Parameters

##### page

`number`

#### Returns

`void`

***

### onPageSizeChange()?

> `optional` **onPageSizeChange**: (`size`) => `void`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1971](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1971)

#### Parameters

##### size

`number`

#### Returns

`void`

***

### page

> **page**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1961](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1961)

***

### pageSize

> **pageSize**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1962](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1962)

***

### pageSizeOptions?

> `optional` **pageSizeOptions**: `number`[]

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1972](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1972)

***

### rowsLabel?

> `optional` **rowsLabel**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1974](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1974)

Label for page-size selector. Defaults to `"Rows:"`.

***

### total

> **total**: `number` \| `null` \| `undefined`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1968](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1968)

The rows the list holds across every page, or `null` / `undefined` while that is not known: the
first page in flight, or a read that failed. An unknown total draws the range as unknown and
offers no next page, since `0-0 / 0` reads as an empty list.

***

### totalPages

> **totalPages**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:1969](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L1969)
