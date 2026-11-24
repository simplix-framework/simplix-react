[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / createReactRouterAdapter

# Function: createReactRouterAdapter()

> **createReactRouterAdapter**(`hooks`): [`RouterAdapter`](../interfaces/RouterAdapter.md)

Defined in: [packages/ui/src/adapters/react-router.ts:33](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/react-router.ts#L33)

Creates a [RouterAdapter](../interfaces/RouterAdapter.md) from React Router v6+ hooks.
Must be called inside a React Router context (e.g., \<BrowserRouter\>).

react-router-dom is NOT a dependency — import hooks yourself and pass them.

## Parameters

### hooks

[`ReactRouterHooks`](../interfaces/ReactRouterHooks.md)

## Returns

[`RouterAdapter`](../interfaces/RouterAdapter.md)
