[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / renderPdf

# Function: renderPdf()

> **renderPdf**(`project`, `schedule`, `language`, `label`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [lib/pdf-export.ts:373](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L373)

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

Translates a `column.*` key for the table headings.

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>
