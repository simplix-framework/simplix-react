[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / elapsedSpanBetween

# Function: elapsedSpanBetween()

> **elapsedSpanBetween**(`from`, `to`, `floor?`, `ceiling?`): [`ElapsedSpan`](../interfaces/ElapsedSpan.md) \| `undefined`

Defined in: [datetime/elapsed-span.ts:126](https://github.com/simplix-framework/simplix-react/blob/main/datetime/elapsed-span.ts#L126)

[elapsedSpan](elapsedSpan.md) between two instants, as they arrive from the server.

## Parameters

### from

when it began

`string` | `null` | `undefined`

### to

when it stopped moving — a caller measuring against now passes
  `new Date().toISOString()`

`string` | `null` | `undefined`

### floor?

[`ElapsedUnit`](../type-aliases/ElapsedUnit.md) = `"seconds"`

the smallest unit worth saying

### ceiling?

[`ElapsedUnit`](../type-aliases/ElapsedUnit.md) = `"days"`

the largest unit worth saying

## Returns

[`ElapsedSpan`](../interfaces/ElapsedSpan.md) \| `undefined`

the span, or undefined where either instant is missing or unreadable
