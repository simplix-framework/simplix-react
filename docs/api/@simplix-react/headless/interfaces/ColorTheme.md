[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / ColorTheme

# Interface: ColorTheme

Defined in: [theme-manifest.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/theme-manifest.ts#L13)

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

> `optional` **fill**: `"plain"` \| `"outline"` \| `"raised"` \| `"tint"` \| `"lead"`

Defined in: [theme-manifest.ts:30](https://github.com/simplix-framework/simplix-react/blob/main/theme-manifest.ts#L30)

How summary cards are filled under this theme: `plain` white cards, `outline` borders only,
`raised` shadow without a border, `tint` an accent wash, `lead` the important card filled
with the accent. Absent keeps the design's own fill. Read by a design stylesheet through
`data-fill` on the document element.

***

### font?

> `optional` **font**: `string`

Defined in: [theme-manifest.ts:23](https://github.com/simplix-framework/simplix-react/blob/main/theme-manifest.ts#L23)

The typeface the theme sets, by family name; absent when it keeps the base face.

***

### group?

> `optional` **group**: `"calm"` \| `"bright"`

Defined in: [theme-manifest.ts:32](https://github.com/simplix-framework/simplix-react/blob/main/theme-manifest.ts#L32)

Which group a picker lists the theme under.

***

### label

> **label**: `string`

Defined in: [theme-manifest.ts:17](https://github.com/simplix-framework/simplix-react/blob/main/theme-manifest.ts#L17)

Human-readable picker label.

***

### primaryColor

> **primaryColor**: `string`

Defined in: [theme-manifest.ts:19](https://github.com/simplix-framework/simplix-react/blob/main/theme-manifest.ts#L19)

Light-mode `--primary` of this theme, for the picker swatch.

***

### radius?

> `optional` **radius**: `number`

Defined in: [theme-manifest.ts:21](https://github.com/simplix-framework/simplix-react/blob/main/theme-manifest.ts#L21)

The `--radius` the theme sets, in px; absent when it keeps the base radius.

***

### value

> **value**: `string`

Defined in: [theme-manifest.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/theme-manifest.ts#L15)

Identifier set as `data-color-theme` (`default` = no attribute / base).
