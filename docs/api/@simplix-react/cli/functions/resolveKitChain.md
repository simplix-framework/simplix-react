[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / resolveKitChain

# Function: resolveKitChain()

> **resolveKitChain**(`root`, `from?`, `option?`): `Promise`\<[`KitChain`](../interfaces/KitChain.md)\>

Defined in: [utils/project-templates.ts:193](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L193)

The kit chain a project draws with.

<p>`from` is a package name or a path. Without it, the dependencies of the project root that are
kits are taken, less any that another of them extends; two left over are refused, since nothing
says which one the project means.

## Parameters

### root

`string`

### from?

`string`

### option?

`string` = `"templates.from"`

how the config spells `from`, for the error a kit that cannot be found raises

## Returns

`Promise`\<[`KitChain`](../interfaces/KitChain.md)\>
