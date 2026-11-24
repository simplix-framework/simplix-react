[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / EmptyStateProps

# Interface: EmptyStateProps

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L14)

## Properties

### action?

> `optional` **action**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L18)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:44](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L44)

***

### description?

> `optional` **description**: `string`

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:17](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L17)

***

### footer?

> `optional` **footer**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:43](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L43)

A quiet line under the actions — a status number, a correlation id, whatever support reads and
the operator does not act on.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L15)

***

### iconAttributes?

> `optional` **iconAttributes**: `Readonly`\<`Record`\<`string`, `string`\>\>

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:38](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L38)

Attributes for the icon's badge beside [iconClassName](#iconclassname), such as the `data-part` marks a
caller's design declaration draws the tint with (`partAttributes`).

***

### iconClassName?

> `optional` **iconClassName**: `string`

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L33)

The tint the icon's badge is painted with, where the KIND of state has a colour.

<p>A caller wanting one used to wrap the icon in a badge of its own, which landed inside the
badge this already draws — two nested circles, the inner one an inline element that a
`rounded-full` stretches into an oval. The tint belongs to the badge that exists rather than
to a second one.

***

### size?

> `optional` **size**: `"default"` \| `"sm"`

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L24)

Vertical weight. `"default"` fills an empty page or table body; `"sm"` is for
a panel section, where a full-height placeholder pushes the real content
off-screen for a state that carries no information.

***

### title

> **title**: `string`

Defined in: [packages/ui/src/crud/shared/empty-state.tsx:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/empty-state.tsx#L16)
