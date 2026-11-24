[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / SearchableListParams

# Interface: SearchableListParams

Defined in: [build-searchable-params.ts:8](https://github.com/simplix-framework/simplix-react/blob/main/build-searchable-params.ts#L8)

List query params assembled by a list state machine before serialization —
the web page model (`useCrudList`) and the native feed model
(`useEntityFeed`) both produce this shape.

## Properties

### filters?

> `optional` **filters**: `Record`\<`string`, `unknown`\>

Defined in: [build-searchable-params.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/build-searchable-params.ts#L13)

Committed filter values keyed by `field.operator`. `_search` holds the list's free text and is
sent under [BuildSearchableParamsOptions.searchKey](BuildSearchableParamsOptions.md#searchkey), or dropped when none is given.

***

### pagination?

> `optional` **pagination**: `object`

Defined in: [build-searchable-params.ts:17](https://github.com/simplix-framework/simplix-react/blob/main/build-searchable-params.ts#L17)

Offset pagination — `page` is 1-based here.

#### limit

> **limit**: `number`

#### page

> **page**: `number`

***

### sort?

> `optional` **sort**: [`SortState`](SortState.md)

Defined in: [build-searchable-params.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/build-searchable-params.ts#L15)

Active sort state.
