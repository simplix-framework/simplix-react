[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / CopyOutcome

# Type Alias: CopyOutcome

> **CopyOutcome** = `"copied"` \| `"unsupported"` \| `"failed"`

Defined in: [clipboard/copy-text.ts:8](https://github.com/simplix-framework/simplix-react/blob/main/clipboard/copy-text.ts#L8)

What happened when a value was offered to the clipboard.

<p>`"unsupported"` is separated from `"failed"` because only one of them is the user's to act
on: a browser that has no clipboard to write to will never have one at this address, and
telling the reader to try again sends them round a loop that cannot end.
