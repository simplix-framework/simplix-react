[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [pdf](../README.md) / PdfView

# Interface: PdfView

Defined in: [lib/pdf-export.ts:49](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L49)

What of the screen's view a PDF follows. Left out, the PDF shows the whole plan in the chart's own colours.

## Properties

### colorOf()?

> `optional` **colorOf**: (`task`) => `string` \| `undefined`

Defined in: [lib/pdf-export.ts:57](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L57)

The colour of a task's bar, or `undefined` for the chart's own.

#### Parameters

##### task

`Task`

#### Returns

`string` \| `undefined`

***

### rows?

> `optional` **rows**: readonly (`string` \| \{ `heading`: `string`; \})[]

Defined in: [lib/pdf-export.ts:55](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L55)

The rows to draw, in order: the id of a task, or the heading of a group of
the rows after it. These are the rows the screen shows after filtering,
sorting, grouping and folding.

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [lib/pdf-export.ts:59](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L59)

Whether critical tasks are drawn in the critical colour.
