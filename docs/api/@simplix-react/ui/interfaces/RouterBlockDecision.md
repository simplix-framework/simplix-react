[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / RouterBlockDecision

# Interface: RouterBlockDecision

Defined in: [packages/ui/src/adapters/router-provider.ts:4](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L4)

What a router hands a guard when it holds a navigation back.

## Properties

### proceed()

> **proceed**: () => `void`

Defined in: [packages/ui/src/adapters/router-provider.ts:6](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L6)

Lets the held navigation go through.

#### Returns

`void`

***

### reset()

> **reset**: () => `void`

Defined in: [packages/ui/src/adapters/router-provider.ts:8](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/adapters/router-provider.ts#L8)

Drops the held navigation and stays on the current route.

#### Returns

`void`
