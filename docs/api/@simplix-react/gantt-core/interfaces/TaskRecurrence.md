[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / TaskRecurrence

# Interface: TaskRecurrence

Defined in: [packages/gantt-core/src/types.ts:122](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L122)

When a recurring task happens, and how long each occurrence takes.

## Properties

### count?

> `optional` **count**: `number`

Defined in: [packages/gantt-core/src/types.ts:135](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L135)

Number of occurrences.

***

### duration

> **duration**: `number`

Defined in: [packages/gantt-core/src/types.ts:137](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L137)

Working minutes each occurrence takes, and the unit it is shown in.

***

### durationUnit

> **durationUnit**: [`DurationUnit`](../type-aliases/DurationUnit.md)

Defined in: [packages/gantt-core/src/types.ts:138](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L138)

***

### frequency

> **frequency**: `"daily"` \| `"weekly"` \| `"monthly"`

Defined in: [packages/gantt-core/src/types.ts:123](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L123)

***

### from

> **from**: `number`

Defined in: [packages/gantt-core/src/types.ts:131](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L131)

First day considered.

***

### interval

> **interval**: `number`

Defined in: [packages/gantt-core/src/types.ts:125](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L125)

Every `interval`-th day, week or month.

***

### monthDay?

> `optional` **monthDay**: `number`

Defined in: [packages/gantt-core/src/types.ts:129](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L129)

Day of the month of a monthly recurrence. A month without that day is skipped.

***

### until?

> `optional` **until**: `number`

Defined in: [packages/gantt-core/src/types.ts:133](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L133)

Last day considered. One of `until` and `count` is required.

***

### weekdays?

> `optional` **weekdays**: readonly `number`[]

Defined in: [packages/gantt-core/src/types.ts:127](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L127)

Weekdays of a weekly recurrence, 0 for Sunday.
