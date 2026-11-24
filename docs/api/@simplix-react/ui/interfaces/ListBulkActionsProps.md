[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ListBulkActionsProps

# Interface: ListBulkActionsProps

Defined in: [packages/ui/src/crud/list/crud-list.tsx:2127](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L2127)

Props for the List.BulkActions bar shown when rows are selected.

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:2135](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L2135)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:2134](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L2134)

***

### clearLabel?

> `optional` **clearLabel**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:2133](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L2133)

Label for the clear button. Defaults to `"Clear"`.

***

### onClear()?

> `optional` **onClear**: () => `void`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:2129](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L2129)

#### Returns

`void`

***

### selectedCount

> **selectedCount**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:2128](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L2128)

***

### selectedLabel()?

> `optional` **selectedLabel**: (`count`) => `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:2131](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L2131)

Format the selected count label. Defaults to `` `${count} selected` ``.

#### Parameters

##### count

`number`

#### Returns

`string`
