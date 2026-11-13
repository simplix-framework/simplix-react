[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / LinkSchedule

# Interface: LinkSchedule

Defined in: [packages/gantt-core/src/types.ts:314](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L314)

Computed state of one link.

## Properties

### driving

> **driving**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:319](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L319)

The link is what holds the successor at its date.

***

### id

> **id**: `string`

Defined in: [packages/gantt-core/src/types.ts:315](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L315)

***

### violated

> **violated**: `boolean`

Defined in: [packages/gantt-core/src/types.ts:317](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L317)

The successor's date is earlier than the link allows.
