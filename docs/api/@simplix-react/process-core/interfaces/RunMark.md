[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / RunMark

# Interface: RunMark

Defined in: [packages/process-core/src/types.ts:106](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L106)

How one step or act of a running case stands, and who holds it.

## Properties

### assignee?

> `optional` **assignee**: `string`

Defined in: [packages/process-core/src/types.ts:109](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L109)

Who it is waiting on or who did it, in the reader's words.

***

### count?

> `optional` **count**: `number`

Defined in: [packages/process-core/src/types.ts:111](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L111)

How many times a repeating step has been recorded.

***

### status

> **status**: [`RunStatus`](../type-aliases/RunStatus.md)

Defined in: [packages/process-core/src/types.ts:107](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L107)
