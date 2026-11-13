[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / Assignment

# Interface: Assignment

Defined in: [packages/gantt-core/src/types.ts:180](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L180)

## Properties

### contour?

> `optional` **contour**: [`WorkContour`](../type-aliases/WorkContour.md)

Defined in: [packages/gantt-core/src/types.ts:191](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L191)

How the work is spread over the task in the usage figures. Flat when not set.

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:181](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L181)

***

### overtimeWork?

> `optional` **overtimeWork**: `number`

Defined in: [packages/gantt-core/src/types.ts:189](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L189)

Minutes of the work done outside working time: they cost the overtime rate and take no duration.

***

### resourceId

> **resourceId**: `string`

Defined in: [packages/gantt-core/src/types.ts:183](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L183)

***

### taskId

> **taskId**: `string`

Defined in: [packages/gantt-core/src/types.ts:182](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L182)

***

### units

> **units**: `number`

Defined in: [packages/gantt-core/src/types.ts:185](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L185)

Share of the resource's time: 1 is full time.

***

### work

> **work**: `number`

Defined in: [packages/gantt-core/src/types.ts:187](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L187)

Working minutes the resource spends on the task.
