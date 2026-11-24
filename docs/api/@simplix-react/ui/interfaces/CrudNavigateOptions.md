[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudNavigateOptions

# Interface: CrudNavigateOptions

Defined in: [packages/ui/src/crud/patterns/crud-search.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/crud-search.ts#L12)

How a navigation is recorded by the router.

## Properties

### replace?

> `optional` **replace**: `boolean`

Defined in: [packages/ui/src/crud/patterns/crud-search.ts:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/crud-search.ts#L18)

Replace the current history entry instead of adding one. A change the reader makes while
staying on the same view (narrowing a list) is written this way, so the Back button leaves the
screen instead of stepping through every filter the reader tried.
