[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / SectionShellProps

# Interface: SectionShellProps

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:75](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L75)

Shared props for section components (CrudDetail.Section, CrudForm.Section).

## Extended by

- [`CrudFormSectionProps`](CrudFormSectionProps.md)
- [`CrudDetailSectionProps`](CrudDetailSectionProps.md)

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:89](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L89)

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:88](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L88)

***

### collapsible?

> `optional` **collapsible**: `boolean`

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:85](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L85)

Enable collapsible behavior (default: false).

***

### defaultOpen?

> `optional` **defaultOpen**: `boolean`

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:87](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L87)

Initial open state when collapsible (default: true).

***

### description?

> `optional` **description**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:77](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L77)

***

### sectionTitle?

> `optional` **sectionTitle**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:79](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L79)

Group title rendered above the card.

***

### title?

> `optional` **title**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:76](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L76)

***

### trailing?

> `optional` **trailing**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:83](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L83)

Content rendered on the right side of the section header.

***

### variant?

> `optional` **variant**: `"flat"` \| `"card"` \| `"lined"`

Defined in: [packages/ui/src/crud/shared/section-shell.tsx:81](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/section-shell.tsx#L81)

Visual style: `"card"` (default) renders with border and shadow, `"flat"` renders without, `"lined"` adds a left border on the body.
