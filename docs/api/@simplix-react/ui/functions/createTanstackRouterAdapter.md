[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / createTanstackRouterAdapter

# Function: createTanstackRouterAdapter()

> **createTanstackRouterAdapter**(`router`): [`RouterAdapter`](../interfaces/RouterAdapter.md)

Defined in: [packages/ui/src/adapters/tanstack-router.ts:122](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/tanstack-router.ts#L122)

Creates the [RouterAdapter](../interfaces/RouterAdapter.md) the framework's screens navigate through, from a TanStack
Router instance.

## Parameters

### router

[`TanstackRouterLike`](../interfaces/TanstackRouterLike.md)

The app's router.

## Returns

[`RouterAdapter`](../interfaces/RouterAdapter.md)

The adapter to provide through `RouterContext`.

## Remarks

Built from the router instance rather than its hooks, because the adapter is provided above
`RouterProvider`, where those hooks have nothing to read yet. `useCurrentPath` is a hook by
contract and subscribes to the router's own location events, so it works anywhere below.
A widget that sends the reader elsewhere asks for this adapter rather than importing the router,
so a module stays independent of which router the app mounts; without it the hook answers null
and the affordance does not render.

## Example

```tsx
const router = createRouter({ routeTree, basepath: import.meta.env.BASE_URL, ...flatSearch });
const routerAdapter = createTanstackRouterAdapter(router);
<RouterContext.Provider value={routerAdapter}><RouterProvider router={router} /></RouterContext.Provider>
```
