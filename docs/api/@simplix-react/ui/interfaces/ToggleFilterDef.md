[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ToggleFilterDef

# Interface: ToggleFilterDef

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:142](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L142)

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

### type

> **type**: `"toggle"`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:143](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L143)
