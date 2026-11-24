[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / EntityOption

# Interface: EntityOption

Defined in: [packages/ui/src/crud/entity/entity-options.ts:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L11)

A `{ label, value }` option consumed by both EntityCombobox and the
FilterBar faceted filter. Deliberately icon-free: the two consumers type their
optional `icon` differently (ReactNode vs a component type), so an option that
omits it stays assignable to both.

## Properties

### label

> **label**: `string`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:12](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L12)

***

### value

> **value**: `string`

Defined in: [packages/ui/src/crud/entity/entity-options.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/entity-options.ts#L13)
