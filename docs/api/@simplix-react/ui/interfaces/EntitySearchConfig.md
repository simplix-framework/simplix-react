[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / EntitySearchConfig

# Interface: EntitySearchConfig\<TItem, TParams, TQuery, TArg\>

Defined in: [packages/ui/src/crud/entity/entity-search.ts:35](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L35)

Configuration for [createEntitySearch](../functions/createEntitySearch.md).

## Type Parameters

### TItem

`TItem`

### TParams

`TParams`

### TQuery

`TQuery` *extends* `object`

### TArg

`TArg`

## Properties

### alternateSearchParams()?

> `optional` **alternateSearchParams**: (`query`) => `TParams`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:61](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L61)

A second axis asked in parallel, for a directory whose display name has no single
searchable column — a person stored as separate family and given name columns.
Both pages merge, de-duplicated by id. Omit it when one column carries the whole
name; searchable params AND together, so a second axis cannot be folded into the
first.

#### Parameters

##### query

`string`

#### Returns

`TParams`

***

### filter()?

> `optional` **filter**: (`item`, `arg`) => `boolean`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:67](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L67)

Optional row predicate (exclude-self, active-only).

#### Parameters

##### item

`TItem`

##### arg

`TArg`

#### Returns

`boolean`

***

### getLabel()

> **getLabel**: (`item`, `arg`) => `string`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:65](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L65)

Display label per row; receives the caller arg so it can add discriminators.

#### Parameters

##### item

`TItem`

##### arg

`TArg`

#### Returns

`string`

***

### getValue()

> **getValue**: (`item`) => `string` \| `undefined`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:63](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L63)

FK id per row; rows whose value is empty are dropped.

#### Parameters

##### item

`TItem`

#### Returns

`string` \| `undefined`

***

### searchParams()

> **searchParams**: (`query`) => `TParams`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L48)

Params for one page of search results. Include `page` and `size` together, the
label sort, and the `<field>.contains` key the typed text goes into. An empty
query must still return a page, so the operator sees something before typing.

#### Parameters

##### query

`string`

#### Returns

`TParams`

***

### selectionParams()

> **selectionParams**: (`value`) => `TParams`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:53](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L53)

Params that fetch exactly the picked row, so its label survives a search that has
moved on. Only called with a non-empty id.

#### Parameters

##### value

`string`

#### Returns

`TParams`

***

### useEnabled()?

> `optional` **useEnabled**: () => `boolean`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:69](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L69)

Optional gate hook — skips every request when it returns false (e.g. a permission check).

#### Returns

`boolean`

***

### useList()

> **useList**: (`params`, `options?`) => `TQuery`

Defined in: [packages/ui/src/crud/entity/entity-search.ts:42](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-search.ts#L42)

The domain's Orval list hook (called unconditionally inside the returned hook).

#### Parameters

##### params

`TParams`

##### options?

###### query?

\{ `enabled?`: `boolean`; \}

###### query.enabled?

`boolean`

#### Returns

`TQuery`
