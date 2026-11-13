[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / PdfView

# Interface: PdfView

Defined in: [lib/pdf-export.ts:115](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L115)

What of the screen's view a PDF follows. Left out, the PDF shows the whole plan in the chart's own colours.

## Properties

### colorOf()?

> `optional` **colorOf**: (`task`) => `string` \| `undefined`

Defined in: [lib/pdf-export.ts:119](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L119)

The colour of a task's bar, or `undefined` for the chart's own.

#### Parameters

##### task

`Task`

#### Returns

`string` \| `undefined`

***

### rows?

> `optional` **rows**: readonly `string`[]

Defined in: [lib/pdf-export.ts:117](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L117)

Ids of the tasks to draw, in the order to draw them: the rows the screen shows after filtering, sorting and folding.

***

### showCriticalPath?

> `optional` **showCriticalPath**: `boolean`

Defined in: [lib/pdf-export.ts:121](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L121)

Whether critical tasks are drawn in the critical colour.
