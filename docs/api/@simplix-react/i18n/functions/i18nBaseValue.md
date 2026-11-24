[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / i18nBaseValue

# Function: i18nBaseValue()

> **i18nBaseValue**(`map`, `languages`): `string`

Defined in: [app/i18n-seed.ts:86](https://github.com/simplix-framework/simplix-react/blob/main/app/i18n-seed.ts#L86)

The value a record's base column takes when its language entries are saved.

<p>The fallback language if the operator filled it, else the first language they did, so the
column a surface falls back to — and the column an export or a snapshot copies — holds a name
rather than nothing. The CRUD forms get this from the framework's submit helper; a screen that
writes its row without one calls this instead of picking a language of its own.

## Parameters

### map

the per-locale values as edited

`I18nMap` | `null` | `undefined`

### languages

[`LocaleConfig`](../interfaces/LocaleConfig.md)[]

the locales the form offers, in the order it offers them

## Returns

`string`

the value for the base column, empty when no language was filled
