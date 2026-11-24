[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / MediaEmbedProps

# Interface: MediaEmbedProps

Defined in: [packages/ui/src/base/display/media-embed.tsx:6](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/media-embed.tsx#L6)

Props for the [MediaEmbed](../functions/MediaEmbed.md) component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/base/display/media-embed.tsx:22](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/media-embed.tsx#L22)

***

### height?

> `optional` **height**: `number`

Defined in: [packages/ui/src/base/display/media-embed.tsx:19](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/media-embed.tsx#L19)

Frame height in CSS pixels; `video`/16:9 frames size themselves. Defaults to 384 for document frames.

***

### kind

> **kind**: `"video"` \| `"frame"`

Defined in: [packages/ui/src/base/display/media-embed.tsx:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/media-embed.tsx#L11)

`video` renders a native player for a self-hosted stream (playback-end
observable); `frame` embeds an external player or document viewer.

***

### onEnded()?

> `optional` **onEnded**: () => `void`

Defined in: [packages/ui/src/base/display/media-embed.tsx:17](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/media-embed.tsx#L17)

Fires when a `video` finishes playing (completion tracking).

#### Returns

`void`

***

### src

> **src**: `string`

Defined in: [packages/ui/src/base/display/media-embed.tsx:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/media-embed.tsx#L13)

Media/document source URL.

***

### title?

> `optional` **title**: `string`

Defined in: [packages/ui/src/base/display/media-embed.tsx:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/media-embed.tsx#L15)

Accessible title for the embedded frame.

***

### widescreen?

> `optional` **widescreen**: `boolean`

Defined in: [packages/ui/src/base/display/media-embed.tsx:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/media-embed.tsx#L21)

Render `frame` at a 16:9 aspect (external video embeds); defaults to false.
