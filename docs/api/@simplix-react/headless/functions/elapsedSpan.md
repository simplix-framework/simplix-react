[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / elapsedSpan

# Function: elapsedSpan()

> **elapsedSpan**(`millis`, `floor?`, `ceiling?`): [`ElapsedSpan`](../interfaces/ElapsedSpan.md) \| `undefined`

Defined in: [datetime/elapsed-span.ts:56](https://github.com/simplix-framework/simplix-react/blob/main/datetime/elapsed-span.ts#L56)

A length of time, reduced to the way a person says it out loud.

<p><b>The reduction is the whole point, and its absence is silent.</b> A screen that divides by
sixty once says 「2180분 14초」 for a run that took a day and a half — the arithmetic is right,
the sentence is unreadable, and nothing anywhere reports a fault. It only shows up when
something actually runs long, which is the day the figure most needs reading.

<p><b>The words stay with the caller.</b> This module holds no catalogue, and a run's 「4분 0초」
and a wait's 「4분」 are two sentences about the same span — so what comes back is the shape, and
the screen that owns the sentence writes it. [periodStanding](periodStanding.md) splits the same way.

## Parameters

### millis

`number`

how long it took

### floor?

[`ElapsedUnit`](../type-aliases/ElapsedUnit.md) = `"seconds"`

the smallest unit worth saying — a wait is never said in seconds, so the screen
  that shows one passes `"minutes"` and gets `0분` rather than `47초`

### ceiling?

[`ElapsedUnit`](../type-aliases/ElapsedUnit.md) = `"days"`

the largest unit worth saying — a shift is read against the hour marks beside it,
  so the screen drawing one passes `"hours"` and gets `24시간` rather than `1일`

## Returns

[`ElapsedSpan`](../interfaces/ElapsedSpan.md) \| `undefined`

the span, or undefined where the length is not a number or runs backwards
