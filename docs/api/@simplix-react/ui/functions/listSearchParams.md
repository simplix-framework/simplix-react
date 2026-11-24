[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / listSearchParams

# Function: listSearchParams()

> **listSearchParams**(`list`, `options?`): `Record`\<`string`, `unknown`\>

Defined in: [packages/ui/src/crud/list/list-search-params.ts:69](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/list-search-params.ts#L69)

The search a server-mode list is sending now, without its page: the committed filters, the free
text and the sort, serialised the way its adapter serialises them. A request that must cover the
same rows as the list (an export, a count over the whole result) is sent with these, so it can
never disagree with what the reader narrowed the list to.

## Parameters

### list

`Pick`\<[`UseCrudListResult`](../interfaces/UseCrudListResult.md)\<`unknown`\>, `"filters"` \| `"sort"`\>

The list as `useCrudList` returned it.

### options?

[`ListSearchParamsOptions`](../interfaces/ListSearchParamsOptions.md)

The adapter's own `searchKey` and `transformFilters`, and any forced parameters.

## Returns

`Record`\<`string`, `unknown`\>
