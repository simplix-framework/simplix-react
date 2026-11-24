[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / browserZoneLabel

# Function: browserZoneLabel()

> **browserZoneLabel**(`at`): `string`

Defined in: [datetime/browser-zone-label.ts:27](https://github.com/simplix-framework/simplix-react/blob/main/datetime/browser-zone-label.ts#L27)

The short name this runtime gives the browser's own zone, in the reader's language.

<p>Taken from the platform rather than from a table of abbreviations: what is short and
unambiguous differs by zone and by language: `EDT` in New York, `UTC+9` in Seoul, where no
short abbreviation exists in the reader's locale. A hand-kept table would be wrong for
whichever zone nobody thought of.

## Parameters

### at

`Date`

the instant being labelled; the answer differs across a daylight-saving boundary,
       so the label belongs to the moment rather than to the zone

## Returns

`string`

the zone's short name, or an empty string when this runtime will not name it
