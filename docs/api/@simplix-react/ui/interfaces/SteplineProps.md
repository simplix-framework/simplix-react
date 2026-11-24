[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / SteplineProps

# Interface: SteplineProps

Defined in: [packages/ui/src/base/display/stepline.tsx:21](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/stepline.tsx#L21)

Props for the [Stepline](../functions/Stepline.md) component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/base/display/stepline.tsx:38](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/stepline.tsx#L38)

***

### completedKeys?

> `optional` **completedKeys**: `string`[]

Defined in: [packages/ui/src/base/display/stepline.tsx:30](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/stepline.tsx#L30)

Keys rendered as done regardless of position — for flows whose completion
is judged out of order (e.g. server-reported step states).

***

### current?

> `optional` **current**: `string`

Defined in: [packages/ui/src/base/display/stepline.tsx:25](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/stepline.tsx#L25)

Key of the active step; steps before it render as done.

***

### items

> **items**: [`SteplineItem`](SteplineItem.md)[]

Defined in: [packages/ui/src/base/display/stepline.tsx:23](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/stepline.tsx#L23)

Ordered steps.

***

### orientation?

> `optional` **orientation**: `"horizontal"` \| `"vertical"`

Defined in: [packages/ui/src/base/display/stepline.tsx:37](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/display/stepline.tsx#L37)

Layout direction. Horizontal (default) renders numbered circles joined by
connector lines — the classic wizard stepper; vertical stacks the same
circles with labels beside them for tall sidebars.

#### Default Value

```ts
"horizontal"
```
