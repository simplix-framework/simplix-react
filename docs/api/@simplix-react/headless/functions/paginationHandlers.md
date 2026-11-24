[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / paginationHandlers

# Function: paginationHandlers()

> **paginationHandlers**(`pagination`): [`PaginationHandlers`](../interfaces/PaginationHandlers.md)

Defined in: [entity/pagination-handlers.ts:47](https://github.com/simplix-framework/simplix-react/blob/main/entity/pagination-handlers.ts#L47)

The pagination props for a list, with the page reset when the page size grows.

<p><b>The framework's `setPageSize` is a bare state setter and leaves the page index where it
was.</b> A reader on page 2 of twenty rows who asks for fifty per page is then asking for the
second page of a one-page list, and the server answers with nothing — so enlarging the page
empties the screen, and the empty state says the calendar holds no days. Nothing errors, and the
reader's next move is usually to reload rather than to page back.

<p>Resetting on any size change rather than only on a growth: shrinking the page keeps the row
the reader was looking at on screen only by accident, and landing on the first page is the one
outcome that is never surprising.

<p><b>The first page is 1, not 0.</b> `useCrudList` holds a one-based page and sends
`page - 1` on the wire, so a reset to 0 asks the server for page −1 — which answers with
nothing and empties the very screen this helper exists to keep full. The off-by-one is silent:
it looks like the reset the helper promises, and only the request says otherwise.

## Parameters

### pagination

`PaginationLike`

the list controller's pagination state

## Returns

[`PaginationHandlers`](../interfaces/PaginationHandlers.md)

the props to spread onto the pagination control
