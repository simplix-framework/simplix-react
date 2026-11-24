[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / WizardProps

# Interface: WizardProps

Defined in: [packages/ui/src/crud/form/wizard.tsx:187](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L187)

Props for the [Wizard](../variables/Wizard.md) compound component root.

```
┌─────────────────────────────────────────┐
│  (1) Basic ── (2) Details ── (3) Review │
├─────────────────────────────────────────┤
│                                         │
│  Active step content                    │
│                                         │
├─────────────────────────────────────────┤
│  [Previous]                     [Next]  │
└─────────────────────────────────────────┘
```

## Properties

### children

> **children**: `ReactNode`

Defined in: [packages/ui/src/crud/form/wizard.tsx:192](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L192)

One or more `<Wizard.Step>` children.

***

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/crud/form/wizard.tsx:190](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L190)

***

### onComplete()

> **onComplete**: () => `void`

Defined in: [packages/ui/src/crud/form/wizard.tsx:189](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L189)

Called when the user completes the final step.

#### Returns

`void`
