[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / FacetedFilterProps

# Interface: FacetedFilterProps

Defined in: [packages/ui/src/crud/filters/faceted-filter.tsx:34](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/faceted-filter.tsx#L34)

Props for the [FacetedFilter](../functions/FacetedFilter.md) component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/filters/faceted-filter.tsx:47](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/faceted-filter.tsx#L47)

***

### label

> **label**: `string`

Defined in: [packages/ui/src/crud/filters/faceted-filter.tsx:36](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/faceted-filter.tsx#L36)

Button label (e.g. `"Status"`, `"Category"`).

***

### maxDisplayCount?

> `optional` **maxDisplayCount**: `number`

Defined in: [packages/ui/src/crud/filters/faceted-filter.tsx:46](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/faceted-filter.tsx#L46)

Max badges to show before collapsing to count. Defaults to `5`.

***

### multiSelect?

> `optional` **multiSelect**: `boolean`

Defined in: [packages/ui/src/crud/filters/faceted-filter.tsx:44](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/faceted-filter.tsx#L44)

Enable multi-select mode. Defaults to `true`.

***

### onChange()

> **onChange**: (`value`) => `void`

Defined in: [packages/ui/src/crud/filters/faceted-filter.tsx:40](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/faceted-filter.tsx#L40)

Called when selection changes.

#### Parameters

##### value

`string` | `string`[]

#### Returns

`void`

***

### options

> **options**: [`FacetedFilterOption`](FacetedFilterOption.md)[]

Defined in: [packages/ui/src/crud/filters/faceted-filter.tsx:42](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/faceted-filter.tsx#L42)

Available filter options.

***

### value

> **value**: `string` \| `string`[]

Defined in: [packages/ui/src/crud/filters/faceted-filter.tsx:38](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/faceted-filter.tsx#L38)

Currently selected value(s). String for single-select, string array for multi-select.
