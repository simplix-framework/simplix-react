[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CommandInvalidation

# Type Alias: CommandInvalidation

> **CommandInvalidation** = `string` \| `QueryKey`

Defined in: [packages/ui/src/crud/form/use-command.ts:46](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L46)

What a command refreshes once it has written. A string is an API prefix and refreshes every
query whose first key element starts with it, the way [useInvalidateEntity](../functions/useInvalidateEntity.md) does (a
generated `<entity>EntityPath` fits here); an array is one query key, refreshed by prefix match
on its elements, the way `queryClient.invalidateQueries({ queryKey })` does.
