[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [index](../README.md) / routeLink

# Function: routeLink()

> **routeLink**(`type`, `from`, `to`, `stub`, `rowHeight`): [`LinkPath`](../interfaces/LinkPath.md)

Defined in: [lib/link-path.ts:34](https://github.com/simplix-framework/simplix-react/blob/main/lib/link-path.ts#L34)

Routes a dependency between two bars with right-angle segments.

The line leaves the predecessor at the end the link reads (its finish for
FS and FF, its start for SS and SF) and enters the successor at the end the
link bounds (its start for FS and SS, its finish for FF and SF). When the
two ends face each other with room between them the route is one elbow;
otherwise it steps through the gap between the rows.

## Parameters

### type

`LinkType`

### from

[`BarBox`](../interfaces/BarBox.md)

### to

[`BarBox`](../interfaces/BarBox.md)

### stub

`number`

Length of the straight piece at each end.

### rowHeight

`number`

Height of a row, used to pass between rows.

## Returns

[`LinkPath`](../interfaces/LinkPath.md)
