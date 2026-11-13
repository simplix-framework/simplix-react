[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / DurationWords

# Interface: DurationWords

Defined in: [lib/duration-text.ts:7](https://github.com/simplix-react/simplix-react/blob/main/lib/duration-text.ts#L7)

The words a language writes durations with.

## Properties

### elapsed

> **elapsed**: `string`

Defined in: [lib/duration-text.ts:11](https://github.com/simplix-react/simplix-react/blob/main/lib/duration-text.ts#L11)

What marks an elapsed duration. The single letter `e` goes between the number and the unit; anything else goes in front.

***

### units

> **units**: `Readonly`\<`Record`\<`DurationUnit`, `string`\>\>

Defined in: [lib/duration-text.ts:9](https://github.com/simplix-react/simplix-react/blob/main/lib/duration-text.ts#L9)

The word for each unit, such as `일` for a day.
