[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt-core](../README.md) / WorkingTime

# Interface: WorkingTime

Defined in: [packages/gantt-core/src/calendar.ts:20](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L20)

Working-time arithmetic over one calendar.

Two instants can bound the same working moment: 17:00 on Friday and 08:00
on Monday have no working time between them. A start is written at the
later of the two ([WorkingTime.snapForward](#snapforward)) and a finish at the
earlier ([WorkingTime.snapBackward](#snapbackward)).

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/gantt-core/src/calendar.ts:21](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L21)

## Methods

### add()

> **add**(`t`, `minutes`): `number`

Defined in: [packages/gantt-core/src/calendar.ts:34](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L34)

The earliest instant by which `minutes` of work starting at `t` are done.
Zero minutes returns `t` unchanged; a negative count runs backward.

#### Parameters

##### t

`number`

##### minutes

`number`

#### Returns

`number`

***

### rangesOfDay()

> **rangesOfDay**(`day`): readonly [`WorkingRange`](WorkingRange.md)[]

Defined in: [packages/gantt-core/src/calendar.ts:23](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L23)

Working ranges of a day, in order and without overlap.

#### Parameters

##### day

`number`

#### Returns

readonly [`WorkingRange`](WorkingRange.md)[]

***

### snapBackward()

> **snapBackward**(`t`): `number`

Defined in: [packages/gantt-core/src/calendar.ts:27](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L27)

The latest instant at or before `t` at which work can end.

#### Parameters

##### t

`number`

#### Returns

`number`

***

### snapForward()

> **snapForward**(`t`): `number`

Defined in: [packages/gantt-core/src/calendar.ts:25](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L25)

The earliest instant at or after `t` at which work can begin.

#### Parameters

##### t

`number`

#### Returns

`number`

***

### subtract()

> **subtract**(`t`, `minutes`): `number`

Defined in: [packages/gantt-core/src/calendar.ts:39](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L39)

The latest instant from which `minutes` of work end by `t`. Zero minutes
returns `t` unchanged; a negative count runs forward.

#### Parameters

##### t

`number`

##### minutes

`number`

#### Returns

`number`

***

### touchesWork()

> **touchesWork**(`t`): `boolean`

Defined in: [packages/gantt-core/src/calendar.ts:29](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L29)

True when `t` lies inside a working range or on one of its ends.

#### Parameters

##### t

`number`

#### Returns

`boolean`

***

### workBetween()

> **workBetween**(`a`, `b`): `number`

Defined in: [packages/gantt-core/src/calendar.ts:41](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/calendar.ts#L41)

Working minutes from `a` to `b`; negative when `b` is earlier.

#### Parameters

##### a

`number`

##### b

`number`

#### Returns

`number`
