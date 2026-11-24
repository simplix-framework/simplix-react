[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ListColumnProps

# Interface: ListColumnProps\<T\>

Defined in: [packages/ui/src/crud/list/crud-list.tsx:463](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L463)

Declarative column definition for List.Table. Not rendered directly.

## Type Parameters

### T

`T`

## Properties

### align?

> `optional` **align**: `"end"` \| `"start"`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:550](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L550)

Where the header and the cells set their content. `"end"` is for a figure whose digits a reader
compares down the column (an amount, a balance, a count): it sits against the end edge in
tabular numerals, so the place values line up. Absent, the content starts at the start edge.

***

### children()?

> `optional` **children**: (`props`) => `ReactNode`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:574](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L574)

#### Parameters

##### props

###### row

`T`

###### value

`unknown`

#### Returns

`ReactNode`

***

### display?

> `optional` **display**: `"boolean"` \| `"badge"` \| `"phone"` \| `"country"`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:551](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L551)

***

### displayZone?

> `optional` **displayZone**: `string` \| (`row`) => `string` \| `undefined`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:560](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L560)

IANA display zone for `format="datetime"` cells. A string applies one zone to
every row (a screen pinned to one site); a function resolves the zone per row
(mixed-site lists, e.g. `(row) => zoneOf(row.siteId)`). Returning `undefined`
falls back to the browser zone. Ignored by `date` / `time` / `relative`
formats — those are zone-neutral by kind.

***

### enumLabel()?

> `optional` **enumLabel**: (`enumName`, `value`) => `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:573](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L573)

Translates an enum constant — pass the entity translation's `enumLabel`.
Without it (or without `enumName`) the badge falls back to the raw value,
which is a constant like `IN_TRANSIT` rather than anything an operator reads.

#### Parameters

##### enumName

`string`

##### value

`string`

#### Returns

`string`

***

### enumName?

> `optional` **enumName**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:567](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L567)

Enum this column's values belong to, e.g. `"OrderStatus"`. Paired with
`enumLabel`, a `display="badge"` cell shows the translated label instead of
the constant the API sends.

***

### field?

> `optional` **field**: keyof `T` & `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:464](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L464)

***

### fitContent?

> `optional` **fitContent**: `boolean`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:544](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L544)

The cells draw their content whole: a badge, a chip, a control. The declared `width` becomes a
floor, the cell never truncates, and a value wider than the floor widens the column instead of
being cut. A table that then outgrows its container drops its widest tier, and with no tier
left it scrolls sideways. On by default for a column drawn with `display="badge"` or
`display="boolean"`.

***

### format?

> `optional` **format**: `"date"` \| `"time"` \| `"relative"` \| `"datetime"`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:552](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L552)

***

### header?

> `optional` **header**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:473](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L473)

***

### id?

> `optional` **id**: `string`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:472](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L472)

What tells a column with no `field` apart: the columns menu lists it, and a width the reader
sets is kept under it. A column with a `field` is known by that and needs none.

Without one, a computed column (a cell built from several fields) has no stable identity: its
position changes whenever a narrower pane drops a column before it, so the menu cannot name it.

***

### minTableWidth?

> `optional` **minTableWidth**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:536](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L536)

The narrowest table this column is worth drawing in, in pixels. Below it the column is not
rendered at all — no header, no cells, and no entry in the columns dropdown.

<p><b>The width measured is the table's own, not the window's.</b> A list screen loses most of
its width the moment a detail opens beside it, and that is exactly when a column has to go: a
table that fits at 1400px scrolls sideways at 520px, and a horizontal scrollbar under a list is
a column the reader has to go looking for. Omit the prop and the column is always drawn, which
is what every column did before this existed.

<p><b>Only put it on a column whose value the detail panel also shows.</b> A column that
disappears takes its value with it, and the reader has no way to ask for it back — there is no
「show anyway」. The arrangement only works because the thing that took the width is the panel
that carries the value: open the record and it is there. A value that lives nowhere else stays
in the table however narrow it gets.

<p><b>Not a card-mode control.</b> Below `cardBreakpoint` the table becomes cards drawn by
`cardTitle` / `cardContent`, where there are no columns to drop; this decides what the table
holds while it is still a table. The two thresholds are read against the same measurement, so
a `minTableWidth` below `cardBreakpoint` can never fire.

<p><b>The number is a floor and an order, not the whole answer.</b> Columns sharing one value
are dropped together, and a larger value is dropped first. The width a set really needs depends
on cell padding, the row-action column and the header labels, none of which the declaring
screen can see, so the list measures the drawn table: when it is wider than its container, the
tier with the largest value is raised to the measured width and drops. A threshold below what
its columns need therefore never draws a table that scrolls sideways.

***

### minWidth?

> `optional` **minWidth**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:507](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L507)

The column's floor in pixels, rather than its whole allowance: it never
renders narrower than this, and it takes a share of whatever width the
table has left over. The cell stops contributing its own content to the
table's intrinsic width, so long values ellipsize instead of widening the
column, and a table with room to spare spends that room here.

Use this where the value is free text of unpredictable length — a summary,
a target, a description. Use [width](#width) instead where the column holds
something of known size and extra room would only be padding.

The cell's own content must fill the cell for the extra width to be
visible: render it as a block that truncates (`className="block truncate"`)
and give it no width of its own. Ignored when [width](#width) is also set.

***

### required?

> `optional` **required**: `boolean`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:483](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L483)

Marks the header with the required asterisk, for an editable column whose cells the user
has to fill before the row can be saved.

The cells of such a column are edited in place — usually by a `compact` field, which has no
label row of its own — so the column header is the only place the requirement can be stated.
Setting this does not validate anything: the form still decides what a missing value means,
and the cell's own `error` reports it.

***

### sortable?

> `optional` **sortable**: `boolean`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:484](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L484)

***

### variants?

> `optional` **variants**: `Record`\<`string`, `"default"` \| `"success"` \| `"warning"` \| `"outline"` \| `"blue"` \| `"cyan"` \| `"fuchsia"` \| `"green"` \| `"indigo"` \| `"lime"` \| `"orange"` \| `"pink"` \| `"purple"` \| `"red"` \| `"teal"` \| `"violet"` \| `"yellow"` \| `"destructive"` \| `"secondary"` \| `"slate"` \| `"amber"` \| `"emerald"` \| `"sky"` \| `"rose"` \| `null` \| `undefined`\>

Defined in: [packages/ui/src/crud/list/crud-list.tsx:561](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L561)

***

### width?

> `optional` **width**: `number`

Defined in: [packages/ui/src/crud/list/crud-list.tsx:491](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/crud-list.tsx#L491)

Column content width in pixels. Also sizes the header box, so a header
longer than the width ellipsizes (full text in a tooltip) instead of
stretching the column. The cell's horizontal padding sits outside this
width, and on a sortable column the sort icon shares it with the label.
