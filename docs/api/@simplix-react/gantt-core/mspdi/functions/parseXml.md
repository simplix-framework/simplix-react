[**Documentation**](../../../../README.md)

***

[Documentation](../../../../README.md) / [@simplix-react/gantt-core](../../README.md) / [mspdi](../README.md) / parseXml

# Function: parseXml()

> **parseXml**(`source`): [`XmlElement`](../interfaces/XmlElement.md)

Defined in: [packages/gantt-core/src/mspdi/xml.ts:266](https://github.com/simplix-framework/simplix-react/blob/main/packages/gantt-core/src/mspdi/xml.ts#L266)

Parses an XML document into its root element. A leading byte order mark is
ignored. Raises `ScheduleError("invalid-xml")` for a document that is not
well formed.

## Parameters

### source

`string`

## Returns

[`XmlElement`](../interfaces/XmlElement.md)
