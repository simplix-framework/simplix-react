[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / KitChain

# Interface: KitChain

Defined in: [utils/project-templates.ts:140](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L140)

The kit a project draws with and every kit it extends, base first.

<p>Empty where the project names no kit and depends on none. A `templates.from` path that holds no
manifest is one template directory with no kit around it.

## Properties

### kit?

> `readonly` `optional` **kit**: [`KitLayer`](KitLayer.md)

Defined in: [utils/project-templates.ts:143](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L143)

The kit `templates.from` names (the last layer), which `{{@kit.*}}` describes.

***

### layers

> `readonly` **layers**: readonly [`KitLayer`](KitLayer.md)[]

Defined in: [utils/project-templates.ts:141](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L141)
