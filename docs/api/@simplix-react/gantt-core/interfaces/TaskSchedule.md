[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / TaskSchedule

# Interface: TaskSchedule

Defined in: [packages/gantt-core/src/types.ts:259](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L259)

Computed dates of one task.

## Properties

### calendarId

> **calendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:286](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L286)

Calendar the dates were computed on.

***

### critical

> **critical**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:282](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L282)

***

### duration

> **duration**: `number`

Defined in: [packages/gantt-core/src/types.ts:273](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L273)

Working minutes of work between start and finish, pauses left out; clock minutes for an elapsed task.

***

### earlyFinish

> **earlyFinish**: `number`

Defined in: [packages/gantt-core/src/types.ts:275](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L275)

***

### earlyStart

> **earlyStart**: `number`

Defined in: [packages/gantt-core/src/types.ts:274](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L274)

***

### finish

> **finish**: `number`

Defined in: [packages/gantt-core/src/types.ts:269](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L269)

***

### freeSlack

> **freeSlack**: `number`

Defined in: [packages/gantt-core/src/types.ts:281](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L281)

Working minutes the task can slip without moving any successor.

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:260](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L260)

***

### index

> **index**: `number`

Defined in: [packages/gantt-core/src/types.ts:262](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L262)

Row position in `Project.tasks`.

***

### lateFinish

> **lateFinish**: `number`

Defined in: [packages/gantt-core/src/types.ts:277](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L277)

***

### lateStart

> **lateStart**: `number`

Defined in: [packages/gantt-core/src/types.ts:276](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L276)

***

### milestone

> **milestone**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:267](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L267)

***

### parentId

> **parentId**: `string` \| `null`

Defined in: [packages/gantt-core/src/types.ts:263](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L263)

***

### percentComplete

> **percentComplete**: `number`

Defined in: [packages/gantt-core/src/types.ts:284](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L284)

Own value for a task; duration-weighted over the tasks under a summary.

***

### segments

> **segments**: readonly `object`[]

Defined in: [packages/gantt-core/src/types.ts:271](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L271)

The stretches the task works in: one, or one more than it has splits.

***

### start

> **start**: `number`

Defined in: [packages/gantt-core/src/types.ts:268](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L268)

***

### summary

> **summary**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:266](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L266)

***

### totalSlack

> **totalSlack**: `number`

Defined in: [packages/gantt-core/src/types.ts:279](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L279)

Working minutes the task can slip without moving the project's end. Negative when a late date is already missed.

***

### wbs

> **wbs**: `string`

Defined in: [packages/gantt-core/src/types.ts:265](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L265)

Outline number, such as `1.2.3`.
