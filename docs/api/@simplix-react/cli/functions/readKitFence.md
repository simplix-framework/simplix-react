[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / readKitFence

# Function: readKitFence()

> **readKitFence**(`rootDir`, `kit`): `Promise`\<[`FencedImport`](../interfaces/FencedImport.md)[]\>

Defined in: [commands/kit-fence.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/commands/kit-fence.ts#L31)

The fence a project's kit puts around its screens: the `simplix.fence` of every kit in its chain,
the core kit's first, with the kit's own values written in place of `{{@kit.*}}`.

<p>A core kit declares the fence its design kits share once and names the design kit through
`{{@kit.package}}`, so a screen is refused the same imports whichever design draws it; a design
kit's own entries follow the core's.

## Parameters

### rootDir

`string`

### kit

`string`

## Returns

`Promise`\<[`FencedImport`](../interfaces/FencedImport.md)[]\>
