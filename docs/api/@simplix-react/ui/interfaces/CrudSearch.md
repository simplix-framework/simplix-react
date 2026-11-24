[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudSearch

# Interface: CrudSearch

Defined in: [packages/ui/src/crud/patterns/crud-search.ts:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/crud-search.ts#L22)

URL search params for CRUD page navigation.

## Properties

### filters?

> `optional` **filters**: [`CrudSearchFilters`](../type-aliases/CrudSearchFilters.md)

Defined in: [packages/ui/src/crud/patterns/crud-search.ts:44](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/crud-search.ts#L44)

The list filters the page opens with, and the ones the reader has applied since.

<p>Addressable for the same reason the tab is, and so that a link can carry a count's own
condition: a tile reading "4 failed jobs" opens the list filtered to those four jobs rather than
to every job. `id`, `mode` and `tab` are reserved and never appear inside it.

<p>The framework knows no entity's filter keys. A page narrows this object to the keys its list
declares before applying it, so a stale link never sends a parameter the server refuses.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/ui/src/crud/patterns/crud-search.ts:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/crud-search.ts#L23)

***

### mode?

> `optional` **mode**: `"edit"` \| `"new"`

Defined in: [packages/ui/src/crud/patterns/crud-search.ts:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/crud-search.ts#L24)

***

### tab?

> `optional` **tab**: `string`

Defined in: [packages/ui/src/crud/patterns/crud-search.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/crud-search.ts#L33)

Which tab of the page is open.

<p>Addressable state like the record is: a reader who reloads, or who sends somebody the link,
is looking at a tab and expects to still be looking at it. Held here rather than in the page's
own `useState`, because a page that keeps it locally loses it on every reload and shares a link
that opens somewhere else.
