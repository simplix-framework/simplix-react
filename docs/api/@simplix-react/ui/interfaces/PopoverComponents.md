[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / PopoverComponents

# Interface: PopoverComponents

Defined in: [packages/ui/src/provider/types.ts:101](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/types.ts#L101)

## Properties

### Anchor

> **Anchor**: `ComponentType`\<\{ `asChild?`: `boolean`; `children?`: `ReactNode`; \}\>

Defined in: [packages/ui/src/provider/types.ts:114](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/types.ts#L114)

Positions the popover against something other than its trigger. A field whose
box holds controls of its own (removable chips, a search input) cannot make
that box the trigger without nesting a control inside a control, so the box
anchors and a button inside it triggers.

***

### Content

> **Content**: `ComponentType`\<[`PopoverContentProps`](../type-aliases/PopoverContentProps.md)\>

Defined in: [packages/ui/src/provider/types.ts:115](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/types.ts#L115)

***

### Root

> **Root**: `ComponentType`\<\{ `children?`: `ReactNode`; `modal?`: `boolean`; `onOpenChange?`: (`open`) => `void`; `open?`: `boolean`; \}\>

Defined in: [packages/ui/src/provider/types.ts:106](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/types.ts#L106)

`modal` gives the popover its own focus scope and blocks the page behind it: what a popover
holding a text input needs inside a dialog, whose focus trap otherwise takes the input's focus.

***

### Trigger

> **Trigger**: `ComponentType`\<\{ `asChild?`: `boolean`; `children?`: `ReactNode`; \}\>

Defined in: [packages/ui/src/provider/types.ts:107](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/types.ts#L107)
