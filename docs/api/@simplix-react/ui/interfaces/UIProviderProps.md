[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / UIProviderProps

# Interface: UIProviderProps

Defined in: [packages/ui/src/provider/ui-provider.tsx:29](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-provider.tsx#L29)

Props for the [UIProvider](../functions/UIProvider.md) component.

## Properties

### children

> **children**: `ReactNode`

Defined in: [packages/ui/src/provider/ui-provider.tsx:52](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-provider.tsx#L52)

***

### defaults?

> `optional` **defaults**: `Partial`\<[`UIDefaults`](UIDefaults.md)\>

Defined in: [packages/ui/src/provider/ui-provider.tsx:44](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-provider.tsx#L44)

Prop defaults for this whole console — see [UIDefaults](UIDefaults.md).

<p>Set here rather than on every screen: a default written per screen is one a new screen
forgets, and the screens then disagree about something the product decided once.

***

### design?

> `optional` **design**: `Design`

Defined in: [packages/ui/src/provider/ui-provider.tsx:51](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-provider.tsx#L51)

The design every slot is drawn in; see Design. Set it on the root provider only:
the provider writes `data-design` on the document element, so dialogs, popovers and toasts
rendered into `document.body` are drawn in it too. The design's own defaults sit under
[UIProviderProps.defaults](#defaults), which still win.

***

### overrides?

> `optional` **overrides**: `Partial`\<[`UIComponents`](UIComponents.md)\>

Defined in: [packages/ui/src/provider/ui-provider.tsx:31](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-provider.tsx#L31)

Partial overrides for default base and primitive components.

***

### statusTones?

> `optional` **statusTones**: `Partial`\<`Record`\<[`StatusTone`](../type-aliases/StatusTone.md), `Partial`\<[`StatusToneToken`](StatusToneToken.md)\>\>\>

Defined in: [packages/ui/src/provider/ui-provider.tsx:37](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-provider.tsx#L37)

Per-tone, per-slot class overrides for the status/severity palette
(success/warning/danger/…). Status tones are palette-literal, so this is
the channel for globally retoning status colors without forking components.
