[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / Project

# Interface: Project

Defined in: [packages/gantt-core/src/types.ts:230](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L230)

## Properties

### assignments

> **assignments**: readonly [`Assignment`](Assignment.md)[]

Defined in: [packages/gantt-core/src/types.ts:259](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L259)

***

### baselines

> **baselines**: `Readonly`\<`Record`\<`number`, [`Baseline`](../type-aliases/Baseline.md)\>\>

Defined in: [packages/gantt-core/src/types.ts:261](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L261)

Saved baselines by number, 0 to 10.

***

### calendarId

> **calendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:239](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L239)

***

### calendars

> **calendars**: readonly [`WorkCalendar`](WorkCalendar.md)[]

Defined in: [packages/gantt-core/src/types.ts:255](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L255)

***

### criticalSlackLimit

> **criticalSlackLimit**: `number`

Defined in: [packages/gantt-core/src/types.ts:248](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L248)

A task with total slack at or under this many working minutes is critical.

***

### currencyCode?

> `optional` **currencyCode**: `string`

Defined in: [packages/gantt-core/src/types.ts:265](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L265)

ISO 4217 code of the currency costs are in, such as `KRW`. Costs show as plain numbers without one.

***

### customFields?

> `optional` **customFields**: readonly [`CustomField`](CustomField.md)[]

Defined in: [packages/gantt-core/src/types.ts:263](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L263)

Fields the plan adds to its tasks.

***

### daysPerMonth

> **daysPerMonth**: `number`

Defined in: [packages/gantt-core/src/types.ts:243](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L243)

***

### defaultFinishTime

> **defaultFinishTime**: `number`

Defined in: [packages/gantt-core/src/types.ts:246](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L246)

***

### defaultStartTime

> **defaultStartTime**: `number`

Defined in: [packages/gantt-core/src/types.ts:245](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L245)

Minutes after midnight a date typed without a time starts and ends at.

***

### finish?

> `optional` **finish**: `number`

Defined in: [packages/gantt-core/src/types.ts:236](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L236)

Required when `scheduleFrom` is `finish`.

***

### honorConstraints

> **honorConstraints**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:254](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L254)

When true a must-start-on, must-finish-on, start-no-later-than or
finish-no-later-than date wins over a link that needs a later date, and
the link is reported as violated. When false the link wins.

***

### links

> **links**: readonly [`Link`](Link.md)[]

Defined in: [packages/gantt-core/src/types.ts:257](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L257)

***

### minutesPerDay

> **minutesPerDay**: `number`

Defined in: [packages/gantt-core/src/types.ts:241](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L241)

Working minutes a duration of one day, one week and one month stand for.

***

### minutesPerWeek

> **minutesPerWeek**: `number`

Defined in: [packages/gantt-core/src/types.ts:242](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L242)

***

### name

> **name**: `string`

Defined in: [packages/gantt-core/src/types.ts:231](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L231)

***

### resources

> **resources**: readonly [`Resource`](Resource.md)[]

Defined in: [packages/gantt-core/src/types.ts:258](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L258)

***

### scheduleFrom

> **scheduleFrom**: `"start"` \| `"finish"`

Defined in: [packages/gantt-core/src/types.ts:233](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L233)

Schedules forward from `start`, or backward from `finish`.

***

### start

> **start**: `number`

Defined in: [packages/gantt-core/src/types.ts:234](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L234)

***

### statusDate?

> `optional` **statusDate**: `number`

Defined in: [packages/gantt-core/src/types.ts:238](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L238)

Progress is reported as of this instant.

***

### tasks

> **tasks**: readonly [`Task`](Task.md)[]

Defined in: [packages/gantt-core/src/types.ts:256](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L256)
