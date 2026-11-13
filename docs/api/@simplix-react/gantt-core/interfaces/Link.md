[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / Link

# Interface: Link

Defined in: [packages/gantt-core/src/types.ts:144](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L144)

A dependency between two tasks. A negative lag is a lead.

## Properties

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:145](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L145)

***

### lag

> **lag**: `number`

Defined in: [packages/gantt-core/src/types.ts:150](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L150)

Minutes for `working` and `elapsed`; percent of the predecessor's duration for `percent`.

***

### lagMode

> **lagMode**: [`LagMode`](../type-aliases/LagMode.md)

Defined in: [packages/gantt-core/src/types.ts:151](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L151)

***

### lagUnit

> **lagUnit**: [`DurationUnit`](../type-aliases/DurationUnit.md)

Defined in: [packages/gantt-core/src/types.ts:153](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L153)

Unit a minute lag is shown and edited in.

***

### predecessorId

> **predecessorId**: `string`

Defined in: [packages/gantt-core/src/types.ts:146](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L146)

***

### successorId

> **successorId**: `string`

Defined in: [packages/gantt-core/src/types.ts:147](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L147)

***

### type

> **type**: [`LinkType`](../type-aliases/LinkType.md)

Defined in: [packages/gantt-core/src/types.ts:148](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L148)
