[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / StatusTone

# Type Alias: StatusTone

> **StatusTone** = `"success"` \| `"warning"` \| `"danger"` \| `"info"` \| `"neutral"` \| `"pending"` \| `"processing"`

Defined in: [packages/api/dist/index.d.ts:232](https://github.com/simplix-framework/simplix-react/blob/main/packages/api/dist/index.d.ts#L232)

The status tone vocabulary a server contract declares a value's tone in, and the one every
status badge, dot and banner of `@simplix-react/ui` draws.

It lives here rather than in the UI package because a generated domain package declares the
tone of each enum value it carries (`<Enum>Tones`), and a domain package depends on this
package and never on the UI. `@simplix-react/ui` re-exports this type under the same name.

## Example

```ts
import type { StatusTone } from "@simplix-react/api";

const tone: StatusTone = EmailStatusTones[status] ?? "neutral";
```
