[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / CommandFailed

# Type Alias: CommandFailed\<TVariables\>

> **CommandFailed**\<`TVariables`\> = `string` \| (`reason`, `variables`, `caught`) => `string`

Defined in: [packages/ui/src/crud/form/use-command.ts:36](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/form/use-command.ts#L36)

The words a command says when it fails.

A sentence is shown only when the server sent none of its own (`serverMessage(caught) ?? failed`).
A function is always called, with the server's sentence as `reason` (or `undefined`), so a
catalog entry such as 「Could not cancel: {{reason}}」 can carry it.

## Type Parameters

### TVariables

`TVariables`
