[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [mspdi](../README.md) / XmlElement

# Interface: XmlElement

Defined in: [packages/gantt-core/src/mspdi/xml.ts:7](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L7)

One element of a parsed XML document. Every value is kept as the string the
document holds; nothing is converted to a number or a boolean.

## Properties

### attributes

> `readonly` **attributes**: `Readonly`\<`Record`\<`string`, `string`\>\>

Defined in: [packages/gantt-core/src/mspdi/xml.ts:10](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L10)

***

### children

> `readonly` **children**: readonly `XmlElement`[]

Defined in: [packages/gantt-core/src/mspdi/xml.ts:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L11)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/gantt-core/src/mspdi/xml.ts:9](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L9)

Qualified name as written, prefix included.

***

### text

> `readonly` **text**: `string`

Defined in: [packages/gantt-core/src/mspdi/xml.ts:13](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L13)

Character data directly inside the element (text and CDATA), entities decoded.
