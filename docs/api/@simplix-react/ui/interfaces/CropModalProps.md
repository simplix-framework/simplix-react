[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CropModalProps

# Interface: CropModalProps

Defined in: [packages/ui/src/fields/image-attachment/components/crop-modal.tsx:39](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/image-attachment/components/crop-modal.tsx#L39)

## Properties

### file

> **file**: `File` \| `null`

Defined in: [packages/ui/src/fields/image-attachment/components/crop-modal.tsx:41](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/image-attachment/components/crop-modal.tsx#L41)

***

### initialRatio?

> `optional` **initialRatio**: `number`

Defined in: [packages/ui/src/fields/image-attachment/components/crop-modal.tsx:49](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/image-attachment/components/crop-modal.tsx#L49)

Aspect ratio preselected each time the modal opens: -1 = original (default),
0 = free, > 0 = fixed ratio (e.g. 1 for a square avatar crop).

***

### onClose()

> **onClose**: () => `void`

Defined in: [packages/ui/src/fields/image-attachment/components/crop-modal.tsx:42](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/image-attachment/components/crop-modal.tsx#L42)

#### Returns

`void`

***

### onSave()

> **onSave**: (`area`) => `void`

Defined in: [packages/ui/src/fields/image-attachment/components/crop-modal.tsx:44](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/image-attachment/components/crop-modal.tsx#L44)

area === null means "original" - upload the source file without cropping.

#### Parameters

##### area

[`CropArea`](CropArea.md) | `null`

#### Returns

`void`

***

### open

> **open**: `boolean`

Defined in: [packages/ui/src/fields/image-attachment/components/crop-modal.tsx:40](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/fields/image-attachment/components/crop-modal.tsx#L40)
