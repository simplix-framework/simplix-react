[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / filtersToRequestParams

# Function: filtersToRequestParams()

> **filtersToRequestParams**(`filters`, `options?`): `Record`\<`string`, `unknown`\>

Defined in: [packages/ui/src/crud/list/list-search-params.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/list-search-params.ts#L48)

The request parameters a list sends for one set of filters, without its page and its sort.

<p><b>One function for the list and for everything that counts what the list shows.</b> A tile
reading "4 failed jobs" that opens the list filtered to those jobs states the same filters twice,
once as the link and once as the count's request. Both go through this function, so the count and
the list cannot send different parameters for the same filters: the filters are read as the list
reads them from its address ([decodeAddressedFilters](decodeAddressedFilters.md)), serialised the way the list's
adapter serialises them (`buildSearchableParams`, with the adapter's own `transformFilters`), and
the forced parameters win. Pass the result, with the page window of the read, to the generated
list hook.

## Parameters

### filters

Filter keys (`field.operator`) to a string or an array of strings, such as a
  tile's link carries and `CrudSearch.filters` holds.

`Readonly`\<`Record`\<`string`, `string` \| readonly `string`[]\>\> | `undefined`

### options?

[`FiltersToRequestParamsOptions`](../interfaces/FiltersToRequestParamsOptions.md)

The adapter's own `searchKey`, `transformFilters` and forced parameters, and the
  controls the list draws.

## Returns

`Record`\<`string`, `unknown`\>

The flat request parameters, ready for a generated list hook.

## Example

```ts
const failed = { "status.in": ["FAILED"] };
// the tile's count
const count = useListCount(useListBackgroundJobs, filtersToRequestParams(failed));
// the tile's link
<Link to="/jobs" search={{ filters: failed }} />
```
