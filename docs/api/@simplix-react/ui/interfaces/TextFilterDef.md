[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / TextFilterDef

# Interface: TextFilterDef

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:75](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L75)

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

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:78](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L78)

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

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:77](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L77)

***

### options?

> `optional` **options**: [`TextFilterOptionDef`](TextFilterOptionDef.md)[]

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:87](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L87)

Closed catalogue the value is picked from instead of typed. Use it for a column
the server matches literally — a constant key, a code — where a typo produces an
empty result the operator cannot tell from "no such row". The pick still travels
under the current operator, so a CONTAINS filter over a column packing several
keys keeps working.

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:79](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L79)

***

### type

> **type**: `"text"`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:76](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L76)
