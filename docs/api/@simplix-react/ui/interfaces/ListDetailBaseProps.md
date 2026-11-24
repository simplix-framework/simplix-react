[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ListDetailBaseProps

# Interface: ListDetailBaseProps

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:117](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L117)

Common props shared by all width variants.

## Properties

### activePanel?

> `optional` **activePanel**: `"list"` \| `"detail"`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:121](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L121)

Controlled active panel. When provided, overrides internal state.

***

### children

> **children**: `ReactNode`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:151](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L151)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:150](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L150)

***

### dialogHeight?

> `optional` **dialogHeight**: `string`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:125](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L125)

Fixed dialog height (e.g. `"60vh"`, `"500px"`). When set, the dialog uses a fixed height with internal scrolling. When omitted, the height fits the content up to the window less a margin (`100dvh - 2rem`), the ceiling of the shared dialog frame. Only applies to `"dialog"` variant.

***

### maxDetailWidth?

> `optional` **maxDetailWidth**: `number`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:137](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L137)

The widest width (px) the reader can drag the detail to, in every variant. Without one the
room the variant leaves is the limit: the window less a margin for a drawer and a dialog, the
section less the list's minimum for a panel.

***

### minDetailWidth?

> `optional` **minDetailWidth**: `number`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:131](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L131)

The narrowest width (px) the reader can drag the detail to, in every variant. Defaults to 280.
A detail opened at a width below it is drawn at it, unless the window has no room for that
beside the list's minimum.

***

### minListWidth?

> `optional` **minListWidth**: `number`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:139](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L139)

The narrowest width (px) the list keeps beside a panel. Defaults to 280.

***

### onClose()?

> `optional` **onClose**: () => `void`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:123](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L123)

Called when the dialog is dismissed (only applies to `"dialog"` variant).

#### Returns

`void`

***

### onDetailWidthChange()?

> `optional` **onDetailWidthChange**: (`width`) => `void`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:144](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L144)

Called with the width the reader chose once a drag ends, and after each key press on the
handle, so a product can remember it. The width is the detail's, in every variant.

#### Parameters

##### width

`number`

#### Returns

`void`

***

### onDetailWidthReset()?

> `optional` **onDetailWidthReset**: () => `void`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:149](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L149)

Called when the reader double-presses the handle. The detail returns to `detailWidth`, so a
product that remembers a chosen width forgets it here.

#### Returns

`void`

***

### variant?

> `optional` **variant**: [`ListDetailVariant`](../type-aliases/ListDetailVariant.md)

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:119](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L119)

Layout variant. `"panel"` renders side-by-side, `"dialog"` renders detail in a modal.
