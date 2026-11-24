[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / withForced

# Function: withForced()

> **withForced**\<`L`\>(`list`, `forced`): [`UnderForced`](../type-aliases/UnderForced.md)\<`L`\>

Defined in: [packages/ui/src/crud/entity/forced-list.ts:149](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/forced-list.ts#L149)

The list controller with the narrowing it was built under attached to it.

<p><b>The filter bar is drawn by a component that never sees the tab.</b> A list widget takes
one prop — the controller its screen's hook built — and the parameters the tab pins are computed
either in that hook or in the page above it, so the one place that decides which filters to
offer is the one place with no way to know what the screen has already decided. Handing the
narrowing back with the controller is what closes that: `useCrudList`'s answer already carries
this list's `scopeKey`, and what pinned it belongs beside it.

<p><b>Attached rather than passed as a second prop.</b> A prop is a line every render site has
to remember, and the one that forgets draws a dead control that nothing fails on — whereas a
hook cannot hand back a controller without the thing it was built from.

## Type Parameters

### L

`L`

the controller `useCrudList` returned

## Parameters

### list

`L`

that controller

### forced

`Record`\<`string`, `unknown`\>

the parameters handed to [adaptForcedList](adaptForcedList.md) beside it

## Returns

[`UnderForced`](../type-aliases/UnderForced.md)\<`L`\>

the same controller, carrying its narrowing
