[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / TaskSchedule

# Interface: TaskSchedule

Defined in: [packages/gantt-core/src/types.ts:283](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L283)

Computed dates of one task.

## Properties

### calendarId

> **calendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:310](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L310)

Calendar the dates were computed on.

***

### critical

> **critical**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:306](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L306)

***

### duration

> **duration**: `number`

Defined in: [packages/gantt-core/src/types.ts:297](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L297)

Working minutes of work between start and finish, pauses left out; clock minutes for an elapsed task.

***

### earlyFinish

> **earlyFinish**: `number`

Defined in: [packages/gantt-core/src/types.ts:299](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L299)

***

### earlyStart

> **earlyStart**: `number`

Defined in: [packages/gantt-core/src/types.ts:298](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L298)

***

### finish

> **finish**: `number`

Defined in: [packages/gantt-core/src/types.ts:293](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L293)

***

### freeSlack

> **freeSlack**: `number`

Defined in: [packages/gantt-core/src/types.ts:305](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L305)

Working minutes the task can slip without moving any successor.

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:284](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L284)

***

### index

> **index**: `number`

Defined in: [packages/gantt-core/src/types.ts:286](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L286)

Row position in `Project.tasks`.

***

### lateFinish

> **lateFinish**: `number`

Defined in: [packages/gantt-core/src/types.ts:301](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L301)

***

### lateStart

> **lateStart**: `number`

Defined in: [packages/gantt-core/src/types.ts:300](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L300)

***

### milestone

> **milestone**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:291](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L291)

***

### parentId

> **parentId**: `string` \| `null`

Defined in: [packages/gantt-core/src/types.ts:287](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L287)

***

### percentComplete

> **percentComplete**: `number`

Defined in: [packages/gantt-core/src/types.ts:308](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L308)

Own value for a task; duration-weighted over the tasks under a summary.

***

### segments

> **segments**: readonly `object`[]

Defined in: [packages/gantt-core/src/types.ts:295](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L295)

The stretches the task works in: one, or one more than it has splits.

***

### start

> **start**: `number`

Defined in: [packages/gantt-core/src/types.ts:292](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L292)

***

### summary

> **summary**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:290](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L290)

***

### totalSlack

> **totalSlack**: `number`

Defined in: [packages/gantt-core/src/types.ts:303](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L303)

Working minutes the task can slip without moving the project's end. Negative when a late date is already missed.

***

### wbs

> **wbs**: `string`

Defined in: [packages/gantt-core/src/types.ts:289](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L289)

Outline number, such as `1.2.3`.
