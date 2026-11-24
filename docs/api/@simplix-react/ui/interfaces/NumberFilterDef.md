[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / NumberFilterDef

# Interface: NumberFilterDef

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:90](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L90)

## Extends

- `FilterDefBase`

## Properties

### columnBreak?

> `optional` **columnBreak**: `boolean`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:66](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L66)

When the filter popover renders in multiple columns, start a new column at
this filter. Up to (columns - 1) flags take effect, in order; without flags
the fields are split evenly (column-major). Ignored in single-column layout.

#### Inherited from

`FilterDefBase.columnBreak`

***

### defaultOperator

> **defaultOperator**: [`SearchOperator`](../enumerations/SearchOperator.md)

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:93](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L93)

***

### field

> **field**: `string`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:59](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L59)

#### Inherited from

`FilterDefBase.field`

***

### label

> **label**: `string`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:60](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L60)

#### Inherited from

`FilterDefBase.label`

***

### operators

> **operators**: [`SearchOperator`](../enumerations/SearchOperator.md)[]

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:92](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L92)

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:94](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L94)

***

### type

> **type**: `"number"`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:91](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L91)
