[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / downloadPdf

# Function: downloadPdf()

> **downloadPdf**(`project`, `schedule`, `language`, `label`, `view?`): `Promise`\<`void`\>

Defined in: [lib/pdf-export.ts:443](https://github.com/simplix-react/simplix-react/blob/main/lib/pdf-export.ts#L443)

Renders the plan as a PDF and hands it to the browser as a download named after the project.

## Parameters

### project

`Project`

### schedule

`Schedule`

### language

`string`

### label

(`key`) => `string`

### view?

[`PdfView`](../interfaces/PdfView.md) = `{}`

## Returns

`Promise`\<`void`\>
