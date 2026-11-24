[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / adaptForcedList

# Function: adaptForcedList()

> **adaptForcedList**\<`T`\>(`useApiHook`, `forced`, `options?`): [`ListHook`](../interfaces/ListHook.md)\<`T`\>

Defined in: [packages/ui/src/crud/entity/forced-list.ts:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/forced-list.ts#L29)

A list hook whose narrowing the reader cannot type away.

<p><b>Why not `transformFilters`.</b> That option looks like the place for this and is not: the
list state machine only puts a `filters` object into the request when the reader has committed
one, and `transformFilters` runs only when that object exists. A tab, a chip row or a scope
arriving in the address therefore narrows nothing at all on the first view of a screen — the
request goes out unnarrowed, the whole register comes back, and the tab above it still says the
count it would have had. Nothing errors, nothing is logged, and the number and the rows disagree
in the one place a reader would not check. Committing any filter makes it start working, which is
what makes it so easy to miss while testing.

<p>Merging into the request parameters instead puts the narrowing outside that gate, and keeps it
in the query key — so switching tabs refetches rather than re-rendering the same answer.

<p><b>The forced parameters win.</b> A tab is a statement about which records are being looked
at; a filter narrows within it.

## Type Parameters

### T

`T`

the row type

## Parameters

### useApiHook

[`OrvalListHookLike`](../type-aliases/OrvalListHookLike.md)

the generated list hook

### forced

`Record`\<`string`, `unknown`\>

the parameters the tab or the address imposes, in the server's own filter grammar

### options?

[`AdaptOrvalListOptions`](../interfaces/AdaptOrvalListOptions.md)

the same options `adaptOrvalList` takes

## Returns

[`ListHook`](../interfaces/ListHook.md)\<`T`\>

a list hook for `useCrudList` in server mode
