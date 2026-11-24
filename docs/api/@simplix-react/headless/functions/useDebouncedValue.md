[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / useDebouncedValue

# Function: useDebouncedValue()

> **useDebouncedValue**\<`T`\>(`value`, `delayMs`): `T`

Defined in: [entity/use-debounced-value.ts:11](https://github.com/simplix-framework/simplix-react/blob/main/entity/use-debounced-value.ts#L11)

Holds a value back until it has stopped changing, so a per-keystroke value can
drive a server round-trip without one request per character.

## Type Parameters

### T

`T`

## Parameters

### value

`T`

the value that changes as the operator types

### delayMs

`number`

how long the value must stay unchanged before it is published

## Returns

`T`

`value`, updating only after it has been stable for `delayMs`
