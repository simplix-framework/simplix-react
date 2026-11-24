[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / Overallocation

# Interface: Overallocation

Defined in: [packages/gantt-core/src/resources.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/resources.ts#L13)

A span in which a work resource is booked beyond its capacity.

## Properties

### from

> **from**: `number`

Defined in: [packages/gantt-core/src/resources.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/resources.ts#L15)

***

### resourceId

> **resourceId**: `string`

Defined in: [packages/gantt-core/src/resources.ts:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/resources.ts#L14)

***

### taskIds

> **taskIds**: readonly `string`[]

Defined in: [packages/gantt-core/src/resources.ts:20](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/resources.ts#L20)

Tasks booked in the span, in row order.

***

### to

> **to**: `number`

Defined in: [packages/gantt-core/src/resources.ts:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/resources.ts#L16)

***

### units

> **units**: `number`

Defined in: [packages/gantt-core/src/resources.ts:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/resources.ts#L18)

Sum of the assignment units in the span.
