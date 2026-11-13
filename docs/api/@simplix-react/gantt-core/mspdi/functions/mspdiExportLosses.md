[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [mspdi](../README.md) / mspdiExportLosses

# Function: mspdiExportLosses()

> **mspdiExportLosses**(`project`): [`MspdiLoss`](../interfaces/MspdiLoss.md)[]

Defined in: [packages/gantt-core/src/mspdi/losses.ts:26](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/losses.ts#L26)

Lists what `writeMspdi` leaves out of the document for this plan. With an
empty list everything the plan holds is in the document; a custom field
still comes back under Microsoft Project's id for it (`text1`, `number3`),
so a `custom:<id>` column stored with the old id no longer finds it.

## Parameters

### project

[`Project`](../../index/interfaces/Project.md)

## Returns

[`MspdiLoss`](../interfaces/MspdiLoss.md)[]
