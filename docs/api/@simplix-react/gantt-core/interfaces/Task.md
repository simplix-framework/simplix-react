[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / Task

# Interface: Task

Defined in: [packages/gantt-core/src/types.ts:71](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L71)

One row of the plan. Rows are kept in display order; `outlineLevel` (1 for
the top level) places a row under the nearest earlier row one level up, and
a row with rows under it is a summary task whose dates come from them.

## Properties

### actualCost?

> `optional` **actualCost**: `number`

Defined in: [packages/gantt-core/src/types.ts:112](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L112)

What the task has cost so far. Earned value takes the earned amount when it is not recorded.

***

### actualFinish?

> `optional` **actualFinish**: `number`

Defined in: [packages/gantt-core/src/types.ts:99](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L99)

***

### actualStart?

> `optional` **actualStart**: `number`

Defined in: [packages/gantt-core/src/types.ts:98](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L98)

***

### calendarId?

> `optional` **calendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:91](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L91)

***

### constraintDate?

> `optional` **constraintDate**: `number`

Defined in: [packages/gantt-core/src/types.ts:89](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L89)

Required by every constraint type except `asap` and `alap`.

***

### constraintType

> **constraintType**: [`ConstraintType`](../type-aliases/ConstraintType.md)

Defined in: [packages/gantt-core/src/types.ts:87](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L87)

***

### custom?

> `optional` **custom**: `Readonly`\<`Record`\<`string`, [`CustomValue`](../type-aliases/CustomValue.md)\>\>

Defined in: [packages/gantt-core/src/types.ts:114](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L114)

Values of the plan's custom fields, by field id.

***

### deadline?

> `optional` **deadline**: `number`

Defined in: [packages/gantt-core/src/types.ts:90](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L90)

***

### duration

> **duration**: `number`

Defined in: [packages/gantt-core/src/types.ts:77](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L77)

Working minutes on the task's calendar, or clock minutes when `elapsed`.

***

### durationUnit

> **durationUnit**: [`DurationUnit`](../type-aliases/DurationUnit.md)

Defined in: [packages/gantt-core/src/types.ts:79](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L79)

Unit the duration is shown and edited in.

***

### effortDriven?

> `optional` **effortDriven**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:95](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L95)

***

### elapsed?

> `optional` **elapsed**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:80](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L80)

***

### estimated?

> `optional` **estimated**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:81](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L81)

***

### fixedCost?

> `optional` **fixedCost**: `number`

Defined in: [packages/gantt-core/src/types.ts:110](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L110)

A cost of the task itself, on top of what its resources cost.

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:72](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L72)

***

### ignoreResourceCalendar?

> `optional` **ignoreResourceCalendar**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:93](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L93)

With a task calendar set, schedules on it alone and ignores resource calendars.

***

### inactive?

> `optional` **inactive**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:105](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L105)

An inactive task keeps its row and takes no part in scheduling.

***

### levelingDelay?

> `optional` **levelingDelay**: `number`

Defined in: [packages/gantt-core/src/types.ts:103](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L103)

Working minutes on the task's calendar that leveling added before the start.

***

### manualFinish?

> `optional` **manualFinish**: `number`

Defined in: [packages/gantt-core/src/types.ts:86](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L86)

***

### manualStart?

> `optional` **manualStart**: `number`

Defined in: [packages/gantt-core/src/types.ts:85](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L85)

Dates of a manually scheduled task. An automatic task ignores them.

***

### milestone?

> `optional` **milestone**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:83](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L83)

Draws the task as a milestone even when its duration is not zero.

***

### mode

> **mode**: [`TaskMode`](../type-aliases/TaskMode.md)

Defined in: [packages/gantt-core/src/types.ts:75](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L75)

***

### name

> **name**: `string`

Defined in: [packages/gantt-core/src/types.ts:73](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L73)

***

### notes?

> `optional` **notes**: `string`

Defined in: [packages/gantt-core/src/types.ts:106](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L106)

***

### outlineLevel

> **outlineLevel**: `number`

Defined in: [packages/gantt-core/src/types.ts:74](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L74)

***

### percentComplete

> **percentComplete**: `number`

Defined in: [packages/gantt-core/src/types.ts:97](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L97)

0 to 100.

***

### priority

> **priority**: `number`

Defined in: [packages/gantt-core/src/types.ts:101](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L101)

0 to 1000. Leveling never delays a task of priority 1000.

***

### splits?

> `optional` **splits**: readonly [`TaskSplit`](TaskSplit.md)[]

Defined in: [packages/gantt-core/src/types.ts:108](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L108)

Pauses inside the task, in order of offset. The duration counts work only, not the pauses.

***

### type

> **type**: [`TaskType`](../type-aliases/TaskType.md)

Defined in: [packages/gantt-core/src/types.ts:94](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L94)
