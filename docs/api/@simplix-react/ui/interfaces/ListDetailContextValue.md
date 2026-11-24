[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ListDetailContextValue

# Interface: ListDetailContextValue

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:45](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L45)

## Properties

### activePanel

> **activePanel**: `"list"` \| `"detail"`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:47](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L47)

***

### detailWidth?

> `optional` **detailWidth**: `number`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:51](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L51)

The detail's width in px, which the drawer and the dialog cap themselves at as the panel does.

***

### dialogHeight?

> `optional` **dialogHeight**: `string`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:49](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L49)

***

### resize?

> `optional` **resize**: `DetailResizeControl`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L53)

What the detail's resize handle reads and moves, in every variant.

***

### setActivePanel()

> **setActivePanel**: (`panel`) => `void`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L48)

#### Parameters

##### panel

`"list"` | `"detail"`

#### Returns

`void`

***

### variant

> **variant**: [`ListDetailVariant`](../type-aliases/ListDetailVariant.md)

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:46](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L46)
