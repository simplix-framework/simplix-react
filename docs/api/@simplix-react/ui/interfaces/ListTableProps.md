[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ListTableProps

# Interface: ListTableProps\<T\>

Defined in: [packages/ui/src/crud/list/crud-list.tsx:602](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L602)

Props for the List.Table sub-component built on TanStack Table.

## Type Parameters

### T

`T`

## Properties

### actionColumnWidth?

> `optional` **actionColumnWidth**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:657](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L657)

Override the auto-calculated action column width (px).

***

### actions?

> `optional` **actions**: [`RowActionDef`](RowActionDef.md)\<`T`\>[]

Defined in: [packages/ui/src/crud/list/crud-list.tsx:653](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L653)

Declarative row action buttons. Automatically appends an action column to the table.

***

### actionVariant?

> `optional` **actionVariant**: [`ActionVariant`](../type-aliases/ActionVariant.md)

Defined in: [packages/ui/src/crud/list/crud-list.tsx:655](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L655)

Visual variant for action buttons. Defaults to `"outline"`.

***

### activeRowId?

> `optional` **activeRowId**: `string` \| `null`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:610](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L610)

Highlights the row whose `rowId` matches this value.

***

### cardBreakpoint?

> `optional` **cardBreakpoint**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:623](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L623)

Container width threshold (px) below which card mode activates. Disabled when omitted.

***

### cardContent()?

> `optional` **cardContent**: (`props`) => `ReactNode`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:636](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L636)

Render prop for the card content area below the title.

#### Parameters

##### props

###### index

`number`

###### row

`T`

#### Returns

`ReactNode`

***

### cardTitle()?

> `optional` **cardTitle**: (`props`) => `ReactNode`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:634](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L634)

Render prop for the card title area. Displayed with a bottom border, inline with action buttons.

#### Parameters

##### props

###### index

`number`

###### row

`T`

#### Returns

`ReactNode`

***

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:706](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L706)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:705](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L705)

***

### data

> **data**: `T`[]

Defined in: [packages/ui/src/crud/list/crud-list.tsx:603](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L603)

***

### density?

> `optional` **density**: `"default"` \| `"compact"` \| `"comfortable"`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:642](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L642)

Vertical density (padding). Overrides size-based vertical spacing when set.

***

### emptyReason?

> `optional` **emptyReason**: [`EmptyReason`](../type-aliases/EmptyReason.md) \| `null`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:675](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L675)

When set, displays an empty-state message inside the table body.

***

### emptyState?

> `optional` **emptyState**: `ListEmptyStateConfig`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:677](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L677)

Rich empty state config for "no-data" reason. Replaces the entire table with a centered illustration.

***

### filteredEmptyState?

> `optional` **filteredEmptyState**: `ListEmptyStateConfig`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:684](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L684)

Rich empty state config for the "no-filter" reason: filters are lit and nothing matches them.
Replaces the framework's "No matching items" card, so a page can say what its own filter
means (for example what an empty chip is). Without it the framework's text stays.
`slots.empty` still replaces either one.

***

### gridView?

> `optional` **gridView**: `boolean`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:632](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L632)

Declares grid as a user-selectable view (requires `cardTitle`/`cardContent`).
When set, the FilterBar auto-shows a list/grid toggle. Independent of the
responsive `cardBreakpoint` fallback.

<p>Which view the list opens in is the root's `defaultViewMode`. In grid view the cards sit in a
fit grid: as many columns as hold a card no narrower than `--card-min-width`.

***

### groupBy?

> `optional` **groupBy**: `ListGroupConfig`\<`T`\>

Defined in: [packages/ui/src/crud/list/crud-list.tsx:704](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L704)

Puts the rows under headings, one heading per distinct key.

A catalogue people navigate by band rather than by row — ranks under 임원 / 관리 / 현장,
organizations under principal / contractor — reads as a flat list without this, and the
reader scans every row to find where one band ends.

Rows are bucketed, so a group is contiguous whatever the sort: `sort` then orders the rows
*within* a group and `order` (or first appearance) orders the groups themselves. Without
bucketing a catalogue sorted by rank would print the same heading twice the moment one
member of a band sorted away from the rest, which is the usual case rather than the odd one.

