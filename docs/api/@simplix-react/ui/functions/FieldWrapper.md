[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / FieldWrapper

# Function: FieldWrapper()

> **FieldWrapper**(`__namedParameters`): `Element`

Defined in: [packages/ui/src/fields/shared/field-wrapper.tsx:97](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/shared/field-wrapper.tsx#L97)

Wraps a form input with label, description, and error/warning display.
Handles label positioning, accessibility attributes, and field variants.

Message priority: error > warning > (description is always shown).

## Parameters

### \_\_namedParameters

[`FieldWrapperProps`](../interfaces/FieldWrapperProps.md)

## Returns

`Element`

## Example

```tsx
<FieldWrapper label="Name">
  {({ id }) => <Input id={id} value={v} onChange={…} />}
</FieldWrapper>
```
