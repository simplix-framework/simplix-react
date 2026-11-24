[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / FilterControl

# Type Alias: FilterControl

> **FilterControl** = `Pick`\<[`FilterDef`](FilterDef.md), `"field"` \| `"type"`\>

Defined in: [packages/ui/src/crud/list/addressed-filters.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/list/addressed-filters.ts#L13)

The part of a filter control the address needs: its field and what kind of control it is.

<p>A link holds strings only, and a control commits the value of its own type (a toggle commits
a boolean, a number filter a number). The kind says which one to read a string back as, so the
badge, the popover and the request all see the value the control would have written itself.
