[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / codeFocusable

# Function: codeFocusable()

> **codeFocusable**(`value`, `index`, `length`): `number`

Defined in: [packages/ui/src/base/inputs/code-input-model.ts:35](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/code-input-model.ts#L35)

Returns the cell a focus at `index` lands on: never past the first empty cell or the last cell.

## Parameters

### value

`string`

The digits typed so far.

### index

`number`

The cell the focus was asked to move to.

### length

`number`

How many cells the code has.

## Returns

`number`

The cell index that may take the focus.

## Example

```ts
import { codeFocusable } from "@simplix-react/ui";

codeFocusable("12", 5, 6); // 2: the first empty cell
```
