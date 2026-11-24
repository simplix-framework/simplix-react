[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / createEntityOptions

# Function: createEntityOptions()

> **createEntityOptions**\<`TItem`, `TParams`, `TQuery`, `TArg`\>(`cfg`): (`arg?`) => `object`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:80](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L80)

Builds a batch-loaded `{ label, value }` options hook for an FK entity list —
the single loader a combobox and any faceted filter over the same directory
share (React Query dedupes the one request). A factory rather than a plain
generic hook because the domain list hook must be called unconditionally
inside the returned hook.

<p><b>Only for a bounded catalogue</b> — a set an administrator authors and can
count: organizations, visit types, leave types, shift definitions. One request
fetches the whole of it, every consumer of the directory shares that request,
and a row deactivated years ago still resolves to its name in an old record.

<p>It is the wrong loader for anything that accumulates — a person, a customer,
a contract, an issued key, one row per transaction. Past the batch size the
option list is silently short: a row that exists cannot be found and nothing
says why. Those ask the server per query instead — [createEntitySearch](createEntitySearch.md)
for a form picker, [createEntityFacet](createEntityFacet.md) for a list filter. When in doubt
about which side a directory falls on, assume it grows.

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

[`EntityOptionsConfig`](../interfaces/EntityOptionsConfig.md)\<`TItem`, `TParams`, `TQuery`, `TArg`\>

## Returns

A `useXOptions(arg?)` hook yielding `{ options, isLoading }`.

> (`arg?`): `object`

### Parameters

#### arg?

`TArg`

### Returns

`object`

#### isLoading

> **isLoading**: `boolean`

#### options

> **options**: [`EntityOption`](../interfaces/EntityOption.md)[]
