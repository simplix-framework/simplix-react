[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / i18nFallbackText

# Function: i18nFallbackText()

> **i18nFallbackText**(`map`, `languages`): `string`

Defined in: [app/i18n-seed.ts:67](https://github.com/simplix-framework/simplix-react/blob/main/app/i18n-seed.ts#L67)

What a reader whose language this record has no entry for will actually see.

<p>Both halves of the product fall back the same way — the server resolves a locale map
against the base column, and the base column holds the fallback language when it was filled — so a
language left blank is not blank on screen: it shows this. Shown as the field's placeholder,
it answers the question an empty language tab otherwise leaves open.

## Parameters

### map

the per-locale values as edited

`I18nMap` | `null` | `undefined`

### languages

[`LocaleConfig`](../interfaces/LocaleConfig.md)[]

the locales the form offers, in the order it offers them

## Returns

`string`

the text an unfilled language falls back to, empty when nothing is filled
