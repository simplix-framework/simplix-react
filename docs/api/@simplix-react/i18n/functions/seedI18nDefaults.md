[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / seedI18nDefaults

# Function: seedI18nDefaults()

> **seedI18nDefaults**(`map`, `base`, `languages`): `I18nMap`

Defined in: [app/i18n-seed.ts:44](https://github.com/simplix-framework/simplix-react/blob/main/app/i18n-seed.ts#L44)

The per-locale map an edit form should open with.

<p>A record written before its screen grew language tabs — or through any path that only ever
filled the base column — carries a name and an empty map. Handing that map to an i18n field
renders every tab blank, so the operator sees a required field with nothing in it under a
header naming the very value that is missing, and a save either wipes the name or is refused.

<p>The base value is therefore seeded into the language a record falls back to, which is the
language the server resolves to when the reader's has no entry. A map that already holds
anything is left exactly as it is — the record has said what it means.

## Parameters

### map

the record's per-locale values, possibly absent or empty

`I18nMap` | `null` | `undefined`

### base

the record's base column value

`string` | `null` | `undefined`

### languages

[`LocaleConfig`](../interfaces/LocaleConfig.md)[]

the locales the form offers, in the order it offers them

## Returns

`I18nMap`

the map to edit
