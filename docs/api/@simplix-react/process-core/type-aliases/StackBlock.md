[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / StackBlock

# Type Alias: StackBlock

> **StackBlock** = \{ `kind`: `"section"`; `sectionId`: [`Id`](Id.md); \} \| \{ `key`: `string`; `kind`: `"group-start"`; \} \| \{ `key`: `string`; `kind`: `"group-end"`; \} \| \{ `acts`: [`StackAct`](../interfaces/StackAct.md)[]; `inclusion`: [`Inclusion`](Inclusion.md); `jumps`: [`StackJump`](../interfaces/StackJump.md)[]; `kind`: `"step"`; `number`: `number`; `stepId`: [`Id`](Id.md); \}

Defined in: [packages/process-core/src/stack-geometry.ts:20](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/stack-geometry.ts#L20)

One block of the stacked list, top to bottom.
