[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / STATUS\_TONES

# Variable: STATUS\_TONES

> `const` **STATUS\_TONES**: `Record`\<[`StatusTone`](../type-aliases/StatusTone.md), [`StatusToneToken`](../interfaces/StatusToneToken.md)\>

Defined in: [packages/ui/src/base/status-tone.ts:65](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/status-tone.ts#L65)

The tone table. Hue assignments:
success→emerald, warning→amber, danger→red, info→blue, neutral→slate,
pending→orange (distinct "awaiting action" hue), processing→blue (shares the
info hue; conventionally rendered with `pulse`/animation to signal in-flight).
