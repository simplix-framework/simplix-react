[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / SegmentEnd

# Type Alias: SegmentEnd

> **SegmentEnd** = `"top"` \| `"bottom"` \| `"left"` \| `"right"` \| `"center"` \| `"side-top"` \| `"side-bottom"` \| `"rside-top"` \| `"rside-bottom"`

Defined in: [packages/process-core/src/lane-geometry.ts:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L16)

A point of a grid cell a line can end at.

- `top` · `bottom` · `left` · `right`: the middle of an edge
- `center`: where a node stands
- `side-top` · `side-bottom`: on the top or bottom edge, a little to the left of its middle,
  where a line from a gate row runs beside the line that comes down the middle of the lane
- `rside-top` · `rside-bottom`: the same a little to the right of the middle
