[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / Link

# Interface: Link

Defined in: [packages/gantt-core/src/types.ts:168](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L168)

A dependency between two tasks. A negative lag is a lead.

## Properties

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:169](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L169)

***

### lag

> **lag**: `number`

Defined in: [packages/gantt-core/src/types.ts:174](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L174)

Minutes for `working` and `elapsed`; percent of the predecessor's duration for `percent`.

***

### lagMode

> **lagMode**: [`LagMode`](../type-aliases/LagMode.md)

Defined in: [packages/gantt-core/src/types.ts:175](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L175)

***

### lagUnit

> **lagUnit**: [`DurationUnit`](../type-aliases/DurationUnit.md)

Defined in: [packages/gantt-core/src/types.ts:177](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L177)

Unit a minute lag is shown and edited in.

***

### predecessorId

> **predecessorId**: `string`

Defined in: [packages/gantt-core/src/types.ts:170](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L170)

***

### successorId

> **successorId**: `string`

Defined in: [packages/gantt-core/src/types.ts:171](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L171)

***

### type

> **type**: [`LinkType`](../type-aliases/LinkType.md)

Defined in: [packages/gantt-core/src/types.ts:172](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L172)
