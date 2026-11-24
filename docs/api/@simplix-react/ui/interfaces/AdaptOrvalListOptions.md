[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / AdaptOrvalListOptions

# Interface: AdaptOrvalListOptions

Defined in: [packages/headless/dist/index.d.ts:217](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L217)

## Properties

### queryOptions?

> `optional` **queryOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/headless/dist/index.d.ts:221](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L221)

Extra query options forwarded to Orval's second argument (`{ query: {...} }`).
 Merged with defaults (`staleTime: 0, gcTime: 0`, `meta: LIST_READ_META`); a `meta` given here
 is merged over [LIST\_READ\_META](../variables/LIST_READ_META.md).

***

### searchKey?

> `optional` **searchKey**: `string`

Defined in: [packages/headless/dist/index.d.ts:227](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L227)

The `field.operator` key the list's free text is sent under; see `buildSearchableParams`.

***

### transformFilters()?

> `optional` **transformFilters**: (`filters`) => `Record`\<`string`, `unknown`\>

Defined in: [packages/headless/dist/index.d.ts:225](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L225)

Transform filter key-value pairs before sending to the API.
 Use this to convert generic filter formats to backend-specific formats
 (e.g., searchable-jpa BETWEEN operator, date format conversion).

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`Record`\<`string`, `unknown`\>
