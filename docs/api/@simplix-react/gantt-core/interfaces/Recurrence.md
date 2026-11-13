[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / Recurrence

# Interface: Recurrence

Defined in: [packages/gantt-core/src/edit-extras.ts:111](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L111)

When a recurring task happens.

## Properties

### count?

> `optional` **count**: `number`

Defined in: [packages/gantt-core/src/edit-extras.ts:124](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L124)

Number of occurrences.

***

### frequency

> **frequency**: `"daily"` \| `"weekly"` \| `"monthly"`

Defined in: [packages/gantt-core/src/edit-extras.ts:112](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L112)

***

### from

> **from**: `number`

Defined in: [packages/gantt-core/src/edit-extras.ts:120](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L120)

First day considered.

***

### interval

> **interval**: `number`

Defined in: [packages/gantt-core/src/edit-extras.ts:114](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L114)

Every `interval`-th day, week or month.

***

### monthDay?

> `optional` **monthDay**: `number`

Defined in: [packages/gantt-core/src/edit-extras.ts:118](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L118)

Day of the month of a monthly recurrence. A month without that day is skipped.

***

### until?

> `optional` **until**: `number`

Defined in: [packages/gantt-core/src/edit-extras.ts:122](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L122)

Last day considered. One of `until` and `count` is required.

***

### weekdays?

> `optional` **weekdays**: readonly `number`[]

Defined in: [packages/gantt-core/src/edit-extras.ts:116](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/edit-extras.ts#L116)

Weekdays of a weekly recurrence, 0 for Sunday.
