[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / Act

# Interface: Act

Defined in: [packages/process-core/src/types.ts:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L25)

One thing one lane (or several lanes together) does inside a step.

## Properties

### condition?

> `optional` **condition**: [`Condition`](../type-aliases/Condition.md)

Defined in: [packages/process-core/src/types.ts:32](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L32)

***

### conditionLabel?

> `optional` **conditionLabel**: `string`

Defined in: [packages/process-core/src/types.ts:34](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L34)

The condition in the reader's words, shown where the act is left out or conditional.

***

### id

> **id**: `string`

Defined in: [packages/process-core/src/types.ts:26](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L26)

***

### kind

> **kind**: `"do"` \| `"check"`

Defined in: [packages/process-core/src/types.ts:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L30)

`do` performs the work, `check` confirms or approves what was done.

***

### label

> **label**: `string`

Defined in: [packages/process-core/src/types.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L31)

***

### lanes

> **lanes**: `string`[]

Defined in: [packages/process-core/src/types.ts:28](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L28)

The lanes that perform it. More than one means they perform it together; the first is where the flow enters and leaves.

***

### ref?

> `optional` **ref**: `string`

Defined in: [packages/process-core/src/types.ts:36](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L36)

Opaque to this package. Handed back when the act is selected.

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/process-core/src/types.ts:38](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L38)

Short marks drawn beside the label: what the act asks for (a signature, a measured value).
