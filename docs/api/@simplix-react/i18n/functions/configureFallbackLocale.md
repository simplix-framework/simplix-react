[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / configureFallbackLocale

# Function: configureFallbackLocale()

> **configureFallbackLocale**(`locale`): `void`

Defined in: [app/app-locale.ts:42](https://github.com/simplix-framework/simplix-react/blob/main/app/app-locale.ts#L42)

Install the deployment's fallback language.

<p>Call once at startup from the site settings. Every [useFallbackLocale](useFallbackLocale.md) consumer
re-renders; the non-hook readers pick it up on their next call, which for a form is the next
time it opens. A blank or nullish value clears back to [DEFAULT\_FALLBACK\_LOCALE](../variables/DEFAULT_FALLBACK_LOCALE.md).

## Parameters

### locale

the language code the deployment chose, e.g. `ko`

`string` | `null` | `undefined`

## Returns

`void`
