[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / LinkSchedule

# Interface: LinkSchedule

Defined in: [packages/gantt-core/src/types.ts:290](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L290)

Computed state of one link.

## Properties

### driving

> **driving**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:295](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L295)

The link is what holds the successor at its date.

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:291](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L291)

***

### violated

> **violated**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:293](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L293)

The successor's date is earlier than the link allows.