Grouping is a property of the page in front of the reader: it applies to the rows this page
holds, and says nothing about the ones on the next. Cards draw the same headings above each
group, so a list narrowed to cards keeps its bands. A reorderable list draws none, since its
order is one sequence across every group.

***

### isLoading?

> `optional` **isLoading**: `boolean`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:604](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L604)

***

### keyboardNav?

> `optional` **keyboardNav**: `boolean`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:620](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L620)

Moves a focus mark along the record rows with `j` and `k`, in the order they are drawn;
`x` toggles the marked row's selection and `Enter` opens it through `onRowClick`. The keys
are ignored while the reader types in a field or presses a control. Off unless asked for, so
a page with several lists gives the keys to one of them.

***

### onRowClick()?

> `optional` **onRowClick**: (`row`) => `void`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:608](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L608)

#### Parameters

##### row

`T`

#### Returns

`void`

***

### onSelectAll()?

> `optional` **onSelectAll**: () => `void`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:613](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L613)

#### Returns

`void`

***

### onSelectionChange()?

> `optional` **onSelectionChange**: (`index`) => `void`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:612](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L612)

#### Parameters

##### index

`number`

#### Returns

`void`

***

### onSortChange()?

> `optional` **onSortChange**: (`sort`) => `void`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:606](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L606)

#### Parameters

##### sort

[`SortState`](SortState.md)

#### Returns

`void`

***

### reorder?

> `optional` **reorder**: [`ReorderConfig`](ReorderConfig.md)\<`T`\>

Defined in: [packages/ui/src/crud/list/crud-list.tsx:673](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L673)

Drag-and-drop row reorder configuration.

***

### resizableColumns?

> `optional` **resizableColumns**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:669](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L669)

Lets the reader drag a column's trailing edge, keeping the width under this key.

<p>Omit and the columns stay exactly as the screen declared them. Supply a key — one per list
screen — and every column carrying a `field` grows a grab zone whose width outlives the visit.
Two renderings of the same list share a key on purpose: they are the same columns, and a
reader who widened one meant the column rather than the placement.

<p>Widths are stored by the column's `field`, so inserting a column does not move a stored
width onto its neighbour and translating the header does not lose it.

***

### rounded?

> `optional` **rounded**: `"none"` \| `"sm"` \| `"lg"` \| `"md"`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:644](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L644)

Container border radius.

***

### rowClassName()?

> `optional` **rowClassName**: (`row`) => `string` \| `undefined`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:686](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L686)

Callback to compute extra class names for each table/card row.

#### Parameters

##### row

`T`

#### Returns

`string` \| `undefined`

***

### rowId()?

> `optional` **rowId**: (`row`) => `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:621](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L621)

#### Parameters

##### row

`T`

#### Returns

`string`

***

### selectable?

> `optional` **selectable**: `boolean`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:607](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L607)

***

### selectedIndices?

> `optional` **selectedIndices**: `Set`\<`number`\>

Defined in: [packages/ui/src/crud/list/crud-list.tsx:611](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L611)

***

### size?

> `optional` **size**: `"sm"` \| `"lg"` \| `"md"`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:640](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L640)

Cell padding size.

***

### slots?

> `optional` **slots**: [`ListTableSlots`](ListTableSlots.md)\<`T`\>

Defined in: [packages/ui/src/crud/list/crud-list.tsx:671](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L671)

Per-instance render overrides for the action cluster and empty state.

***

### sort?

> `optional` **sort**: [`SortState`](SortState.md) \| `null`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:605](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L605)

***

### stickyHeader?

> `optional` **stickyHeader**: `boolean`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:651](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L651)

Sticks the header row to the top of the nearest scrollable ancestor
(e.g. a page, dialog, or detail-pane body) once scrolling would hide it.
The table keeps its own horizontal scrollbar; the floating header scrolls
with its columns. Enabled by default; pass `false` to disable.

***

### variant?

> `optional` **variant**: `"default"` \| `"bordered"` \| `"striped"`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:638](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L638)

Table visual variant.
