[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / buildCrudSearch

# Function: buildCrudSearch()

> **buildCrudSearch**(`view`, `id?`, `tab?`, `filters?`): [`CrudSearch`](../interfaces/CrudSearch.md)

Defined in: [packages/ui/src/crud/patterns/crud-search.ts:128](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/crud-search.ts#L128)

**`Internal`**

The search a view is addressed by.

<p>`tab` and `filters` survive every transition: opening a record from the third tab and closing
it again returns to the third tab, and opening a record from a filtered list and closing it
returns to the same filtered list, which is where the reader was.

## Parameters

### view

[`CrudView`](../type-aliases/CrudView.md)

### id?

`string`

### tab?

`string`

### filters?

[`CrudSearchFilters`](../type-aliases/CrudSearchFilters.md)

## Returns

[`CrudSearch`](../interfaces/CrudSearch.md)
