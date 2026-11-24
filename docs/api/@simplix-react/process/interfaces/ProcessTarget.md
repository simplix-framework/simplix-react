[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process](../README.md) / ProcessTarget

# Interface: ProcessTarget

Defined in: [types.ts:5](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L5)

What a reader picked: a step, an act or a jump, with the `ref` an act carries.

## Properties

### id

> **id**: `string`

Defined in: [types.ts:7](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L7)

***

### kind

> **kind**: `"jump"` \| `"step"` \| `"act"`

Defined in: [types.ts:6](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L6)

***

### ref?

> `optional` **ref**: `string`

Defined in: [types.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/types.ts#L9)

The act's own `ref`, where the target is an act that states one.
