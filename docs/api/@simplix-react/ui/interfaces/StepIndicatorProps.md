[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / StepIndicatorProps

# Interface: StepIndicatorProps

Defined in: [packages/ui/src/crud/form/wizard.tsx:52](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L52)

Props for [StepIndicator](../functions/StepIndicator.md).

## Properties

### currentStep

> **currentStep**: `number`

Defined in: [packages/ui/src/crud/form/wizard.tsx:56](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L56)

The step in hand; every step before it is done. Pass `steps.length` when all are done.

***

### label?

> `optional` **label**: `string`

Defined in: [packages/ui/src/crud/form/wizard.tsx:60](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L60)

Names the list for assistive technology; the wizard's own label when absent.

***

### onSelect()?

> `optional` **onSelect**: (`index`) => `void`

Defined in: [packages/ui/src/crud/form/wizard.tsx:81](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L81)

Makes a step the reader has passed a button that goes back to it. A step ahead of the one in
hand is never selectable: it has not been answered yet. Without it the strip only shows where
the reader is.

#### Parameters

##### index

`number`

#### Returns

`void`

***

### orientation?

> `optional` **orientation**: `"horizontal"` \| `"vertical"`

Defined in: [packages/ui/src/crud/form/wizard.tsx:67](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L67)

`horizontal` (the wizard's) runs the steps along one line; `vertical` stacks them down a rule,
for a side column where a long chain would otherwise run past its box.

#### Default

```ts
"horizontal"
```

***

### rejectedStep?

> `optional` **rejectedStep**: `number`

Defined in: [packages/ui/src/crud/form/wizard.tsx:58](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L58)

A step that was turned back: drawn as rejected instead of in hand.

***

### selectDisabled?

> `optional` **selectDisabled**: `boolean`

Defined in: [packages/ui/src/crud/form/wizard.tsx:83](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L83)

Stops every selectable step from answering, while something is being sent.

***

### steps

> **steps**: readonly `object`[]

Defined in: [packages/ui/src/crud/form/wizard.tsx:54](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L54)

The steps in order: what each is, and an optional second line (who holds it, when it closed).

***

### variant?

> `optional` **variant**: `"line"` \| `"cells"`

Defined in: [packages/ui/src/crud/form/wizard.tsx:75](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L75)

`line` joins the markers with a rule; `cells` draws each step as a box of its own, side by side
and as wide as the others, for a form whose steps are the first thing the reader meets. A cells
strip is always horizontal and draws no rule.

#### Default

```ts
"line"
```
