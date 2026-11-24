[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / pickedCalendarDay

# Function: pickedCalendarDay()

> **pickedCalendarDay**(`value`): `string` \| `undefined`

Defined in: [datetime/zone-bounds.ts:231](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-bounds.ts#L231)

The calendar day a date picker answered with, as `yyyy-MM-dd`.

## Parameters

### value

what the picker answered with

`Date` | `null` | `undefined`

## Returns

`string` \| `undefined`

that day as `yyyy-MM-dd`, or undefined where nothing was picked

## Remarks

From the `Date`'s own fields, because a picker builds local midnight of the day the operator
pressed — so the day IS those fields, and reading it in any other zone moves it. This is the one
place a display zone is the wrong answer: [zoneCalendarDate](zoneCalendarDate.md) here would hand back
yesterday for an operator whose browser sits east of the workplace, and the record would keep a
day nobody picked.

<p>For a field the server types as an instant rather than a calendar day, the conversion is
[zoneDayStartInstant](zoneDayStartInstant.md) instead.
