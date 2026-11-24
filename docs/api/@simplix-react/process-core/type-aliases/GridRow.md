[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / GridRow

# Type Alias: GridRow

> **GridRow** = \{ `kind`: `"start"`; `lane`: `number`; \} \| \{ `kind`: `"end"`; `lane`: `number`; \} \| \{ `kind`: `"section"`; `sectionId`: [`Id`](Id.md); \} \| \{ `acts`: `GridAct`[]; `kind`: `"acts"`; `stepId`: [`Id`](Id.md); \} \| \{ `kind`: `"flow"`; \} \| \{ `kind`: `"gate"`; `stepId`: [`Id`](Id.md); \} \| \{ `from`: `number`; `kind`: `"rework"`; `lane`: `number`; `stepId`: [`Id`](Id.md); `way`: [`ReworkWay`](ReworkWay.md); \} \| \{ `kind`: `"excluded"`; `stepId`: [`Id`](Id.md); \} \| \{ `kind`: `"folded"`; `stepId`: [`Id`](Id.md); \}

Defined in: [packages/process-core/src/lane-geometry.ts:69](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/lane-geometry.ts#L69)

One row of the lane grid, top to bottom.
