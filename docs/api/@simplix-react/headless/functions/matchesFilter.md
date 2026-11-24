[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/headless](../README.md) / matchesFilter

# Function: matchesFilter()

> **matchesFilter**(`record`, `key`, `value`): `boolean`

Defined in: [client-filter.ts:31](https://github.com/simplix-framework/simplix-react/blob/main/client-filter.ts#L31)

Whether one record passes one committed filter, the way a server reading the same key would.

<p>A filter bar and a chip row commit keys as `field.operator` (`name.contains`, `role.in`); a key
with no operator is compared for equality. Used where a list is processed in memory, so a filter
narrows the rows there exactly as it narrows them on a server rather than matching nothing.

## Parameters

### record

`Record`\<`string`, `unknown`\>

the row

### key

`string`

the committed key

### value

`unknown`

the committed value; an empty value narrows nothing

## Returns

`boolean`

whether the row stays
