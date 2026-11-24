[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / UIDefaults

# Interface: UIDefaults

Defined in: [packages/ui/src/provider/ui-defaults-context.ts:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-defaults-context.ts#L15)

Prop defaults a product sets once for its whole console.

<p><b>Why a channel rather than a better default.</b> Some choices are genuinely the product's
and not the framework's — how dense a row action should read depends on how often the people
using it open the console at all. The framework keeps a defensible default; a product that
wants another one says so in one place instead of in every screen, and a screen that forgets
to say it is then impossible rather than merely unlikely.

## Properties

### actionVariant

> **actionVariant**: [`ActionVariant`](../type-aliases/ActionVariant.md)

Defined in: [packages/ui/src/provider/ui-defaults-context.ts:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-defaults-context.ts#L23)

How a list or tree row draws its action cluster when the screen does not say.

<p>`"icon"` is the framework's own default: a compact strip that costs the least width and
asks the reader to know what each glyph means. A console whose readers open it rarely wants
`"ghost"`, where the label rides beside the icon.

***

### density

> **density**: `"default"` \| `"compact"` \| `"comfortable"`

Defined in: [packages/ui/src/provider/ui-defaults-context.ts:50](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-defaults-context.ts#L50)

How tightly tables and lists set their rows when the screen does not say.

<p>An installation's choice for the same reason as [UIDefaults.detailPresentation](#detailpresentation): it
follows the operators' monitors and how much they read at once, and a design may bring its own
default (a quieter design breathes more).

***

### detailPresentation

> **detailPresentation**: `"dialog"` \| `"panel"` \| `"drawer"`

Defined in: [packages/ui/src/provider/ui-defaults-context.ts:42](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-defaults-context.ts#L42)

How a list screen opens the record a reader picked, when the screen does not say.

<p>`"panel"` is the framework's own default and what every screen has drawn until now: the
detail takes a column beside the list, with a draggable divider between them. `"drawer"` slides
it in from the right edge over the full height instead, leaving the list at its full width
underneath.

<p><b>This is an installation's choice, not a screen's.</b> The two show the same detail, with
the same content, opened by the same act and closed back to the same list — what differs is
where it appears, which is a matter of how wide the operators' monitors are and how they like
to work. A screen that hardcodes one takes that choice away from every installation, which is
why it belongs here.

<p>`"dialog"` opens the record as a centred modal capped at `max-w-2xl`: the record reads as a
short interruption rather than the thing being worked on, so it suits an installation whose
records are brief. A screen can still choose its own presentation on `variant`.

***

### languageSelectorPlacement

> **languageSelectorPlacement**: [`LanguageSelectorPlacement`](../type-aliases/LanguageSelectorPlacement.md)

Defined in: [packages/ui/src/provider/ui-defaults-context.ts:66](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-defaults-context.ts#L66)

Where an i18n text field or textarea draws its language selector when the field does not say.

<p>`"label"` is the framework's own default: the selector sits beside the label, above the
control. `"inset"` draws it inside the control, at the inline end of an input and in the
bottom inline-end corner of a textarea, with the text kept clear of it. A form-wide look,
so an installation picks it once at its root; a field can still set its own.

***

### listPresentation

> **listPresentation**: `"table"` \| `"auto"` \| `"cards"`

Defined in: [packages/ui/src/provider/ui-defaults-context.ts:57](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/provider/ui-defaults-context.ts#L57)

How a record list draws its rows when the screen does not say.

<p>`"auto"` draws a table while its columns fit and cards once the list is narrower than its
columns need; `"table"` and `"cards"` hold one shape at every width.
