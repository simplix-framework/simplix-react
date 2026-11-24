[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / Assignment

# Interface: Assignment

Defined in: [packages/gantt-core/src/types.ts:204](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L204)

## Properties

### contour?

> `optional` **contour**: [`WorkContour`](../type-aliases/WorkContour.md)

Defined in: [packages/gantt-core/src/types.ts:215](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L215)

How the work is spread over the task in the usage figures. Flat when not set.

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:205](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L205)

***

### overtimeWork?

> `optional` **overtimeWork**: `number`

Defined in: [packages/gantt-core/src/types.ts:213](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L213)

Minutes of the work done outside working time: they cost the overtime rate and take no duration.

***

### resourceId

> **resourceId**: `string`

Defined in: [packages/gantt-core/src/types.ts:207](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L207)

***

### taskId

> **taskId**: `string`

Defined in: [packages/gantt-core/src/types.ts:206](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L206)

***

### units

> **units**: `number`

Defined in: [packages/gantt-core/src/types.ts:209](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L209)

Share of the resource's time: 1 is full time.

***

### work

> **work**: `number`

Defined in: [packages/gantt-core/src/types.ts:211](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L211)

Working minutes the resource spends on the task.
