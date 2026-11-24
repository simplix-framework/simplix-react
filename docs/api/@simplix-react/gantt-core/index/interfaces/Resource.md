[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / Resource

# Interface: Resource

Defined in: [packages/gantt-core/src/types.ts:182](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L182)

## Properties

### calendarId?

> `optional` **calendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:188](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L188)

***

### costPerUse?

> `optional` **costPerUse**: `number`

Defined in: [packages/gantt-core/src/types.ts:194](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L194)

Cost added once for every task the resource is assigned to.

***

### group?

> `optional` **group**: `string`

Defined in: [packages/gantt-core/src/types.ts:190](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L190)

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:183](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L183)

***

### initials?

> `optional` **initials**: `string`

Defined in: [packages/gantt-core/src/types.ts:189](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L189)

***

### maxUnits

> **maxUnits**: `number`

Defined in: [packages/gantt-core/src/types.ts:187](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L187)

Capacity of a work resource: 1 is one full-time unit.

***

### name

> **name**: `string`

Defined in: [packages/gantt-core/src/types.ts:184](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L184)

***

### overtimeRate?

> `optional` **overtimeRate**: `number`

Defined in: [packages/gantt-core/src/types.ts:196](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L196)

Cost of one hour of overtime. The standard rate applies when it is not set.

***

### rates?

> `optional` **rates**: readonly `object`[]

Defined in: [packages/gantt-core/src/types.ts:198](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L198)

Standard rates that take effect from a date on, in any order. A task is costed at the rate in effect when it starts.

***

### standardRate?

> `optional` **standardRate**: `number`

Defined in: [packages/gantt-core/src/types.ts:192](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L192)

Cost of one hour of a work resource, or of one unit of a material resource.

***

### type

> **type**: [`ResourceType`](../type-aliases/ResourceType.md)

Defined in: [packages/gantt-core/src/types.ts:185](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L185)
