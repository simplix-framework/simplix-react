[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / commitEdit

# Function: commitEdit()

> **commitEdit**\<`T`\>(`history`, `next`, `label?`): [`EditHistory`](../interfaces/EditHistory.md)\<`T`\>

Defined in: [packages/process-core/src/history.ts:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/history.ts#L22)

Records `next` as the present. The same value is not recorded, and what was undone can no longer be redone.

## Type Parameters

### T

`T`

## Parameters

### history

[`EditHistory`](../interfaces/EditHistory.md)\<`T`\>

### next

`T`

### label?

`string` = `""`

## Returns

[`EditHistory`](../interfaces/EditHistory.md)\<`T`\>
