[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / UseUnsavedChangesReturn

# Interface: UseUnsavedChangesReturn

Defined in: [packages/ui/src/crud/form/use-unsaved-changes.tsx:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-unsaved-changes.tsx#L16)

Return value of the [useUnsavedChanges](../functions/useUnsavedChanges.md) hook.

## Properties

### dialog

> **dialog**: `ReactNode`

Defined in: [packages/ui/src/crud/form/use-unsaved-changes.tsx:20](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-unsaved-changes.tsx#L20)

Alert dialog element to render in your component's JSX.

***

### guardedNavigate()

> **guardedNavigate**: (`callback`) => `void`

Defined in: [packages/ui/src/crud/form/use-unsaved-changes.tsx:18](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-unsaved-changes.tsx#L18)

Wrap navigation callbacks with this to show a confirmation dialog when dirty.

#### Parameters

##### callback

() => `void`

#### Returns

`void`
