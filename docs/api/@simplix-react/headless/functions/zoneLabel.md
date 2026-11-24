[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / zoneLabel

# Function: zoneLabel()

> **zoneLabel**(`timeZone`, `at`): `string`

Defined in: [datetime/browser-zone-label.ts:59](https://github.com/simplix-framework/simplix-react/blob/main/datetime/browser-zone-label.ts#L59)

The short name of a named zone, in the reader's language.

<p>The workplace's zone rather than the browser's. Every date, deadline and 「오늘」 on a console
screen is read in the workplace's zone (design 8.6), and the operator reading it is often not in
that zone, as a supervisor in Seoul is looking at a site in Hai Phong. Naming it in the status strip
is what stops a deadline being read eight hours out.

<p>Taken from the platform for the same reason [browserZoneLabel](browserZoneLabel.md) is: what is short and
unambiguous differs by zone and by language, and a hand-kept table is wrong for whichever zone
nobody thought of.

## Parameters

### timeZone

`string`

the IANA identifier, e.g. `Asia/Seoul`

### at

`Date`

the instant being labelled; the answer differs across a daylight-saving boundary

## Returns

`string`

the zone's short name, or the identifier itself when this runtime will not name it
