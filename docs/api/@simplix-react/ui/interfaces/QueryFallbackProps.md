[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / QueryFallbackProps

# Interface: QueryFallbackProps

Defined in: [packages/ui/src/crud/shared/query-fallback.tsx:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/query-fallback.tsx#L13)

Props for the [QueryFallback](../functions/QueryFallback.md) component.

## Properties

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/ui/src/crud/shared/query-fallback.tsx:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/query-fallback.tsx#L15)

Whether the query is currently loading.

***

### notFoundMessage?

> `optional` **notFoundMessage**: `string`

Defined in: [packages/ui/src/crud/shared/query-fallback.tsx:17](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/query-fallback.tsx#L17)

Message to display when data is not found. Defaults to `"Not found."`.

***

### onNotFound()?

> `optional` **onNotFound**: () => `void`

Defined in: [packages/ui/src/crud/shared/query-fallback.tsx:19](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/query-fallback.tsx#L19)

Callback invoked when data is confirmed not found (loading complete, no data).

#### Returns

`void`
