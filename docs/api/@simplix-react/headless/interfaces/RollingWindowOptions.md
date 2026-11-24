[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / RollingWindowOptions

# Interface: RollingWindowOptions

Defined in: [datetime/zone-clock.ts:54](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-clock.ts#L54)

Options for [useRollingWindow](../functions/useRollingWindow.md).

## Properties

### tick?

> `readonly` `optional` **tick**: `number`

Defined in: [datetime/zone-clock.ts:61](https://github.com/simplix-framework/simplix-react/blob/main/datetime/zone-clock.ts#L61)

How often the window moves on, in milliseconds. Its end is cut to this step, so the strings
change once per step and a query keyed on them is read again once per step. Left out, the
window is fixed when the component mounts: a figure and the rows a press on it opens stay one
window while the reader works.
