[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / FiltersToRequestParamsOptions

# Interface: FiltersToRequestParamsOptions

Defined in: [packages/ui/src/crud/list/list-search-params.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/list-search-params.ts#L13)

Options for [filtersToRequestParams](../functions/filtersToRequestParams.md): the list's adapter options and the controls it draws.

## Extends

- [`ListSearchParamsOptions`](ListSearchParamsOptions.md)

## Properties

### controls?

> `readonly` `optional` **controls**: readonly [`FilterControl`](../type-aliases/FilterControl.md)[]

Defined in: [packages/ui/src/crud/list/list-search-params.ts:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/list-search-params.ts#L18)

The controls the list draws, so a value a link carries as text is read back as the type its
control commits. Pass the same controls the list was given in its `addressedFilters`.

***

### forced?

> `readonly` `optional` **forced**: `Readonly`\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/ui/src/crud/list/list-search-params.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/list-search-params.ts#L9)

The parameters a tab or the address forces, as handed to `adaptForcedList`; they win.

#### Inherited from

[`ListSearchParamsOptions`](ListSearchParamsOptions.md).[`forced`](ListSearchParamsOptions.md#forced)

***

### searchKey?

> `optional` **searchKey**: `string`

Defined in: [packages/headless/dist/index.d.ts:173](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L173)

The key the list's free text (`_search`) is sent under: [SEARCHABLE\_KEYWORD\_PARAM](../variables/SEARCHABLE_KEYWORD_PARAM.md) on
a route with keyword fields, or one `field.operator` key. The searchable parser rejects any
other key without an operator, so without this the text cannot reach the server and is
dropped. A filter the reader committed on the same key wins over the free text.

#### Inherited from

[`ListSearchParamsOptions`](ListSearchParamsOptions.md).[`searchKey`](ListSearchParamsOptions.md#searchkey)

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

[`ListSearchParamsOptions`](ListSearchParamsOptions.md).[`transformFilters`](ListSearchParamsOptions.md#transformfilters)
