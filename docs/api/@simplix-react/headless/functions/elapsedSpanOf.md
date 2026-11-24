[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / elapsedSpanOf

# Function: elapsedSpanOf()

> **elapsedSpanOf**(`value`, `unit`, `floor?`, `ceiling?`): [`ElapsedSpan`](../interfaces/ElapsedSpan.md) \| `undefined`

Defined in: [datetime/elapsed-span.ts:107](https://github.com/simplix-framework/simplix-react/blob/main/datetime/elapsed-span.ts#L107)

[elapsedSpan](elapsedSpan.md) for a length already counted in a unit.

<p><b>For the lengths that were never two instants.</b> A shift is stored as minutes and a
silence window as hours — neither has a start, and a screen holding one had to write the
conversion out before it could reduce it. Written out, the conversion lands in the screen and
the next rung up lands there with it.

## Parameters

### value

`number`

how many of `unit` it lasts

### unit

[`ElapsedUnit`](../type-aliases/ElapsedUnit.md)

which unit that is

### floor?

[`ElapsedUnit`](../type-aliases/ElapsedUnit.md) = `"seconds"`

the smallest unit worth saying

### ceiling?

[`ElapsedUnit`](../type-aliases/ElapsedUnit.md) = `"days"`

the largest unit worth saying

## Returns

[`ElapsedSpan`](../interfaces/ElapsedSpan.md) \| `undefined`

the span, or undefined where the value is not a number or runs backwards
