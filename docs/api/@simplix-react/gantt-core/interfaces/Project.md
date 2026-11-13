[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / Project

# Interface: Project

Defined in: [packages/gantt-core/src/types.ts:189](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L189)

## Properties

### assignments

> **assignments**: readonly [`Assignment`](Assignment.md)[]

Defined in: [packages/gantt-core/src/types.ts:218](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L218)

***

### baselines

> **baselines**: `Readonly`\<`Record`\<`number`, [`Baseline`](../type-aliases/Baseline.md)\>\>

Defined in: [packages/gantt-core/src/types.ts:220](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L220)

Saved baselines by number, 0 to 10.

***

### calendarId

> **calendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:198](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L198)

***

### calendars

> **calendars**: readonly [`WorkCalendar`](WorkCalendar.md)[]

Defined in: [packages/gantt-core/src/types.ts:214](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L214)

***

### criticalSlackLimit

> **criticalSlackLimit**: `number`

Defined in: [packages/gantt-core/src/types.ts:207](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L207)

A task with total slack at or under this many working minutes is critical.

***

### customFields?

> `optional` **customFields**: readonly [`CustomField`](CustomField.md)[]

Defined in: [packages/gantt-core/src/types.ts:222](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L222)

Fields the plan adds to its tasks.

***

### daysPerMonth

> **daysPerMonth**: `number`

Defined in: [packages/gantt-core/src/types.ts:202](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L202)

***

### defaultFinishTime

> **defaultFinishTime**: `number`

Defined in: [packages/gantt-core/src/types.ts:205](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L205)

***

### defaultStartTime

> **defaultStartTime**: `number`

Defined in: [packages/gantt-core/src/types.ts:204](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L204)

Minutes after midnight a date typed without a time starts and ends at.

***

### finish?

> `optional` **finish**: `number`

Defined in: [packages/gantt-core/src/types.ts:195](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L195)

Required when `scheduleFrom` is `finish`.

***

### honorConstraints

> **honorConstraints**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:213](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L213)

When true a must-start-on, must-finish-on, start-no-later-than or
finish-no-later-than date wins over a link that needs a later date, and
the link is reported as violated. When false the link wins.

***

### links

> **links**: readonly [`Link`](Link.md)[]

Defined in: [packages/gantt-core/src/types.ts:216](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L216)

***

### minutesPerDay

> **minutesPerDay**: `number`

Defined in: [packages/gantt-core/src/types.ts:200](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L200)

Working minutes a duration of one day, one week and one month stand for.

***

### minutesPerWeek

> **minutesPerWeek**: `number`

Defined in: [packages/gantt-core/src/types.ts:201](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L201)

***

### name

> **name**: `string`

Defined in: [packages/gantt-core/src/types.ts:190](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L190)

***

### resources

> **resources**: readonly [`Resource`](Resource.md)[]

Defined in: [packages/gantt-core/src/types.ts:217](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L217)

***

### scheduleFrom

> **scheduleFrom**: `"start"` \| `"finish"`

Defined in: [packages/gantt-core/src/types.ts:192](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L192)

Schedules forward from `start`, or backward from `finish`.

***

### start

> **start**: `number`

Defined in: [packages/gantt-core/src/types.ts:193](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L193)

***

### statusDate?

> `optional` **statusDate**: `number`

Defined in: [packages/gantt-core/src/types.ts:197](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L197)

Progress is reported as of this instant.

***

### tasks

> **tasks**: readonly [`Task`](Task.md)[]

Defined in: [packages/gantt-core/src/types.ts:215](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L215)
