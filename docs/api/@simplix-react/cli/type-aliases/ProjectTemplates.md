[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/cli](../README.md) / ProjectTemplates

# Type Alias: ProjectTemplates

> **ProjectTemplates** = `ReadonlyMap`\<`string`, `string`\>

Defined in: [utils/project-templates.ts:23](https://github.com/simplix-framework/simplix-react/blob/main/utils/project-templates.ts#L23)

The templates a project has taken over, keyed by the name of the bundled template each replaces.

<p>A generated page is the one artifact a project rewrites the moment it is emitted: the CLI
knows the entity's operations and nothing about the chrome this console puts around them - its
status tiles, its notice cards, its tab strip. Shipping that chrome in the CLI would put one
product's decisions in every product's generator, so the project states them here and the CLI
renders what it finds.

<p>A name with no file falls through to the bundled template, so a project overrides the one
page shape it cares about without carrying copies of the rest.
