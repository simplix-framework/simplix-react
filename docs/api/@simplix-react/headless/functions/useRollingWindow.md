[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / useRollingWindow

# Function: useRollingWindow()

> **useRollingWindow**(`ms`, `options?`): [`ZoneInstantRange`](../interfaces/ZoneInstantRange.md)

Defined in: [datetime/zone-clock.ts:85](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-clock.ts#L85)

The last `ms` milliseconds, as a half-open `[from, to)` instant range.

## Parameters

### ms

`number`

How long the window is.

### options?

[`RollingWindowOptions`](../interfaces/RollingWindowOptions.md) = `{}`

How often it moves on.

## Returns

[`ZoneInstantRange`](../interfaces/ZoneInstantRange.md)

The window's `from` and `to`, as UTC RFC 3339 instants.

## Remarks

A rolling window (the last 24 hours, the last 10 minutes) needs no zone, but it needs one
decision every screen otherwise makes by hand: whether it moves. With `tick` it moves once per
tick, on the tick's boundary; without, it is the window at page open. A query keyed on a moving
window changes its key every tick, so give that query `placeholderData: keepPreviousData` to keep
the last answer on screen while the next one is read.
