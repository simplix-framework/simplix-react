[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [mspdi](../README.md) / MspdiLossCode

# Type Alias: MspdiLossCode

> **MspdiLossCode** = `"splits"` \| `"color"` \| `"recurrence"` \| `"custom-fields"`

Defined in: [packages/gantt-core/src/mspdi/losses.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/mspdi/losses.ts#L12)

Something of a plan that a Microsoft Project XML document has no place for.

- `splits`: the pauses inside split tasks; the tasks are written without them.
- `color`: the colours given to single tasks.
- `recurrence`: the rule of a recurring task; its occurrences are written as ordinary tasks.
- `custom-fields`: custom fields beyond the number of fields of their type that Microsoft Project offers.
