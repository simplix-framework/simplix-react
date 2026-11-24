[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/process-core](../README.md) / Patch

# Type Alias: Patch\<T\>

> **Patch**\<`T`\> = `{ [K in keyof T]?: T[K] }` & `Record`\<`string`, `unknown`\>

Defined in: [packages/process-core/src/edit.ts:11](https://github.com/simplix-framework/simplix-react/blob/main/packages/process-core/src/edit.ts#L11)

Members of a part to set. A member given as `undefined` is taken off the part. Members this
package does not know are set like any other, so a caller keeps its own fields through the
same operation.

## Type Parameters

### T

`T`
