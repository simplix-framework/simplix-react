[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / layoutPdf

# Function: layoutPdf()

> **layoutPdf**(`schedule`, `project`): [`PdfLayout`](../interfaces/PdfLayout.md)

Defined in: [lib/pdf-export.ts:119](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L119)

Cuts a plan into sheets: the task table repeats on every sheet, rows run
down the sheets and the timeline runs across them at the closest zoom step
that keeps it within six sheets.

## Parameters

### schedule

`Schedule`

### project

`Project`

## Returns

[`PdfLayout`](../interfaces/PdfLayout.md)
