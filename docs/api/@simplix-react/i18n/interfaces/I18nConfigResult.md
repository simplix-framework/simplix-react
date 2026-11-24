[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / I18nConfigResult

# Interface: I18nConfigResult

Defined in: [create-i18n-config.ts:71](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L71)

Represents the result of [createI18nConfig](../functions/createI18nConfig.md).

## Properties

### adapter

> **adapter**: [`I18nextAdapter`](../classes/I18nextAdapter.md)

Defined in: [create-i18n-config.ts:73](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L73)

The configured i18next adapter instance.

***

### i18nReady

> **i18nReady**: `Promise`\<`void`\>

Defined in: [create-i18n-config.ts:75](https://github.com/simplix-framework/simplix-react/blob/main/create-i18n-config.ts#L75)

A promise that resolves when all translations (including module translations) are loaded.
