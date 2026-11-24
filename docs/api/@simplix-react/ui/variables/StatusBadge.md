[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / StatusBadge

# Variable: StatusBadge

> `const` **StatusBadge**: `ForwardRefExoticComponent`\<`Omit`\<[`StatusBadgeProps`](../interfaces/StatusBadgeProps.md), `"ref"`\> & `RefAttributes`\<`HTMLSpanElement`\>\>

Defined in: [packages/ui/src/base/display/status-badge.tsx:52](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/status-badge.tsx#L52)

Compact status pill combining a tone-colored label with an optional leading
dot or icon.

`appearance="filled"` uses the tone's soft filled background; `outline` draws
a tone-colored border over a transparent background. A leading icon adopts the
tone's standalone icon color in outline mode; a leading dot mirrors the tone
(and pulses when `pulse` is set). An icon has no ring of its own, so `pulse` with an icon glows
the badge itself.

## Example

```tsx
<StatusBadge tone="success" label="Active" showDot />
<StatusBadge tone="danger" label="Failed" appearance="filled" />
```
