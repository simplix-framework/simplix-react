[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / UseFadeTransitionOptions

# Interface: UseFadeTransitionOptions

Defined in: [packages/ui/src/crud/patterns/use-fade-transition.ts:7](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-fade-transition.ts#L7)

Options for [useFadeTransition](../functions/useFadeTransition.md).

## Properties

### active

> **active**: `boolean`

Defined in: [packages/ui/src/crud/patterns/use-fade-transition.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-fade-transition.ts#L9)

Whether the detail panel is currently showing (e.g. `view === "detail"`).

***

### duration?

> `optional` **duration**: `number`

Defined in: [packages/ui/src/crud/patterns/use-fade-transition.ts:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-fade-transition.ts#L16)

Fade duration in milliseconds. When omitted the fade runs on the `--dur-base` motion token
(and `--ease`), so a design's timing and reduced motion apply.

***

### targetId

> **targetId**: `string` \| `null`

Defined in: [packages/ui/src/crud/patterns/use-fade-transition.ts:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-fade-transition.ts#L11)

The id of the item to display.
