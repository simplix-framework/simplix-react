[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / KitLayer

# Interface: KitLayer

Defined in: [utils/project-templates.ts:123](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L123)

One kit in the chain a project draws with: the package and the template directory it declares.

## Properties

### dir

> `readonly` **dir**: `string`

Defined in: [utils/project-templates.ts:127](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L127)

The package directory.

***

### id?

> `readonly` `optional` **id**: `string`

Defined in: [utils/project-templates.ts:131](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L131)

The `simplix.id` the package declares.

***

### name

> `readonly` **name**: `string`

Defined in: [utils/project-templates.ts:125](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L125)

The package name, from its manifest.

***

### templates?

> `readonly` `optional` **templates**: `string`

Defined in: [utils/project-templates.ts:129](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L129)

The template directory the package declares, undefined where it declares none.
