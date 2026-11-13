[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / TaskSchedule

# Interface: TaskSchedule

Defined in: [packages/gantt-core/src/types.ts:240](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L240)

Computed dates of one task.

## Properties

### calendarId

> **calendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:267](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L267)

Calendar the dates were computed on.

***

### critical

> **critical**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:263](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L263)

***

### duration

> **duration**: `number`

Defined in: [packages/gantt-core/src/types.ts:254](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L254)

Working minutes of work between start and finish, pauses left out; clock minutes for an elapsed task.

***

### earlyFinish

> **earlyFinish**: `number`

Defined in: [packages/gantt-core/src/types.ts:256](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L256)

***

### earlyStart

> **earlyStart**: `number`

Defined in: [packages/gantt-core/src/types.ts:255](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L255)

***

### finish

> **finish**: `number`

Defined in: [packages/gantt-core/src/types.ts:250](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L250)

***

### freeSlack

> **freeSlack**: `number`

Defined in: [packages/gantt-core/src/types.ts:262](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L262)

Working minutes the task can slip without moving any successor.

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:241](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L241)

***

### index

> **index**: `number`

Defined in: [packages/gantt-core/src/types.ts:243](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L243)

Row position in `Project.tasks`.

***

### lateFinish

> **lateFinish**: `number`

Defined in: [packages/gantt-core/src/types.ts:258](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L258)

***

### lateStart

> **lateStart**: `number`

Defined in: [packages/gantt-core/src/types.ts:257](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L257)

***

### milestone

> **milestone**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:248](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L248)

***

### parentId

> **parentId**: `string` \| `null`

Defined in: [packages/gantt-core/src/types.ts:244](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L244)

***

### percentComplete

> **percentComplete**: `number`

Defined in: [packages/gantt-core/src/types.ts:265](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L265)

Own value for a task; duration-weighted over the tasks under a summary.

***

### segments

> **segments**: readonly `object`[]

Defined in: [packages/gantt-core/src/types.ts:252](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L252)

The stretches the task works in: one, or one more than it has splits.

***

### start

> **start**: `number`

Defined in: [packages/gantt-core/src/types.ts:249](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L249)

***

### summary

> **summary**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:247](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L247)

***

### totalSlack

> **totalSlack**: `number`

Defined in: [packages/gantt-core/src/types.ts:260](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L260)

Working minutes the task can slip without moving the project's end. Negative when a late date is already missed.

***

### wbs

> **wbs**: `string`

Defined in: [packages/gantt-core/src/types.ts:246](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L246)

Outline number, such as `1.2.3`.
