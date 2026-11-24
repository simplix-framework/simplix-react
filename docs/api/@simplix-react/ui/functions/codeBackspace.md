[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / codeBackspace

# Function: codeBackspace()

> **codeBackspace**(`value`, `index`, `length`): [`CodeEdit`](../interfaces/CodeEdit.md)

Defined in: [packages/ui/src/base/inputs/code-input-model.ts:86](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/code-input-model.ts#L86)

Applies Backspace in cell `index`.

## Parameters

### value

`string`

The digits typed so far.

### index

`number`

The cell Backspace was pressed in.

### length

`number`

How many cells the code has.

## Returns

[`CodeEdit`](../interfaces/CodeEdit.md)

The next value and the cell to focus.

## Remarks

A filled cell loses its digit and the later digits close up; an empty cell moves the focus back
one and clears that cell.

## Example

```ts
import { codeBackspace } from "@simplix-react/ui";

codeBackspace("123", 3, 6); // { value: "12", focus: 2 }
```
