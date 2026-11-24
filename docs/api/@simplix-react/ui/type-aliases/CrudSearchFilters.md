[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudSearchFilters

# Type Alias: CrudSearchFilters

> **CrudSearchFilters** = `Record`\<`string`, `string` \| `string`[]\>

Defined in: [packages/ui/src/crud/patterns/crud-search.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/crud-search.ts#L9)

The list filters an address carries: each key is a filter key (`field.operator`, such as
`status.in`), each value one string or an array of strings.

<p>This is the form a link can hold. The list's own state may hold booleans, numbers and dates, and
the list reads them back from here by the type of the control that owns the key; see
`AddressedFilters`.
