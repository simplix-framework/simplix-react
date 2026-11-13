[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [mspdi](../README.md) / XmlWriter

# Class: XmlWriter

Defined in: [packages/gantt-core/src/mspdi/xml.ts:311](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L311)

Builds an indented XML document element by element. Elements are written
in the order the calls are made.

## Constructors

### Constructor

> **new XmlWriter**(): `XmlWriter`

#### Returns

`XmlWriter`

## Methods

### end()

> **end**(): `this`

Defined in: [packages/gantt-core/src/mspdi/xml.ts:326](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L326)

Closes the most recently opened element.

#### Returns

`this`

***

### leaf()

> **leaf**(`name`, `value`): `this`

Defined in: [packages/gantt-core/src/mspdi/xml.ts:336](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L336)

Writes an element holding only text. Nothing is written for undefined.

#### Parameters

##### name

`string`

##### value

`string` | `undefined`

#### Returns

`this`

***

### start()

> **start**(`name`, `attributes?`): `this`

Defined in: [packages/gantt-core/src/mspdi/xml.ts:316](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L316)

Opens an element; every later call writes inside it until `end`.

#### Parameters

##### name

`string`

##### attributes?

`Readonly`\<`Record`\<`string`, `string`\>\> = `{}`

#### Returns

`this`

***

### toString()

> **toString**(): `string`

Defined in: [packages/gantt-core/src/mspdi/xml.ts:344](https://github.com/simplix-react/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L344)

The finished document. Raises when an element is still open.

#### Returns

`string`
