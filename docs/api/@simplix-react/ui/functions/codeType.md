[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / codeType

# Function: codeType()

> **codeType**(`value`, `index`, `raw`, `length`): [`CodeEdit`](../interfaces/CodeEdit.md)

Defined in: [packages/ui/src/base/inputs/code-input-model.ts:59](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/code-input-model.ts#L59)

Applies digits typed into cell `index`.

## Parameters

### value

`string`

The digits typed so far.

### index

`number`

The cell typed into.

### raw

`string`

What was typed or autofilled.

### length

`number`

How many cells the code has.

## Returns

[`CodeEdit`](../interfaces/CodeEdit.md)

The next value and the cell to focus.

## Remarks

A run of digits (a one-time-code autofill into one cell) fills forward from that cell, and the
focus moves to the cell after the last one filled. Characters that are not digits are dropped.

## Example

```ts
import { codeType } from "@simplix-react/ui";

codeType("12", 2, "3", 6); // { value: "123", focus: 3 }
```
