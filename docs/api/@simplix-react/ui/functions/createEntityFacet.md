[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / createEntityFacet

# Function: createEntityFacet()

> **createEntityFacet**\<`TItem`, `TParams`, `TQuery`, `TArg`\>(`cfg`): (`state`, `arg?`) => [`EntityFacet`](../interfaces/EntityFacet.md)

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:74](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L74)

Builds a server-searched options hook for an FK entity list — the loader behind a
`FilterBar` faceted filter over a directory that outgrows one page.

<p>Its eager sibling [createEntityOptions](createEntityOptions.md) fetches the whole set once, which is
right for a bounded catalogue and wrong for a ledger: past the batch size the option
list is silently short and a row that exists cannot be found. This one asks the server
per query instead, and resolves the picked ids separately so a selection keeps its name
once the search text moves past it.

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

[`EntityFacetConfig`](../interfaces/EntityFacetConfig.md)\<`TItem`, `TParams`, `TQuery`, `TArg`\>

## Returns

A `useXFacet(state, arg?)` hook yielding the faceted filter's option props.

> (`state`, `arg?`): [`EntityFacet`](../interfaces/EntityFacet.md)

### Parameters

#### state

[`CrudListFilters`](../interfaces/CrudListFilters.md)

#### arg?

`TArg`

### Returns

[`EntityFacet`](../interfaces/EntityFacet.md)
