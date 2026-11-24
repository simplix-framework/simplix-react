[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / useCrudNavigation

# Function: useCrudNavigation()

> **useCrudNavigation**\<`S`\>(`search`, `onNavigate`): [`UseCrudNavigationResult`](../interfaces/UseCrudNavigationResult.md)

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:41](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L41)

Parses CRUD search params and returns memoized navigation callbacks.

## Type Parameters

### S

`S` *extends* [`CrudSearch`](../interfaces/CrudSearch.md)

## Parameters

### search

`S`

### onNavigate

(`search`, `options?`) => `void`

Where to go.

<p>Typed in the caller's own search rather than in [CrudSearch](../interfaces/CrudSearch.md): a screen whose address
carries more than the record (which explanation is open, which tab) hands over a handler
that reads that wider shape, and a parameter fixed at the narrow one refuses it.

<p>The second argument says how the router should record the move. A handler that takes one
argument still fits: it pushes, as it always did.

## Returns

[`UseCrudNavigationResult`](../interfaces/UseCrudNavigationResult.md)

## Example

```tsx
const nav = useCrudNavigation(search, onNavigate);
const { view, selectedId, showList, showDetail } = nav;
```
