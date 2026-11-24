[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / BuildSearchableParamsOptions

# Interface: BuildSearchableParamsOptions

Defined in: [build-searchable-params.ts:28](https://github.com/simplix-framework/simplix-react/blob/main/build-searchable-params.ts#L28)

Options for [buildSearchableParams](../functions/buildSearchableParams.md).

## Properties

### searchKey?

> `optional` **searchKey**: `string`

Defined in: [build-searchable-params.ts:39](https://github.com/simplix-framework/simplix-react/blob/main/build-searchable-params.ts#L39)

The key the list's free text (`_search`) is sent under: [SEARCHABLE\_KEYWORD\_PARAM](../variables/SEARCHABLE_KEYWORD_PARAM.md) on
a route with keyword fields, or one `field.operator` key. The searchable parser rejects any
other key without an operator, so without this the text cannot reach the server and is
dropped. A filter the reader committed on the same key wins over the free text.

***

### transformFilters()?

> `optional` **transformFilters**: (`filters`) => `Record`\<`string`, `unknown`\>

Defined in: [build-searchable-params.ts:32](https://github.com/simplix-framework/simplix-react/blob/main/build-searchable-params.ts#L32)

Transform filter key-value pairs before sending to the API.
 Use this to convert generic filter formats to backend-specific formats
 (e.g., searchable-jpa BETWEEN operator, date format conversion).

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`Record`\<`string`, `unknown`\>
