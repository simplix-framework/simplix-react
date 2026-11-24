[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / ReadingItem

# Type Alias: ReadingItem

> **ReadingItem** = \{ `kind`: `"section"`; `sectionId`: [`Id`](Id.md); \} \| \{ `key`: `string`; `kind`: `"group-start"`; \} \| \{ `key`: `string`; `kind`: `"group-end"`; \} \| \{ `inclusion`: [`Inclusion`](Inclusion.md); `kind`: `"step"`; `stepId`: [`Id`](Id.md); \} \| \{ `actId`: [`Id`](Id.md); `kind`: `"act"`; `stepId`: [`Id`](Id.md); \} \| \{ `jumpId`: [`Id`](Id.md); `kind`: `"jump"`; `stepId`: [`Id`](Id.md); \}

Defined in: [packages/process-core/src/reading-order.ts:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/reading-order.ts#L11)

One entry of a procedure read from its first step to its last.

A step is followed by its acts and then by the jumps that leave it. Where the reading folds what
the case leaves out, an excluded step is listed with no acts and no jumps. A run of steps sharing a parallel key stands between a `group-start`
and a `group-end`.
