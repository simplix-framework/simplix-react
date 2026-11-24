[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / createEntitySearch

# Function: createEntitySearch()

> **createEntitySearch**\<`TItem`, `TParams`, `TQuery`, `TArg`\>(`cfg`): (`value`, `arg?`) => [`EntitySearch`](../interfaces/EntitySearch.md)

Defined in: [packages/ui/src/crud/entity/entity-search.ts:89](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L89)

Builds a server-searched options hook for an FK entity list — the loader behind a
form picker over a directory that outgrows one page.

<p>Its eager sibling [createEntityOptions](createEntityOptions.md) fetches the whole set once, which is
right for a bounded catalogue and wrong for a ledger: past the batch size the option
list is silently short and a row that exists cannot be found. This one asks the server
per query instead, and resolves the picked id separately so a selection keeps its name
once the search text moves past it.

<p>The list-filter counterpart is [createEntityFacet](createEntityFacet.md); the two differ only in that
a filter picks several ids and a form picks one.

## Type Parameters

### TItem

`TItem`

### TParams

`TParams`

### TQuery

`TQuery` *extends* `object`

### TArg

`TArg` = `void`

## Parameters

### cfg

[`EntitySearchConfig`](../interfaces/EntitySearchConfig.md)\<`TItem`, `TParams`, `TQuery`, `TArg`\>

## Returns

A `useXSearch(value, arg?)` hook yielding the picker's option props.

> (`value`, `arg?`): [`EntitySearch`](../interfaces/EntitySearch.md)

### Parameters

#### value

`string`

#### arg?

`TArg`

### Returns

[`EntitySearch`](../interfaces/EntitySearch.md)
