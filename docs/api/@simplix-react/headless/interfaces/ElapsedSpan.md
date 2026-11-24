[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / ElapsedSpan

# Interface: ElapsedSpan

Defined in: [datetime/elapsed-span.ts:28](https://github.com/simplix-framework/simplix-react/blob/main/datetime/elapsed-span.ts#L28)

A length of time, reduced to the largest unit that fits it and the next one down.

## Properties

### count

> `readonly` **count**: `number`

Defined in: [datetime/elapsed-span.ts:32](https://github.com/simplix-framework/simplix-react/blob/main/datetime/elapsed-span.ts#L32)

How many of that unit.

***

### rest

> `readonly` **rest**: `number`

Defined in: [datetime/elapsed-span.ts:34](https://github.com/simplix-framework/simplix-react/blob/main/datetime/elapsed-span.ts#L34)

How many of the unit below, and zero at the bottom of the ladder.

***

### unit

> `readonly` **unit**: [`ElapsedUnit`](../type-aliases/ElapsedUnit.md)

Defined in: [datetime/elapsed-span.ts:30](https://github.com/simplix-framework/simplix-react/blob/main/datetime/elapsed-span.ts#L30)

The largest unit the length fills.
