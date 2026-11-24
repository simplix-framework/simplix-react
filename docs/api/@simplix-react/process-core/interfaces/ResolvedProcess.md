[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / ResolvedProcess

# Interface: ResolvedProcess

Defined in: [packages/process-core/src/types.ts:160](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L160)

A definition read for one case.

## Properties

### definition

> **definition**: [`ProcessDefinition`](ProcessDefinition.md)

Defined in: [packages/process-core/src/types.ts:161](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L161)

***

### jumps

> **jumps**: [`ResolvedJump`](ResolvedJump.md)[]

Defined in: [packages/process-core/src/types.ts:165](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L165)

***

### lanes

> **lanes**: [`Lane`](Lane.md)[]

Defined in: [packages/process-core/src/types.ts:164](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L164)

The lanes shown, in the definition's order: every lane an act stands in, or under `folded` only the lanes of acts that belong to the case.

***

### leftOut

> **leftOut**: [`LeftOut`](../type-aliases/LeftOut.md)

Defined in: [packages/process-core/src/types.ts:166](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L166)

***

### sections

> **sections**: `object`[]

Defined in: [packages/process-core/src/types.ts:162](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L162)

#### section

> **section**: [`Section`](Section.md)

#### steps

> **steps**: [`ResolvedStep`](ResolvedStep.md)[]
