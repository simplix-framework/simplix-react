[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ListSearchParamsOptions

# Interface: ListSearchParamsOptions

Defined in: [packages/ui/src/crud/list/list-search-params.ts:7](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/list-search-params.ts#L7)

Options for [listSearchParams](../functions/listSearchParams.md): the ones the list's adapter was built with.

## Extends

- `BuildSearchableParamsOptions`

## Extended by

- [`FiltersToRequestParamsOptions`](FiltersToRequestParamsOptions.md)

## Properties

### forced?

> `readonly` `optional` **forced**: `Readonly`\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/ui/src/crud/list/list-search-params.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/list-search-params.ts#L9)

The parameters a tab or the address forces, as handed to `adaptForcedList`; they win.

***

### searchKey?

> `optional` **searchKey**: `string`

Defined in: [packages/headless/dist/index.d.ts:173](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L173)

The key the list's free text (`_search`) is sent under: [SEARCHABLE\_KEYWORD\_PARAM](../variables/SEARCHABLE_KEYWORD_PARAM.md) on
a route with keyword fields, or one `field.operator` key. The searchable parser rejects any
other key without an operator, so without this the text cannot reach the server and is
dropped. A filter the reader committed on the same key wins over the free text.

#### Inherited from

`BuildSearchableParamsOptions.searchKey`

***

### transformFilters()?

> `optional` **transformFilters**: (`filters`) => `Record`\<`string`, `unknown`\>

Defined in: [packages/headless/dist/index.d.ts:166](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L166)

Transform filter key-value pairs before sending to the API.
 Use this to convert generic filter formats to backend-specific formats
 (e.g., searchable-jpa BETWEEN operator, date format conversion).

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`Record`\<`string`, `unknown`\>

#### Inherited from

`BuildSearchableParamsOptions.transformFilters`
