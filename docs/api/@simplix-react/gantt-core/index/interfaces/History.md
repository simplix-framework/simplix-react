[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / History

# Interface: History\<T\>

Defined in: [packages/gantt-core/src/history.ts:5](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/history.ts#L5)

An undo and redo stack over immutable values. Every state is kept whole, so
values that share unchanged parts cost little.

## Type Parameters

### T

`T`

## Properties

### future

> `readonly` **future**: readonly [`HistoryEntry`](HistoryEntry.md)\<`T`\>[]

Defined in: [packages/gantt-core/src/history.ts:8](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/history.ts#L8)

***

### limit

> `readonly` **limit**: `number`

Defined in: [packages/gantt-core/src/history.ts:10](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/history.ts#L10)

States kept for undo before the oldest is dropped.

***

### past

> `readonly` **past**: readonly [`HistoryEntry`](HistoryEntry.md)\<`T`\>[]

Defined in: [packages/gantt-core/src/history.ts:6](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/history.ts#L6)

***

### present

> `readonly` **present**: `T`

Defined in: [packages/gantt-core/src/history.ts:7](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/history.ts#L7)
