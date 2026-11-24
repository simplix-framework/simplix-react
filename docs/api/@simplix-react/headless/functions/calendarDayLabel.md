[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / calendarDayLabel

# Function: calendarDayLabel()

> **calendarDayLabel**(`day`, `locale`, `style?`): `string`

Defined in: [datetime/zone-bounds.ts:203](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-bounds.ts#L203)

A calendar day as a person says it, with its weekday.

## Parameters

### day

`string`

the calendar day, as `yyyy-MM-dd`

### locale

`string`

the reader's locale

### style?

[`CalendarDayStyle`](../type-aliases/CalendarDayStyle.md) = `"long"`

`long` for a day named inside a sentence, `iso` for the date itself

## Returns

`string`

the day and its weekday, or the empty string when the day is malformed

## Remarks

Read from the string's own components and never through an instant: a calendar day has no time
and no zone, and parsing one into a `Date` to format it moves it a day either way for half the
world. Which is why this takes the day rather than the moment — a caller holding an instant asks
[zoneCalendarDate](zoneCalendarDate.md) for its day first, and the zone is named once, there.

<p>The locale composes `long` itself, including where the weekday sits and whether it is bracketed
— 「8월 27일 (목)」 against `Thu, August 27`. Only `iso` is assembled here, because the date half
of it is the input unchanged.
