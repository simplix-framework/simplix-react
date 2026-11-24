[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / EmptyValueBadge

# Function: EmptyValueBadge()

> **EmptyValueBadge**(`__namedParameters`): `Element`

Defined in: [packages/ui/src/base/display/empty-value-badge.tsx:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/empty-value-badge.tsx#L25)

Muted dashed-outline badge that explicitly marks a missing value, so a
blank field reads as "no value" rather than a rendering error. Every
`DetailFields.*` component renders it as the default empty fallback; use it
directly in custom detail-style displays that bypass `DetailFields.*`. For
table cells and other compact non-field contexts, use [EmptyValue](EmptyValue.md)
(a hyphen) instead.

## Parameters

### \_\_namedParameters

[`EmptyValueBadgeProps`](../interfaces/EmptyValueBadgeProps.md)

## Returns

`Element`

## Example

```tsx
{provider ? <ProviderSummary provider={provider} /> : <EmptyValueBadge />}
```
