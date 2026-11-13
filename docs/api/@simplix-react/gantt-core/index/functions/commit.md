[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / commit

# Function: commit()

> **commit**\<`T`\>(`history`, `next`, `label?`): [`History`](../interfaces/History.md)\<`T`\>

Defined in: [packages/gantt-core/src/history.ts:28](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/history.ts#L28)

Records a change. The label names it for an undo menu. A change to the
identical value is not recorded, and anything undone is discarded.

## Type Parameters

### T

`T`

## Parameters

### history

[`History`](../interfaces/History.md)\<`T`\>

### next

`T`

### label?

`string` = `""`

## Returns

[`History`](../interfaces/History.md)\<`T`\>
