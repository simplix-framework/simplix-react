[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudListColumnContextValue

# Interface: CrudListColumnContextValue

Defined in: [packages/ui/src/crud/shared/column-context.tsx:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L12)

## Properties

### canGridView

> **canGridView**: `boolean`

Defined in: [packages/ui/src/crud/shared/column-context.tsx:27](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L27)

True when the table declares grid as a selectable view (Table `gridView` + card slots).

***

### columns

> **columns**: [`ColumnInfo`](ColumnInfo.md)[]

Defined in: [packages/ui/src/crud/shared/column-context.tsx:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L13)

***

### hiddenColumns

> **hiddenColumns**: `Set`\<`string`\>

Defined in: [packages/ui/src/crud/shared/column-context.tsx:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L15)

***

### isCardMode

> **isCardMode**: `boolean`

Defined in: [packages/ui/src/crud/shared/column-context.tsx:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L21)

Effective card-mode mirror (responsive OR manual grid) — used to hide the column toggle.

***

### responsiveCardMode

> **responsiveCardMode**: `boolean`

Defined in: [packages/ui/src/crud/shared/column-context.tsx:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L30)

True when width < cardBreakpoint forces cards — used to hide the view toggle.

***

### setCanGridView

> **setCanGridView**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [packages/ui/src/crud/shared/column-context.tsx:28](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L28)

***

### setColumns

> **setColumns**: `Dispatch`\<`SetStateAction`\<[`ColumnInfo`](ColumnInfo.md)[]\>\>

Defined in: [packages/ui/src/crud/shared/column-context.tsx:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L14)

***

### setHiddenColumns

> **setHiddenColumns**: `Dispatch`\<`SetStateAction`\<`Set`\<`string`\>\>\>

Defined in: [packages/ui/src/crud/shared/column-context.tsx:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L16)

***

### setIsCardMode

> **setIsCardMode**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [packages/ui/src/crud/shared/column-context.tsx:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L22)

***

### setResponsiveCardMode

> **setResponsiveCardMode**: `Dispatch`\<`SetStateAction`\<`boolean`\>\>

Defined in: [packages/ui/src/crud/shared/column-context.tsx:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L31)

***

### setShownColumns

> **setShownColumns**: `Dispatch`\<`SetStateAction`\<`Set`\<`string`\>\>\>

Defined in: [packages/ui/src/crud/shared/column-context.tsx:19](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L19)

***

### setViewMode

> **setViewMode**: `Dispatch`\<`SetStateAction`\<[`CrudListViewMode`](../type-aliases/CrudListViewMode.md)\>\>

Defined in: [packages/ui/src/crud/shared/column-context.tsx:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L25)

***

### shownColumns

> **shownColumns**: `Set`\<`string`\>

Defined in: [packages/ui/src/crud/shared/column-context.tsx:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L18)

Columns the reader switched on that the list's width would have dropped; they are drawn anyway.

***

### viewMode

> **viewMode**: [`CrudListViewMode`](../type-aliases/CrudListViewMode.md)

Defined in: [packages/ui/src/crud/shared/column-context.tsx:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/column-context.tsx#L24)

User-selected view. Drives manual grid rendering when the table opts into `gridView`.
