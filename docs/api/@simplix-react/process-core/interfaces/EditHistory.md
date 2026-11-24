[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / EditHistory

# Interface: EditHistory\<T\>

Defined in: [packages/process-core/src/history.ts:2](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/history.ts#L2)

The definitions an editing session went through: the ones before the present for undo, the ones after it for redo.

## Type Parameters

### T

`T`

## Properties

### future

> `readonly` **future**: readonly [`HistoryEntry`](HistoryEntry.md)\<`T`\>[]

Defined in: [packages/process-core/src/history.ts:5](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/history.ts#L5)

***

### limit

> `readonly` **limit**: `number`

Defined in: [packages/process-core/src/history.ts:7](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/history.ts#L7)

How many states undo can reach before the oldest is dropped.

***

### past

> `readonly` **past**: readonly [`HistoryEntry`](HistoryEntry.md)\<`T`\>[]

Defined in: [packages/process-core/src/history.ts:3](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/history.ts#L3)

***

### present

> `readonly` **present**: `T`

Defined in: [packages/process-core/src/history.ts:4](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/history.ts#L4)
