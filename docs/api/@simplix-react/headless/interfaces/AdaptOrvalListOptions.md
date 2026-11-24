[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / AdaptOrvalListOptions

# Interface: AdaptOrvalListOptions

Defined in: [adapt-orval-list.ts:35](https://github.com/simplix-framework/simplix-react/blob/main/adapt-orval-list.ts#L35)

## Properties

### queryOptions?

> `optional` **queryOptions**: `Record`\<`string`, `unknown`\>

Defined in: [adapt-orval-list.ts:39](https://github.com/simplix-framework/simplix-react/blob/main/adapt-orval-list.ts#L39)

Extra query options forwarded to Orval's second argument (`{ query: {...} }`).
 Merged with defaults (`staleTime: 0, gcTime: 0`, `meta: LIST_READ_META`); a `meta` given here
 is merged over [LIST\_READ\_META](../variables/LIST_READ_META.md).

***

### searchKey?

> `optional` **searchKey**: `string`

Defined in: [adapt-orval-list.ts:45](https://github.com/simplix-framework/simplix-react/blob/main/adapt-orval-list.ts#L45)

The `field.operator` key the list's free text is sent under; see `buildSearchableParams`.

***

### transformFilters()?

> `optional` **transformFilters**: (`filters`) => `Record`\<`string`, `unknown`\>

Defined in: [adapt-orval-list.ts:43](https://github.com/simplix-framework/simplix-react/blob/main/adapt-orval-list.ts#L43)

Transform filter key-value pairs before sending to the API.
 Use this to convert generic filter formats to backend-specific formats
 (e.g., searchable-jpa BETWEEN operator, date format conversion).

#### Parameters

##### filters

`Record`\<`string`, `unknown`\>

#### Returns

`Record`\<`string`, `unknown`\>
