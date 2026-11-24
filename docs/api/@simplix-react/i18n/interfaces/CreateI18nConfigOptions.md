[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / CreateI18nConfigOptions

# Interface: CreateI18nConfigOptions

Defined in: [create-i18n-config.ts:37](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L37)

Configures the [createI18nConfig](../functions/createI18nConfig.md) factory function.

## Properties

### appTranslations?

> `optional` **appTranslations**: `Record`\<`string`, `unknown`\>

Defined in: [create-i18n-config.ts:61](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L61)

Eagerly imported application translations, typically from `import.meta.glob`.

Keys should follow the pattern `/locales/{namespace}/{locale}.json`.

***

### debug?

> `optional` **debug**: `boolean`

Defined in: [create-i18n-config.ts:65](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L65)

Enables i18next debug logging.

***

### defaultLocale?

> `optional` **defaultLocale**: `string`

Defined in: [create-i18n-config.ts:39](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L39)

Initial locale to activate (defaults to `"en"`).

***

### detection?

> `optional` **detection**: `object`

Defined in: [create-i18n-config.ts:51](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L51)

Language detection configuration.

#### order

> **order**: (`"localStorage"` \| `"navigator"`)[]

#### storageKey?

> `optional` **storageKey**: `string`

localStorage key for persisting the selected locale (defaults to `"i18n:locale"`).

***

### fallbackLocale?

> `optional` **fallbackLocale**: `string`

Defined in: [create-i18n-config.ts:41](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L41)

Fallback locale for missing translations (defaults to `"en"`).

***

### moduleTranslations?

> `optional` **moduleTranslations**: [`ModuleTranslations`](ModuleTranslations.md)[]

Defined in: [create-i18n-config.ts:63](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L63)

Lazy-loadable module translation descriptors built via [buildModuleTranslations](../functions/buildModuleTranslations.md).

***

### supportedLocales?

> `optional` **supportedLocales**: (`string` \| [`LocaleConfig`](LocaleConfig.md))[]

Defined in: [create-i18n-config.ts:49](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L49)

Supported locale configurations (defaults to [DEFAULT\_LOCALES](../variables/DEFAULT_LOCALES.md)).

Accepts locale codes (`string`) or full [LocaleConfig](LocaleConfig.md) objects.
String codes are resolved against [DEFAULT\_LOCALES](../variables/DEFAULT_LOCALES.md); unrecognized
codes produce a minimal config with the code as both `name` and `englishName`.
