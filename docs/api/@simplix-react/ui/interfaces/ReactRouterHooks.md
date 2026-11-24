[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / ReactRouterHooks

# Interface: ReactRouterHooks

Defined in: [packages/ui/src/adapters/react-router.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/react-router.ts#L9)

React Router v6+ hook references required to create a router adapter.

## Properties

### useBlocker()?

> `optional` **useBlocker**: (`shouldBlock`) => `object`

Defined in: [packages/ui/src/adapters/react-router.ts:24](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/react-router.ts#L24)

React Router's `useBlocker`, which needs a data router (`createBrowserRouter`). Pass it to let
an unsaved-changes guard hold Back and in-app links; leave it out under `<BrowserRouter>`,
where the hook throws.

#### Parameters

##### shouldBlock

`boolean`

#### Returns

`object`

##### proceed()?

> `optional` **proceed**: () => `void`

###### Returns

`void`

##### reset()?

> `optional` **reset**: () => `void`

###### Returns

`void`

##### state

> **state**: `string`

***

### useLocation()

> **useLocation**: () => `object`

Defined in: [packages/ui/src/adapters/react-router.ts:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/react-router.ts#L18)

#### Returns

`object`

##### pathname

> **pathname**: `string`

***

### useNavigate()

> **useNavigate**: () => (`to`, `options?`) => `void`

Defined in: [packages/ui/src/adapters/react-router.ts:10](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/react-router.ts#L10)

#### Returns

> (`to`, `options?`): `void`

##### Parameters

###### to

`string`

###### options?

###### replace?

`boolean`

##### Returns

`void`

***

### useSearchParams()

> **useSearchParams**: () => \[`URLSearchParams`, (`params`, `options?`) => `void`\]

Defined in: [packages/ui/src/adapters/react-router.ts:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/react-router.ts#L11)

#### Returns

\[`URLSearchParams`, (`params`, `options?`) => `void`\]
