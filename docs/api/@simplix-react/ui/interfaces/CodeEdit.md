[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CodeEdit

# Interface: CodeEdit

Defined in: [packages/ui/src/base/inputs/code-input-model.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/code-input-model.ts#L9)

The next state of a code entered one digit per cell: the code typed so far and the cell that
takes the focus.

## Remarks

The value is contiguous from the first cell: cell `i` shows `value[i]`, and the first empty cell
is `value.length`. Every editing rule below returns one of these.

## Properties

### focus

> **focus**: `number`

Defined in: [packages/ui/src/base/inputs/code-input-model.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/code-input-model.ts#L13)

The cell that takes the focus after the edit.

***

### value

> **value**: `string`

Defined in: [packages/ui/src/base/inputs/code-input-model.ts:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/code-input-model.ts#L11)

The digits typed so far, from the first cell.
