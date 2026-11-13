[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [index](../README.md) / TimeScale

# Interface: TimeScale

Defined in: [lib/time-scale.ts:29](https://github.com/simplix-react/simplix-react/blob/main/lib/time-scale.ts#L29)

Maps instants to horizontal pixels over a fixed range of whole days.

## Properties

### end

> **end**: `number`

Defined in: [lib/time-scale.ts:33](https://github.com/simplix-react/simplix-react/blob/main/lib/time-scale.ts#L33)

Instant at the right edge; midnight.

***

### pxPerDay

> **pxPerDay**: `number`

Defined in: [lib/time-scale.ts:34](https://github.com/simplix-react/simplix-react/blob/main/lib/time-scale.ts#L34)

***

### start

> **start**: `number`

Defined in: [lib/time-scale.ts:31](https://github.com/simplix-react/simplix-react/blob/main/lib/time-scale.ts#L31)

First instant drawn; midnight.

***

### width

> **width**: `number`

Defined in: [lib/time-scale.ts:35](https://github.com/simplix-react/simplix-react/blob/main/lib/time-scale.ts#L35)

## Methods

### at()

> **at**(`x`, `snap?`): `number`

Defined in: [lib/time-scale.ts:38](https://github.com/simplix-react/simplix-react/blob/main/lib/time-scale.ts#L38)

The instant at a pixel, rounded to `snap` minutes.

#### Parameters

##### x

`number`

##### snap?

`number`

#### Returns

`number`

***

### x()

> **x**(`t`): `number`

Defined in: [lib/time-scale.ts:36](https://github.com/simplix-react/simplix-react/blob/main/lib/time-scale.ts#L36)

#### Parameters

##### t

`number`

#### Returns

`number`
