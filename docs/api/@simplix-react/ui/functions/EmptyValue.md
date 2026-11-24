[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / EmptyValue

# Function: EmptyValue()

> **EmptyValue**(`__namedParameters`): `Element`

Defined in: [packages/ui/src/base/display/empty-value.tsx:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/empty-value.tsx#L30)

Muted placeholder for "no value" in contexts where a `DetailFields.*` component (which draws
its own empty badge) does not apply, such as table cells, editor summaries or custom inline
displays. Centralizes the placeholder text ([EMPTY\_VALUE\_TEXT](../variables/EMPTY_VALUE_TEXT.md)) and its muted styling so
empty rendering stays consistent.

## Parameters

### \_\_namedParameters

`EmptyValueProps`

## Returns

`Element`

## Example

```tsx
{value ? <span>{value}</span> : <EmptyValue />}
```
