[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / Step

# Interface: Step

Defined in: [packages/process-core/src/types.ts:42](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L42)

One step of the procedure: an ordered run of acts.

## Properties

### acts

> **acts**: [`Act`](Act.md)[]

Defined in: [packages/process-core/src/types.ts:46](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L46)

In the order they are performed.

***

### condition?

> `optional` **condition**: [`Condition`](../type-aliases/Condition.md)

Defined in: [packages/process-core/src/types.ts:47](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L47)

***

### conditionLabel?

> `optional` **conditionLabel**: `string`

Defined in: [packages/process-core/src/types.ts:49](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L49)

The condition in the reader's words, shown where the step is left out or conditional.

***

### id

> **id**: `string`

Defined in: [packages/process-core/src/types.ts:43](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L43)

***

### label

> **label**: `string`

Defined in: [packages/process-core/src/types.ts:44](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L44)

***

### note?

> `optional` **note**: `string`

Defined in: [packages/process-core/src/types.ts:56](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L56)

***

### parallel?

> `optional` **parallel**: `string`

Defined in: [packages/process-core/src/types.ts:51](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L51)

Neighbouring steps that share this key proceed together; the step after them waits for all of them.

***

### repeat?

> `optional` **repeat**: `object`

Defined in: [packages/process-core/src/types.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L53)

The step is performed again and again until the step named here is performed.

#### endedBy

> **endedBy**: `string`

***

### rework?

> `optional` **rework**: `object`

Defined in: [packages/process-core/src/types.ts:55](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L55)

The last act may send the step back to its first act; the label says on what ground.

#### label

> **label**: `string`
