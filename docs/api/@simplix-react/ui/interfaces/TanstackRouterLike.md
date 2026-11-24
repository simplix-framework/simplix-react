[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / TanstackRouterLike

# Interface: TanstackRouterLike

Defined in: [packages/ui/src/adapters/tanstack-router.ts:84](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/tanstack-router.ts#L84)

The part of a TanStack Router instance the adapter reads, so this package needs no dependency
on the router: any `createRouter(...)` result has it.

## Properties

### history?

> `readonly` `optional` **history**: `object`

Defined in: [packages/ui/src/adapters/tanstack-router.ts:92](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/tanstack-router.ts#L92)

The router's history. Its `block` registers a function asked before every navigation, and a
truthy answer holds the navigation back. Without it the adapter offers no `useBlocker`.

#### block()

> **block**(`blocker`): () => `void`

##### Parameters

###### blocker

###### blockerFn

() => `boolean` \| `Promise`\<`boolean`\>

###### enableBeforeUnload?

`boolean`

##### Returns

> (): `void`

###### Returns

`void`

***

### state

> `readonly` **state**: `object`

Defined in: [packages/ui/src/adapters/tanstack-router.ts:85](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/tanstack-router.ts#L85)

#### location

> `readonly` **location**: `object`

##### location.pathname

> `readonly` **pathname**: `string`

##### location.searchStr

> `readonly` **searchStr**: `string`

## Methods

### navigate()

> **navigate**(`options`): `Promise`\<`unknown`\>

Defined in: [packages/ui/src/adapters/tanstack-router.ts:86](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/tanstack-router.ts#L86)

#### Parameters

##### options

###### replace?

`boolean`

###### search?

`Record`\<`string`, `string`\>

###### to

`string`

#### Returns

`Promise`\<`unknown`\>

***

### subscribe()

> **subscribe**(`eventType`, `fn`): () => `void`

Defined in: [packages/ui/src/adapters/tanstack-router.ts:87](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/tanstack-router.ts#L87)

#### Parameters

##### eventType

`"onLoad"` | `"onBeforeLoad"` | `"onResolved"`

##### fn

() => `void`

#### Returns

> (): `void`

##### Returns

`void`
