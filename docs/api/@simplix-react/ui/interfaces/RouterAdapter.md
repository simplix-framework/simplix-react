[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / RouterAdapter

# Interface: RouterAdapter

Defined in: [packages/ui/src/adapters/router-provider.ts:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L23)

Router abstraction interface. Adapters (e.g., React Router) implement this contract.

## Properties

### getSearchParams()

> **getSearchParams**: () => `URLSearchParams`

Defined in: [packages/ui/src/adapters/router-provider.ts:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L25)

#### Returns

`URLSearchParams`

***

### navigate()

> **navigate**: (`to`, `options?`) => `void`

Defined in: [packages/ui/src/adapters/router-provider.ts:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L24)

#### Parameters

##### to

`string`

##### options?

###### replace?

`boolean`

#### Returns

`void`

***

### setSearchParams()

> **setSearchParams**: (`params`, `options?`) => `void`

Defined in: [packages/ui/src/adapters/router-provider.ts:26](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L26)

#### Parameters

##### params

`URLSearchParams`

##### options?

###### replace?

`boolean`

#### Returns

`void`

***

### useBlocker()?

> `optional` **useBlocker**: (`request`) => `void`

Defined in: [packages/ui/src/adapters/router-provider.ts:36](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L36)

A hook that holds navigations away from the current route while `enabled`. Optional: an
adapter over a router that cannot hold a navigation leaves it out, and a guard then covers
only the navigations the page makes itself.

#### Parameters

##### request

[`RouterBlockRequest`](RouterBlockRequest.md)

#### Returns

`void`

***

### useCurrentPath()

> **useCurrentPath**: () => `string`

Defined in: [packages/ui/src/adapters/router-provider.ts:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L30)

#### Returns

`string`
