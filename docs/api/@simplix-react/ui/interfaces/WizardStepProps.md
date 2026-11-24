[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / WizardStepProps

# Interface: WizardStepProps

Defined in: [packages/ui/src/crud/form/wizard.tsx:34](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L34)

Props for the Wizard.Step sub-component.

Each step defines its title, optional description, and an optional
async validation function that must return `true` to proceed.

## Properties

### children

> **children**: `ReactNode`

Defined in: [packages/ui/src/crud/form/wizard.tsx:42](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L42)

Step content.

***

### description?

> `optional` **description**: `string`

Defined in: [packages/ui/src/crud/form/wizard.tsx:38](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L38)

Optional description shown below the title.

***

### title

> **title**: `string`

Defined in: [packages/ui/src/crud/form/wizard.tsx:36](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L36)

Step title displayed in the step indicator.

***

### validate()?

> `optional` **validate**: () => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/ui/src/crud/form/wizard.tsx:40](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/wizard.tsx#L40)

Validation function called before advancing. Return `false` to block navigation.

#### Returns

`boolean` \| `Promise`\<`boolean`\>
