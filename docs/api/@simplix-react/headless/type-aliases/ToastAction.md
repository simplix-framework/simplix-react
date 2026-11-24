[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / ToastAction

# Type Alias: ToastAction

> **ToastAction** = \{ `href`: `string`; `label`: `string`; \} \| \{ `label`: `string`; `run`: () => `void`; \}

Defined in: [toast-store.ts:17](https://github.com/simplix-framework/simplix-react/blob/main/toast-store.ts#L17)

What the toast's one action does: go somewhere, or run something on the spot (an undo).

<p>A `run` action closes the toast after it runs, so pressing 「실행 취소」 twice cannot undo
twice.
