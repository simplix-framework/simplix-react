[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / createGanttStore

# Function: createGanttStore()

> **createGanttStore**(`initial`, `options?`): `StoreApi`\<[`GanttStoreState`](../interfaces/GanttStoreState.md)\>

Defined in: [model/gantt-store.ts:79](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L79)

Creates the store of one chart.

## Parameters

### initial

`Project`

### options?

[`CreateGanttStoreOptions`](../interfaces/CreateGanttStoreOptions.md) = `{}`

## Returns

`StoreApi`\<[`GanttStoreState`](../interfaces/GanttStoreState.md)\>

## Throws

ScheduleError when the initial project cannot be scheduled.
