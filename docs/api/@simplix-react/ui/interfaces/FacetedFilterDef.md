[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / FacetedFilterDef

# Interface: FacetedFilterDef

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:104](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L104)

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

### display?

> `optional` **display**: `"list"` \| `"dropdown"`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:117](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L117)

Presentation of the option list. "list" (default) renders the searchable
checkbox list inline; "dropdown" collapses it behind a combobox-style
trigger — use for long option sets such as entity/user pickers.

***

### field

> **field**: `string`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:59](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L59)

#### Inherited from

`FilterDefBase.field`

***

### footer?

> `optional` **footer**: `ReactNode`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:139](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L139)

Rendered below the option list — e.g. a "more results" hint.

***

### label

> **label**: `string`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:60](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L60)

#### Inherited from

`FilterDefBase.label`

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:131](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L131)

Whether the query behind [onSearch](#onsearch) is in flight.

***

### multiSelect?

> `optional` **multiSelect**: `boolean`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:111](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L111)

***

### onSearch()?

> `optional` **onSearch**: (`query`) => `void`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:127](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L127)

Switches the filter to server search: what the operator types is debounced and
handed here instead of filtering [options](#options) locally, so a directory larger
than one page stays reachable. The caller answers by replacing `options` with
the matching page.

Pair it with [selectedOptions](#selectedoptions), or a value picked from an earlier page
loses its label as soon as the search text moves past it.

#### Parameters

##### query

`string`

#### Returns

`void`

***

### options

> **options**: [`FacetedFilterOptionDef`](FacetedFilterOptionDef.md)[]

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:110](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L110)

The values on offer. In server-search mode (see [onSearch](#onsearch)) this is the
current result page rather than the whole set.

***

### searchDebounceMs?

> `optional` **searchDebounceMs**: `number`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:129](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L129)

Debounce applied to [onSearch](#onsearch), in milliseconds. Default 300.

***

### selectedOptions?

> `optional` **selectedOptions**: [`FacetedFilterOptionDef`](FacetedFilterOptionDef.md)[]

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:137](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L137)

Labels for values that are selected but absent from the current [options](#options)
page. They head the option list and back the active-filter badge, so a selection
keeps its name instead of degrading to a raw id.

***

### type

> **type**: `"faceted"`

Defined in: [packages/ui/src/crud/filters/filter-bar.tsx:105](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/filters/filter-bar.tsx#L105)
