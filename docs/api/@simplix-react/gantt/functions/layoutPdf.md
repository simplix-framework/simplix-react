[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / layoutPdf

# Function: layoutPdf()

> **layoutPdf**(`schedule`, `project`, `rowCount?`): [`PdfLayout`](../interfaces/PdfLayout.md)

Defined in: [lib/pdf-export.ts:130](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L130)

Cuts a plan into sheets: the task table repeats on every sheet, rows run
down the sheets and the timeline runs across them at the closest zoom step
that keeps it within six sheets. `rowCount` is the number of rows drawn,
every task of the plan when it is left out.

## Parameters

### schedule

`Schedule`

### project

`Project`

### rowCount?

`number` = `project.tasks.length`

## Returns

[`PdfLayout`](../interfaces/PdfLayout.md)
