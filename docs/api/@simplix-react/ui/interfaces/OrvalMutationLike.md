[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / OrvalMutationLike

# Interface: OrvalMutationLike

Defined in: [packages/headless/dist/index.d.ts:318](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L318)

Loose mutation shape that accepts any Orval-generated hook result.
Orval hooks return concretely typed `mutate` signatures (e.g. `{ petId: number }`)
that are incompatible with generic `Record<string, unknown>` due to contravariance.
We use `any` at this adapter boundary intentionally.

## Properties

### isPending

> **isPending**: `boolean`

Defined in: [packages/headless/dist/index.d.ts:321](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L321)

***

### mutate()

> **mutate**: (...`args`) => `void`

Defined in: [packages/headless/dist/index.d.ts:319](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L319)

#### Parameters

##### args

...`any`[]

#### Returns

`void`

***

### mutateAsync()

> **mutateAsync**: (...`args`) => `Promise`\<`any`\>

Defined in: [packages/headless/dist/index.d.ts:320](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L320)

#### Parameters

##### args

...`any`[]

#### Returns

`Promise`\<`any`\>
