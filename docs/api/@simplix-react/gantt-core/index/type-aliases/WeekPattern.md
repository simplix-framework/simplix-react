[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [index](../README.md) / WeekPattern

# Type Alias: WeekPattern

> **WeekPattern** = readonly (readonly [`WorkingRange`](../interfaces/WorkingRange.md)[] \| `null`)[]

Defined in: [packages/gantt-core/src/types.ts:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/types.ts#L16)

Working time of the seven weekdays, Sunday first. An empty array is a
non-working day; `null` takes the day from the base calendar.
