[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / loadProjectTemplates

# Function: loadProjectTemplates()

> **loadProjectTemplates**(`root`, `from?`, `app?`, `option?`): `Promise`\<[`ProjectTemplates`](../type-aliases/ProjectTemplates.md)\>

Defined in: [utils/project-templates.ts:302](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L302)

The templates in force for a page, name by name: the app's own `.simplix/templates/<app>/*.hbs`,
then the project's `.simplix/templates/*.hbs`, then the UI kit's templates, then those of each kit
it extends, each name falling through to the next layer and finally to the CLI's bundled one.

<p>`{{@kit.package}}`, `{{@kit.label}}` and `{{@kit.id}}` are written into every layer's templates
as the kit `from` names, so a base kit's template imports from whichever kit the project draws with.

<p>Returns an empty map where no layer has a template, which is every project that has not
taken one over and draws with no kit that ships any.

## Parameters

### root

`string`

### from?

`string`

the `templates.from` setting in force for the page (the app's, else the top-level one)

### app?

`string`

the app the page is generated for; undefined reads no app layer

### option?

`string`

how the config spells `from`, for the error a kit that cannot be found raises

## Returns

`Promise`\<[`ProjectTemplates`](../type-aliases/ProjectTemplates.md)\>
