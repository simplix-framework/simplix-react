[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / daysUntilDay

# Function: daysUntilDay()

> **daysUntilDay**(`day`): `number` \| `null`

Defined in: [datetime/days-until.ts:43](https://github.com/simplix-framework/simplix-react/blob/main/datetime/days-until.ts#L43)

<b>This anchors on the app's zone and takes none, and its neighbours in this module take one.</b>
`zoneCalendarDate(zone, …)` and `zoneDayOf(zone, …)` honour whatever zone they are handed; this
one reads `getAppTimeZone()` and cannot be told otherwise. A caller holding a workplace's own
zone — which this console has, and shows in its status strip — can therefore mix the two in one
sentence and get an answer that is right on most days and a day out near midnight, with nothing
in a type or a build to say so.

<p>Where a call site has a zone of its own, say in a comment that it is the app's, or that the
two agree at that site. **A future caller passing a different one is what this note exists for**:
the signature offers it no way to be right.

## Parameters

### day

`string` | `null` | `undefined`

## Returns

`number` \| `null`
