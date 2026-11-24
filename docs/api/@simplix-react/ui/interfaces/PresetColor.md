[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / PresetColor

# Interface: PresetColor

Defined in: [packages/ui/src/base/inputs/color-picker.tsx:34](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/color-picker.tsx#L34)

A preset color entry for the color picker palette.

## Properties

### key?

> `optional` **key**: `string`

Defined in: [packages/ui/src/base/inputs/color-picker.tsx:41](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/color-picker.tsx#L41)

Locale key for the color name (e.g. `"red"`). When provided the localized name
is resolved via the active locale; otherwise [PresetColor.name](#name) is shown.

***

### name

> **name**: `string`

Defined in: [packages/ui/src/base/inputs/color-picker.tsx:43](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/color-picker.tsx#L43)

Fallback name when [PresetColor.key](#key) is absent or unresolved.

***

### value

> **value**: `string`

Defined in: [packages/ui/src/base/inputs/color-picker.tsx:36](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/inputs/color-picker.tsx#L36)

Hex color value (e.g. `"#EF4444"`).
