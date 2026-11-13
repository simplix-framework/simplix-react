[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [index](../README.md) / dateMarkers

# Function: dateMarkers()

> **dateMarkers**(`project`, `schedule`, `now`): [`DateMarker`](../interfaces/DateMarker.md)[]

Defined in: [lib/markers.ts:33](https://github.com/simplix-react/simplix-react/blob/main/lib/markers.ts#L33)

The dates a timeline marks: today, the status date when the plan has one,
and the two ends of the plan. They come in the order they are drawn, so the
later ones lie on top where two fall on the same day.

## Parameters

### project

`Project`

### schedule

`Schedule`

### now

`number`

## Returns

[`DateMarker`](../interfaces/DateMarker.md)[]
