[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / TextFilterProps

# Interface: TextFilterProps

Defined in: [packages/ui/src/crud/filters/text-filter.tsx:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/text-filter.tsx#L14)

Props for the [TextFilter](../functions/TextFilter.md) component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/filters/text-filter.tsx:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/text-filter.tsx#L23)

***

### label

> **label**: `string`

Defined in: [packages/ui/src/crud/filters/text-filter.tsx:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/text-filter.tsx#L16)

Label used for accessibility `aria-label` and as fallback placeholder.

***

### onChange()

> **onChange**: (`value`) => `void`

Defined in: [packages/ui/src/crud/filters/text-filter.tsx:20](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/text-filter.tsx#L20)

Called when the user types or clears the filter.

#### Parameters

##### value

`string`

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [packages/ui/src/crud/filters/text-filter.tsx:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/text-filter.tsx#L22)

Placeholder text (defaults to `label`).

***

### value

> **value**: `string`

Defined in: [packages/ui/src/crud/filters/text-filter.tsx:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/text-filter.tsx#L18)

Current filter value.
