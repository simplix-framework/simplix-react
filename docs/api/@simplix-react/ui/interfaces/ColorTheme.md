[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ColorTheme

# Interface: ColorTheme

Defined in: [packages/headless/dist/index.d.ts:766](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L766)

Registry of the themes shipped by @simplix-react/ui. A theme sets colour, and may also set the
corner radius, the typeface and the card fill it was drawn with.

Pure data (no imports) so consumers can read it without pulling the
component barrel. The actual token values live in `theme/presets/*.css`
(and `theme/base.css` for the neutral `default`); each entry's
`primaryColor` mirrors that theme's light `--primary` for picker swatches.

`value` maps to the `data-color-theme` attribute. `default` carries no
attribute — it is the bare `:root` base; selecting it clears the attribute.

## Properties

### fill?

> `optional` **fill**: `"outline"` \| `"plain"` \| `"lead"` \| `"tint"` \| `"raised"`

Defined in: [packages/headless/dist/index.d.ts:783](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L783)

How summary cards are filled under this theme: `plain` white cards, `outline` borders only,
`raised` shadow without a border, `tint` an accent wash, `lead` the important card filled
with the accent. Absent keeps the design's own fill. Read by a design stylesheet through
`data-fill` on the document element.

***

### font?

> `optional` **font**: `string`

Defined in: [packages/headless/dist/index.d.ts:776](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L776)

The typeface the theme sets, by family name; absent when it keeps the base face.

***

### group?

> `optional` **group**: `"bright"` \| `"calm"`

Defined in: [packages/headless/dist/index.d.ts:785](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L785)

Which group a picker lists the theme under.

***

### label

> **label**: `string`

Defined in: [packages/headless/dist/index.d.ts:770](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L770)

Human-readable picker label.

***

### primaryColor

> **primaryColor**: `string`

Defined in: [packages/headless/dist/index.d.ts:772](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L772)

Light-mode `--primary` of this theme, for the picker swatch.

***

### radius?

> `optional` **radius**: `number`

Defined in: [packages/headless/dist/index.d.ts:774](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L774)

The `--radius` the theme sets, in px; absent when it keeps the base radius.

***

### value

> **value**: `string`

Defined in: [packages/headless/dist/index.d.ts:768](https://github.com/simplix-framework/simplix-react/blob/main/packages/headless/dist/index.d.ts#L768)

Identifier set as `data-color-theme` (`default` = no attribute / base).
