[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / Condition

# Type Alias: Condition

> **Condition** = \{ `fact`: `string`; \} \| \{ `not`: `Condition`; \} \| \{ `all`: `Condition`[]; \} \| \{ `any`: `Condition`[]; \}

Defined in: [packages/process-core/src/types.ts:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/types.ts#L18)

A condition over named facts. A fact is a boolean the caller supplies for one case of the
procedure (a kind of work, a kind of contract); a fact the caller leaves out is unknown.
