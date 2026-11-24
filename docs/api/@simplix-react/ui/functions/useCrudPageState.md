[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / useCrudPageState

# Function: useCrudPageState()

> **useCrudPageState**(`variant`, `nav`): [`UseCrudPageStateResult`](../interfaces/UseCrudPageStateResult.md)

Defined in: [packages/ui/src/crud/patterns/use-crud-page.ts:94](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/patterns/use-crud-page.ts#L94)

Composes fade transition and list-detail state from navigation result.

## Parameters

### variant

`"page"` | [`ListDetailVariant`](../type-aliases/ListDetailVariant.md)

### nav

`Pick`\<[`UseCrudNavigationResult`](../interfaces/UseCrudNavigationResult.md), `"view"` \| `"selectedId"` \| `"showList"` \| `"showDetail"` \| `"showNew"` \| `"showEdit"`\>

## Returns

[`UseCrudPageStateResult`](../interfaces/UseCrudPageStateResult.md)

## Example

```tsx
const nav = useCrudNavigation(search, onNavigate);
const { state, fade, closePanel } = useCrudPageState(variant, nav);
```
