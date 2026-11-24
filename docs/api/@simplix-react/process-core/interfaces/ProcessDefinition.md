[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / ProcessDefinition

# Interface: ProcessDefinition

Defined in: [packages/process-core/src/types.ts:89](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L89)

A procedure. Its steps have one order: the sections as listed, and inside each the steps as
listed. Everything that departs from that order is a parallel key, a condition, a repeat or a jump.

## Properties

### format

> **format**: `"simplix-process"`

Defined in: [packages/process-core/src/types.ts:90](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L90)

***

### id

> **id**: `string`

Defined in: [packages/process-core/src/types.ts:92](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L92)

***

### jumps

> **jumps**: [`Jump`](Jump.md)[]

Defined in: [packages/process-core/src/types.ts:96](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L96)

***

### lanes

> **lanes**: [`Lane`](Lane.md)[]

Defined in: [packages/process-core/src/types.ts:94](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L94)

***

### name

> **name**: `string`

Defined in: [packages/process-core/src/types.ts:93](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L93)

***

### sections

> **sections**: [`Section`](Section.md)[]

Defined in: [packages/process-core/src/types.ts:95](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L95)

***

### version

> **version**: `number`

Defined in: [packages/process-core/src/types.ts:91](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L91)
