[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ChipFilterOption

# Interface: ChipFilterOption\<T\>

Defined in: [packages/ui/src/crud/filters/chip-filter.tsx:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/chip-filter.tsx#L11)

A single chip option.

## Type Parameters

### T

`T` *extends* `string` \| `number` = `string`

## Properties

### disabled?

> `optional` **disabled**: `boolean`

Defined in: [packages/ui/src/crud/filters/chip-filter.tsx:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/chip-filter.tsx#L24)

Whether this option is disabled.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [packages/ui/src/crud/filters/chip-filter.tsx:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/chip-filter.tsx#L22)

Replaces the chosen/unchosen mark with something else — a colour dot, a count.

<p>Supplying one gives up the mark that says whether this chip is on, so only pass it where
the chip's own colour already carries that.

***

### label

> **label**: `string`

Defined in: [packages/ui/src/crud/filters/chip-filter.tsx:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/chip-filter.tsx#L15)

Display label.

***

### value

> **value**: `T`

Defined in: [packages/ui/src/crud/filters/chip-filter.tsx:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/chip-filter.tsx#L13)

Value sent to the server filter.
