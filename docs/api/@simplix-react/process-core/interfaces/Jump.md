[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / Jump

# Interface: Jump

Defined in: [packages/process-core/src/types.ts:70](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L70)

A move out of the stated order: back to an earlier step, ahead to a later one, or out to
another procedure. Exactly one of `to` and `external` is set.

## Properties

### external?

> `optional` **external**: `string`

Defined in: [packages/process-core/src/types.ts:76](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L76)

The name of the procedure it leaves for.

***

### from

> **from**: `string`

Defined in: [packages/process-core/src/types.ts:72](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L72)

***

### id

> **id**: `string`

Defined in: [packages/process-core/src/types.ts:71](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L71)

***

### label

> **label**: `string`

Defined in: [packages/process-core/src/types.ts:77](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L77)

***

### to?

> `optional` **to**: `string`

Defined in: [packages/process-core/src/types.ts:74](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L74)

The step it arrives at.
