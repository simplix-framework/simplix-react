[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / Project

# Interface: Project

Defined in: [packages/gantt-core/src/types.ts:206](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L206)

## Properties

### assignments

> **assignments**: readonly [`Assignment`](Assignment.md)[]

Defined in: [packages/gantt-core/src/types.ts:235](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L235)

***

### baselines

> **baselines**: `Readonly`\<`Record`\<`number`, [`Baseline`](../type-aliases/Baseline.md)\>\>

Defined in: [packages/gantt-core/src/types.ts:237](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L237)

Saved baselines by number, 0 to 10.

***

### calendarId

> **calendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:215](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L215)

***

### calendars

> **calendars**: readonly [`WorkCalendar`](WorkCalendar.md)[]

Defined in: [packages/gantt-core/src/types.ts:231](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L231)

***

### criticalSlackLimit

> **criticalSlackLimit**: `number`

Defined in: [packages/gantt-core/src/types.ts:224](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L224)

A task with total slack at or under this many working minutes is critical.

***

### currencyCode?

> `optional` **currencyCode**: `string`

Defined in: [packages/gantt-core/src/types.ts:241](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L241)

ISO 4217 code of the currency costs are in, such as `KRW`. Costs show as plain numbers without one.

***

### customFields?

> `optional` **customFields**: readonly [`CustomField`](CustomField.md)[]

Defined in: [packages/gantt-core/src/types.ts:239](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L239)

Fields the plan adds to its tasks.

***

### daysPerMonth

> **daysPerMonth**: `number`

Defined in: [packages/gantt-core/src/types.ts:219](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L219)

***

### defaultFinishTime

> **defaultFinishTime**: `number`

Defined in: [packages/gantt-core/src/types.ts:222](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L222)

***

### defaultStartTime

> **defaultStartTime**: `number`

Defined in: [packages/gantt-core/src/types.ts:221](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L221)

Minutes after midnight a date typed without a time starts and ends at.

***

### finish?

> `optional` **finish**: `number`

Defined in: [packages/gantt-core/src/types.ts:212](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L212)

Required when `scheduleFrom` is `finish`.

***

### honorConstraints

> **honorConstraints**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:230](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L230)

When true a must-start-on, must-finish-on, start-no-later-than or
finish-no-later-than date wins over a link that needs a later date, and
the link is reported as violated. When false the link wins.

***

### links

> **links**: readonly [`Link`](Link.md)[]

Defined in: [packages/gantt-core/src/types.ts:233](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L233)

***

### minutesPerDay

> **minutesPerDay**: `number`

Defined in: [packages/gantt-core/src/types.ts:217](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L217)

Working minutes a duration of one day, one week and one month stand for.

***

### minutesPerWeek

> **minutesPerWeek**: `number`

Defined in: [packages/gantt-core/src/types.ts:218](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L218)

***

### name

> **name**: `string`

Defined in: [packages/gantt-core/src/types.ts:207](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L207)

***

### resources

> **resources**: readonly [`Resource`](Resource.md)[]

Defined in: [packages/gantt-core/src/types.ts:234](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L234)

***

### scheduleFrom

> **scheduleFrom**: `"start"` \| `"finish"`

Defined in: [packages/gantt-core/src/types.ts:209](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L209)

Schedules forward from `start`, or backward from `finish`.

***

### start

> **start**: `number`

Defined in: [packages/gantt-core/src/types.ts:210](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L210)

***

### statusDate?

> `optional` **statusDate**: `number`

Defined in: [packages/gantt-core/src/types.ts:214](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L214)

Progress is reported as of this instant.

***

### tasks

> **tasks**: readonly [`Task`](Task.md)[]

Defined in: [packages/gantt-core/src/types.ts:232](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L232)
