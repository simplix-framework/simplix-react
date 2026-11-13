[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / CalendarException

# Interface: CalendarException

Defined in: [packages/gantt-core/src/types.ts:19](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L19)

A dated override of single days. Both ends are day indexes and inclusive.

## Properties

### fromDay

> **fromDay**: `number`

Defined in: [packages/gantt-core/src/types.ts:21](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L21)

***

### name?

> `optional` **name**: `string`

Defined in: [packages/gantt-core/src/types.ts:20](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L20)

***

### ranges

> **ranges**: readonly [`WorkingRange`](WorkingRange.md)[]

Defined in: [packages/gantt-core/src/types.ts:24](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L24)

Working time on each covered day. Empty makes the days non-working.

***

### toDay

> **toDay**: `number`

Defined in: [packages/gantt-core/src/types.ts:22](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/types.ts#L22)
