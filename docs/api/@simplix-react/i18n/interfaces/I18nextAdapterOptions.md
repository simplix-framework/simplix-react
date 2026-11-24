[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / I18nextAdapterOptions

# Interface: I18nextAdapterOptions

Defined in: [i18next-adapter.ts:38](https://github.com/simplix-framework/simplix-react/blob/main/i18next-adapter.ts#L38)

Configures the [I18nextAdapter](../classes/I18nextAdapter.md) constructor.

## Properties

### debug?

> `optional` **debug**: `boolean`

Defined in: [i18next-adapter.ts:50](https://github.com/simplix-framework/simplix-react/blob/main/i18next-adapter.ts#L50)

Enables i18next debug logging.

***

### defaultLocale?

> `optional` **defaultLocale**: `string`

Defined in: [i18next-adapter.ts:40](https://github.com/simplix-framework/simplix-react/blob/main/i18next-adapter.ts#L40)

Initial locale to use (defaults to `"en"`).

***

### fallbackLocale?

> `optional` **fallbackLocale**: `string`

Defined in: [i18next-adapter.ts:42](https://github.com/simplix-framework/simplix-react/blob/main/i18next-adapter.ts#L42)

Fallback locale when a key is missing (defaults to `"en"`).

***

### i18nextInstance?

> `optional` **i18nextInstance**: `i18n`

Defined in: [i18next-adapter.ts:48](https://github.com/simplix-framework/simplix-react/blob/main/i18next-adapter.ts#L48)

An existing i18next instance to reuse instead of creating a new one.

***

### locales?

> `optional` **locales**: [`LocaleConfig`](LocaleConfig.md)[]

Defined in: [i18next-adapter.ts:44](https://github.com/simplix-framework/simplix-react/blob/main/i18next-adapter.ts#L44)

Supported locale configurations.

***

### resources?

> `optional` **resources**: [`TranslationResources`](../type-aliases/TranslationResources.md)

Defined in: [i18next-adapter.ts:46](https://github.com/simplix-framework/simplix-react/blob/main/i18next-adapter.ts#L46)

Pre-loaded translation resources.
