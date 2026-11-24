[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt](../../README.md) / [pdf](../README.md) / renderPdf

# Function: renderPdf()

> **renderPdf**(`project`, `schedule`, `language`, `label`, `view?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [lib/pdf-export.ts:375](https://github.com/simplix-framework/simplix-react/blob/main/lib/pdf-export.ts#L375)

Draws a plan as an A4 landscape PDF: the task table on every sheet, rows
running down the sheets and the timeline running across them. The text is
drawn by the browser, so every script the reader's fonts cover is shown.

## Parameters

### project

`Project`

### schedule

`Schedule`

### language

`string`

### label

(`key`) => `string`

Translates a `column.*` key for the table headings and a `marker.*` key for the marked dates.

### view?

[`PdfView`](../interfaces/PdfView.md) = `{}`

The rows and colours of the screen for the PDF to follow.

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
