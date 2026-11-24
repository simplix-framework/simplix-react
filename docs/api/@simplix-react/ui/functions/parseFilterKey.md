[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / parseFilterKey

# Function: parseFilterKey()

> **parseFilterKey**(`key`): \{ `field`: `string`; `operator`: `string`; \} \| `null`

Defined in: [packages/headless/dist/index.d.ts:419](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L419)

Parse a filter key back into field and operator.
Example: parseFilterKey("name.contains") -> { field: "name", operator: "contains" }

## Parameters

### key

`string`

## Returns

\{ `field`: `string`; `operator`: `string`; \} \| `null`
