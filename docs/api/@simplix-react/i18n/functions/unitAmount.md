[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/i18n](../README.md) / unitAmount

# Function: unitAmount()

> **unitAmount**(`amount`, `unit`, `unitLabel?`): `string` \| `undefined`

Defined in: [app/unit-amount.ts:26](https://github.com/simplix-framework/simplix-react/blob/main/app/unit-amount.ts#L26)

One amount and the unit it is counted in, as a reader says it — 「12개월」, 「50인」, 「3회」.

## Parameters

### amount

the number, absent where nothing set one

`number` | `null` | `undefined`

### unit

`unknown`

the unit beside it — a boot enum object, its bare constant, or nothing

### unitLabel?

(`constant`) => `string`

what turns that constant into the reader's own word, where the caller has it

## Returns

`string` \| `undefined`

the two as one string, or `undefined` where there is no number

## Remarks

<b>The unit's word travels with the number rather than beside it.</b> A value and a separately
drawn unit read as two facts and wrap apart at a narrow column; one string is one measurement.
