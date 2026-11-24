[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / EntitySearch

# Interface: EntitySearch

Defined in: [packages/ui/src/crud/entity/entity-search.ts:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L23)

What a search hook hands to a server-searched picker.

## Properties

### hasMore

> **hasMore**: `boolean`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L29)

True when the server holds more matches than the fetched page.

***

### loading

> **loading**: `boolean`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:27](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L27)

Whether the search behind `onSearch` is in flight.

***

### onSearch()

> **onSearch**: (`query`) => `void`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L31)

Receives the operator's search text; debounced before it reaches the server.

#### Parameters

##### query

`string`

#### Returns

`void`

***

### options

> **options**: [`EntityOption`](EntityOption.md)[]

Defined in: [packages/ui/src/crud/entity/entity-search.ts:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L25)

The current result page — not the whole directory — with the pick at its head.
