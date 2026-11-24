[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / filtersOutsideForced

# Function: filtersOutsideForced()

> **filtersOutsideForced**(`forced`, `filters`): [`FilterDef`](../type-aliases/FilterDef.md)[]

Defined in: [packages/ui/src/crud/entity/forced-list.ts:111](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/forced-list.ts#L111)

The filters left once the ones the screen has already decided are taken out.

<p><b>A tab that pins a field kills the filter over that same field.</b> [adaptForcedList](adaptForcedList.md)
merges the tab's parameters over the request AFTER the reader's filters, so on 설치됨 —
`status.equals: APPLIED` — the 상태 facet draws, opens, takes a selection, paints its badge in
the bar and changes not one row. There is nothing on the screen to say why, so it reads as a
broken control or as a register with nothing in it, and the reader's next move is to try it
again.

<p><b>Deleting the filter is not the fix, because the same list is drawn on the tabs that do not
pin it.</b> Every tab strip in this console narrows a different axis per tab — 설치됨 pins
`status`, 미구독 pins `licensed`, 설치 이력 pins neither — so the control is right on three tabs
out of four and dead on the fourth. Which filters the bar offers is therefore a question about
the tab that is open, answered here, at the moment the bar is drawn.

<p><b>`.equals` and nothing else.</b> A pin is a single value the request substitutes for
whatever the reader chose. `.in` is the opposite case — the screen forces a SET and a filter
narrows inside it, which is what a chip row is for — and `.greaterThan`, `.lessThan` and the
date bounds narrow an axis the reader can still narrow further.

<p><b>Judged by the key rather than by its value.</b> A pin whose value has not arrived yet
(`siteId.equals: undefined`) still names a field this screen has decided, and
[adaptForcedList](adaptForcedList.md) holds the whole query closed until it does. Reading the value instead
would draw the control for as long as the read takes and then take it away under the reader.

## Parameters

### forced

`Record`\<`string`, `unknown`\>

the parameters handed to [adaptForcedList](adaptForcedList.md)

### filters

readonly [`FilterDef`](../type-aliases/FilterDef.md)[]

the bar's full set, as the screen would draw it with nothing pinned

## Returns

[`FilterDef`](../type-aliases/FilterDef.md)[]

the same filters, minus every one the screen has already decided
