[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / someLanguageFilled

# Function: someLanguageFilled()

> **someLanguageFilled**(`map`): `boolean`

Defined in: [app/i18n-seed.ts:111](https://github.com/simplix-framework/simplix-react/blob/main/app/i18n-seed.ts#L111)

Whether some language carries a value, which is what makes a translated field a filled one.

<p><b>The rule a required multilingual field is held to.</b> `required` on the control refuses a
save whenever the strip is on a language nobody has translated yet, which is a language still to
fill rather than a save to block — so the mark follows the base language and the refusal asks
this instead. Asked without the locale list on purpose: a language outside the strip is still an
answer, and a record written before a language was added still has a name.

## Parameters

### map

the per-locale values as edited

`I18nMap` | `null` | `undefined`

## Returns

`boolean`

whether any language has one
