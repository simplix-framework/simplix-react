[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / EntityFacet

# Interface: EntityFacet

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L9)

What a facet hook hands to a `FilterBar` faceted filter definition.

## Properties

### loading

> **loading**: `boolean`

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L13)

Whether the search behind `onSearch` is in flight.

***

### onSearch()

> **onSearch**: (`query`) => `void`

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:17](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L17)

Receives the operator's search text (the FilterBar debounces it).

#### Parameters

##### query

`string`

#### Returns

`void`

***

### options

> **options**: [`EntityOption`](EntityOption.md)[]

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L11)

The current result page — not the whole directory.

***

### selectedOptions

> **selectedOptions**: [`EntityOption`](EntityOption.md)[]

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L15)

Labels for the picked ids, resolved whether or not they are on the current page.
