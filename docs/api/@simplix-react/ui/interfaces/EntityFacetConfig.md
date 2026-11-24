[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / EntityFacetConfig

# Interface: EntityFacetConfig\<TItem, TParams, TQuery, TArg\>

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L21)

Configuration for [createEntityFacet](../functions/createEntityFacet.md).

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

### getLabel()

> **getLabel**: (`item`, `arg`) => `string`

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L48)

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

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:46](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L46)

FK id per row; rows whose value is empty are dropped.

#### Parameters

##### item

`TItem`

#### Returns

`string` \| `undefined`

***

### idField

> **idField**: `string`

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L33)

The referenced entity's id field — both the filter key the picked values live
under (`<idField>.in`) and what [getValue](#getvalue) returns.

***

### searchParams()

> **searchParams**: (`query`) => `TParams`

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:39](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L39)

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

> **selectionParams**: (`values`) => `TParams`

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:44](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L44)

Params that fetch exactly the picked rows, so their labels survive a search that
has moved on. Only called with a non-empty list.

#### Parameters

##### values

`string`[]

#### Returns

`TParams`

***

### useEnabled()?

> `optional` **useEnabled**: () => `boolean`

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:50](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L50)

Optional gate hook — skips both requests when it returns false (e.g. a permission check).

#### Returns

`boolean`

***

### useList()

> **useList**: (`params`, `options?`) => `TQuery`

Defined in: [packages/ui/src/crud/entity/entity-facet.ts:28](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-facet.ts#L28)

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
