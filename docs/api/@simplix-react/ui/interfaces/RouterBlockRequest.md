[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / RouterBlockRequest

# Interface: RouterBlockRequest

Defined in: [packages/ui/src/adapters/router-provider.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L12)

A request to hold every navigation that leaves the current route until the guard decides.

## Properties

### enabled

> **enabled**: `boolean`

Defined in: [packages/ui/src/adapters/router-provider.ts:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L14)

Whether navigations are held; `false` registers nothing.

***

### onBlocked()

> **onBlocked**: (`decision`) => `void`

Defined in: [packages/ui/src/adapters/router-provider.ts:19](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L19)

Called once for each held navigation (a link, `navigate`, or the browser's Back and Forward),
with the two ways to settle it. The navigation stays held until one of them is called.

#### Parameters

##### decision

[`RouterBlockDecision`](RouterBlockDecision.md)

#### Returns

`void`
