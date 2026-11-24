[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / StatCardProps

# Interface: StatCardProps

Defined in: [packages/ui/src/base/charts/stat-card.tsx:20](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L20)

## Properties

### chart?

> `optional` **chart**: `ReactNode`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:51](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L51)

The shape behind the figure, drawn in the card's reserved right-hand region.

<p>The region is held whether or not this is set, so a tile that plots and a tile that does
not are the same component rather than two that happen to resemble each other, and the figures
down a row of them stay in one column.

***

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:59](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L59)

Optional content rendered below the value/description block.

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:43](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L43)

Extra classes merged onto the card root.

***

### description?

> `optional` **description**: `ReactNode`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L31)

Optional supporting text below the value; a node so a caller can set parts of it apart.

***

### headerExtra?

> `optional` **headerExtra**: `ReactNode`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:35](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L35)

Extra content rendered next to the title (e.g. a badge).

***

### highlighted?

> `optional` **highlighted**: `boolean`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:41](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L41)

When true (and `tone` is set), tints the card surface with the tone instead of the default card background.

***

### icon?

> `optional` **icon**: `ReactNode`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L33)

Optional icon rendered in the header's trailing slot.

***

### loading?

> `optional` **loading**: `boolean`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:57](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L57)

Whether the figure is still being read. The figure is replaced by a placeholder of the same
height, and the plot and the lines under it keep their room but are not drawn, so the card
does not change size when the reading arrives.

***

### title

> **title**: `string`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L22)

Card title shown above the value.

***

### tone?

> `optional` **tone**: [`StatusTone`](../type-aliases/StatusTone.md)

Defined in: [packages/ui/src/base/charts/stat-card.tsx:39](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L39)

Status tone for the soft surface tint; only applied when `highlighted` is true.

***

### trend?

> `optional` **trend**: `object`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:37](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L37)

Optional trend indicator; non-negative values render in the success tone, negative in danger.

#### label?

> `optional` **label**: `string`

#### value

> **value**: `number`

***

### unit?

> `optional` **unit**: `ReactNode`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L29)

The unit the figure is counted in, drawn beside the value as its own element so a design can
set it smaller than the figure. Classic draws it in the figure's own type.

***

### value

> **value**: `ReactNode`

Defined in: [packages/ui/src/base/charts/stat-card.tsx:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/charts/stat-card.tsx#L24)

Primary metric value; a node lets a caller draw it with `DigitRoll`.
