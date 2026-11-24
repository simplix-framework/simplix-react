[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / EditOperation

# Type Alias: EditOperation

> **EditOperation** = \{ `name`: `string`; `type`: `"rename"`; \} \| \{ `at?`: `number`; `lane`: [`Lane`](../interfaces/Lane.md); `type`: `"add-lane"`; \} \| \{ `id`: [`Id`](Id.md); `patch`: [`Patch`](Patch.md)\<`Omit`\<[`Lane`](../interfaces/Lane.md), `"id"`\>\>; `type`: `"update-lane"`; \} \| \{ `id`: [`Id`](Id.md); `to`: `number`; `type`: `"move-lane"`; \} \| \{ `id`: [`Id`](Id.md); `type`: `"remove-lane"`; \} \| \{ `at?`: `number`; `section`: `Omit`\<[`Section`](../interfaces/Section.md), `"steps"`\> & `object`; `type`: `"add-section"`; \} \| \{ `id`: [`Id`](Id.md); `patch`: [`Patch`](Patch.md)\<`Omit`\<[`Section`](../interfaces/Section.md), `"id"` \| `"steps"`\>\>; `type`: `"update-section"`; \} \| \{ `id`: [`Id`](Id.md); `to`: `number`; `type`: `"move-section"`; \} \| \{ `id`: [`Id`](Id.md); `type`: `"remove-section"`; \} \| \{ `at?`: `number`; `section`: [`Id`](Id.md); `step`: [`Step`](../interfaces/Step.md); `type`: `"add-step"`; \} \| \{ `id`: [`Id`](Id.md); `patch`: [`Patch`](Patch.md)\<`Omit`\<[`Step`](../interfaces/Step.md), `"id"` \| `"acts"` \| `"parallel"`\>\>; `type`: `"update-step"`; \} \| \{ `id`: [`Id`](Id.md); `section`: [`Id`](Id.md); `to`: `number`; `type`: `"move-step"`; \} \| \{ `id`: [`Id`](Id.md); `type`: `"remove-step"`; \} \| \{ `key?`: `string`; `steps`: [`Id`](Id.md)[]; `type`: `"set-parallel"`; \} \| \{ `act`: [`Act`](../interfaces/Act.md); `at?`: `number`; `step`: [`Id`](Id.md); `type`: `"add-act"`; \} \| \{ `id`: [`Id`](Id.md); `patch`: [`Patch`](Patch.md)\<`Omit`\<[`Act`](../interfaces/Act.md), `"id"`\>\>; `type`: `"update-act"`; \} \| \{ `id`: [`Id`](Id.md); `to`: `number`; `type`: `"move-act"`; \} \| \{ `id`: [`Id`](Id.md); `type`: `"remove-act"`; \} \| \{ `at?`: `number`; `jump`: [`Jump`](../interfaces/Jump.md); `type`: `"add-jump"`; \} \| \{ `id`: [`Id`](Id.md); `patch`: [`Patch`](Patch.md)\<`Omit`\<[`Jump`](../interfaces/Jump.md), `"id"`\>\>; `type`: `"update-jump"`; \} \| \{ `id`: [`Id`](Id.md); `type`: `"remove-jump"`; \}

Defined in: [packages/process-core/src/edit.ts:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/edit.ts#L14)

One change to a definition. Ids are given by the caller and never change afterwards.
