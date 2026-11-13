[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / Resource

# Interface: Resource

Defined in: [packages/gantt-core/src/types.ts:158](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L158)

## Properties

### calendarId?

> `optional` **calendarId**: `string`

Defined in: [packages/gantt-core/src/types.ts:164](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L164)

***

### costPerUse?

> `optional` **costPerUse**: `number`

Defined in: [packages/gantt-core/src/types.ts:170](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L170)

Cost added once for every task the resource is assigned to.

***

### group?

> `optional` **group**: `string`

Defined in: [packages/gantt-core/src/types.ts:166](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L166)

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:159](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L159)

***

### initials?

> `optional` **initials**: `string`

Defined in: [packages/gantt-core/src/types.ts:165](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L165)

***

### maxUnits

> **maxUnits**: `number`

Defined in: [packages/gantt-core/src/types.ts:163](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L163)

Capacity of a work resource: 1 is one full-time unit.

***

### name

> **name**: `string`

Defined in: [packages/gantt-core/src/types.ts:160](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L160)

***

### overtimeRate?

> `optional` **overtimeRate**: `number`

Defined in: [packages/gantt-core/src/types.ts:172](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L172)

Cost of one hour of overtime. The standard rate applies when it is not set.

***

### rates?

> `optional` **rates**: readonly `object`[]

Defined in: [packages/gantt-core/src/types.ts:174](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L174)

Standard rates that take effect from a date on, in any order. A task is costed at the rate in effect when it starts.

***

### standardRate?

> `optional` **standardRate**: `number`

Defined in: [packages/gantt-core/src/types.ts:168](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L168)

Cost of one hour of a work resource, or of one unit of a material resource.

***

### type

> **type**: [`ResourceType`](../type-aliases/ResourceType.md)

Defined in: [packages/gantt-core/src/types.ts:161](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L161)
