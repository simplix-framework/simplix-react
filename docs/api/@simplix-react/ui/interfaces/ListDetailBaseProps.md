[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ListDetailBaseProps

# Interface: ListDetailBaseProps

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:120](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L120)

Common props shared by all width variants.

## Properties

### activePanel?

> `optional` **activePanel**: `"list"` \| `"detail"`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:124](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L124)

Controlled active panel. When provided, overrides internal state.

***

### children

> **children**: `ReactNode`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:154](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L154)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:153](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L153)

***

### dialogHeight?

> `optional` **dialogHeight**: `string`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:128](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L128)

Fixed dialog height (e.g. `"60vh"`, `"500px"`). When set, the dialog uses a fixed height with internal scrolling. When omitted, the height fits the content up to the window less a margin (`100dvh - 2rem`), the ceiling of the shared dialog frame. Only applies to `"dialog"` variant.

***

### maxDetailWidth?

> `optional` **maxDetailWidth**: `number`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:140](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L140)

The widest width (px) the reader can drag the detail to, in every variant. Without one the
room the variant leaves is the limit: the window less a margin for a drawer and a dialog, the
section less the list's minimum for a panel.

***

### minDetailWidth?

> `optional` **minDetailWidth**: `number`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:134](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L134)

The narrowest width (px) the reader can drag the detail to, in every variant. Defaults to 280.
A detail opened at a width below it is drawn at it, unless the window has no room for that
beside the list's minimum.

***

### minListWidth?

> `optional` **minListWidth**: `number`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:142](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L142)

The narrowest width (px) the list keeps beside a panel. Defaults to 280.

***

### onClose()?

> `optional` **onClose**: () => `void`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:126](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L126)

Called when the dialog is dismissed (only applies to `"dialog"` variant).

#### Returns

`void`

***

### onDetailWidthChange()?

> `optional` **onDetailWidthChange**: (`width`) => `void`

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:147](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L147)

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

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:152](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L152)

Called when the reader double-presses the handle. The detail returns to `detailWidth`, so a
product that remembers a chosen width forgets it here.

#### Returns

`void`

***

### variant?

> `optional` **variant**: [`ListDetailVariant`](../type-aliases/ListDetailVariant.md)

Defined in: [packages/ui/src/crud/patterns/list-detail.tsx:122](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/list-detail.tsx#L122)

Layout variant. `"panel"` renders side-by-side, `"dialog"` renders detail in a modal.
