[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CrudErrorBoundaryProps

# Interface: CrudErrorBoundaryProps

Defined in: [packages/ui/src/crud/shared/error-boundary.tsx:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/error-boundary.tsx#L13)

Props for the [CrudErrorBoundary](../classes/CrudErrorBoundary.md) component.

## Properties

### children

> **children**: `ReactNode`

Defined in: [packages/ui/src/crud/shared/error-boundary.tsx:14](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/error-boundary.tsx#L14)

***

### fallback?

> `optional` **fallback**: `ReactNode` \| (`error`, `reset`) => `ReactNode`

Defined in: [packages/ui/src/crud/shared/error-boundary.tsx:15](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/error-boundary.tsx#L15)

***

### onError()?

> `optional` **onError**: (`error`, `errorInfo`) => `void`

Defined in: [packages/ui/src/crud/shared/error-boundary.tsx:16](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/shared/error-boundary.tsx#L16)

#### Parameters

##### error

`Error`

##### errorInfo

`ErrorInfo`

#### Returns

`void`
