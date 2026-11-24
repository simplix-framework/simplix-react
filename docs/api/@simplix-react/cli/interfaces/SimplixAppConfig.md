[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / SimplixAppConfig

# Interface: SimplixAppConfig

Defined in: [config/types.ts:325](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L325)

One app's own settings (see [SimplixConfig.apps](SimplixConfig.md#apps)).

## Properties

### design?

> `readonly` `optional` **design**: [`SimplixDesignSource`](SimplixDesignSource.md)

Defined in: [config/types.ts:339](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L339)

Where the app's screens are designed before they are made; absent, no design gate runs for the app.

***

### moduleGroups?

> `readonly` `optional` **moduleGroups**: readonly `string`[]

Defined in: [config/types.ts:331](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L331)

Module groups (from `modules.groups`) whose modules hold this app's screens, so a page or a
scaffold for `--module <group>/<name>` is drawn from this app's templates. A group belongs to
at most one app; a group no app names keeps the top-level templates.

***

### templates?

> `readonly` `optional` **templates**: [`SimplixTemplatesConfig`](SimplixTemplatesConfig.md)

Defined in: [config/types.ts:337](https://github.com/simplix-framework/simplix-react/blob/main/config/types.ts#L337)

The app's templates. Read in this order, name by name: the project's
`.simplix/templates/<app>/`, the project's `.simplix/templates/`, the kit `from` names (this
app's, else the top-level one), each kit it extends, then the CLI's bundled template.
