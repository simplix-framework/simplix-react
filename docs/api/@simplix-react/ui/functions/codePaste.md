[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / codePaste

# Function: codePaste()

> **codePaste**(`raw`, `length`): [`CodeEdit`](../interfaces/CodeEdit.md) \| `null`

Defined in: [packages/ui/src/base/inputs/code-input-model.ts:107](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/code-input-model.ts#L107)

Applies pasted text: its digits replace the whole code, so a pasted full code fills every cell.

## Parameters

### raw

`string`

The pasted text.

### length

`number`

How many cells the code has.

## Returns

[`CodeEdit`](../interfaces/CodeEdit.md) \| `null`

The next value and the cell to focus, or `null` when the text holds no digit.

## Example

```ts
import { codePaste } from "@simplix-react/ui";

codePaste("Your code: 482 913", 6); // { value: "482913", focus: 5 }
```
