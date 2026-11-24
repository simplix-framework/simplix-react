[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / QueryFallback

# Function: QueryFallback()

> **QueryFallback**(`__namedParameters`): `ReactNode`

Defined in: [packages/ui/src/crud/shared/query-fallback.tsx:35](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/query-fallback.tsx#L35)

Fallback component for query loading and not-found states.

When `onNotFound` is provided, displays a dialog informing the user that
the data was not found. Clicking confirm triggers `onNotFound` (typically
closing the detail panel and returning to the list).

## Parameters

### \_\_namedParameters

[`QueryFallbackProps`](../interfaces/QueryFallbackProps.md)

## Returns

`ReactNode`

## Example

```tsx
const { data, isLoading } = useGet(id);
if (isLoading || !data) return <QueryFallback isLoading={isLoading} notFoundMessage="Pet not found." onNotFound={onClose} />;
```
