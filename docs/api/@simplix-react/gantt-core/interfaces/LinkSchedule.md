[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / LinkSchedule

# Interface: LinkSchedule

Defined in: [packages/gantt-core/src/types.ts:271](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L271)

Computed state of one link.

## Properties

### driving

> **driving**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:276](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L276)

The link is what holds the successor at its date.

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:272](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L272)

***

### violated

> **violated**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:274](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L274)

The successor's date is earlier than the link allows.
