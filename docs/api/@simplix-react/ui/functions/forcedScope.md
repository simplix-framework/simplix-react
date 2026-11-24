[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / forcedScope

# Function: forcedScope()

> **forcedScope**(`forced`): `string`

Defined in: [packages/ui/src/crud/entity/forced-list.ts:71](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/crud/entity/forced-list.ts#L71)

The scope string [adaptForcedList](adaptForcedList.md)'s narrowing amounts to.

<p>Pass it as `useCrudList`'s `scopeKey` beside every `adaptForcedList`. Without it the page
index survives a change of tab, chip or parent record and addresses a page of a result set that
no longer exists: the rows come back empty while the total that comes back with them is right,
so the toolbar states 「전체 57건」 over nothing. Reported from the 사용자 계정 tabs, where
paging into 활성 and then pressing 정지 drew a count over an empty table.

<p>Keys are sorted, so two objects that force the same thing produce the same string whatever
order the caller built them in — otherwise a `useMemo` returning a differently-ordered object
would look like a change of scope and reset the reader's page under them.

## Parameters

### forced

`Record`\<`string`, `unknown`\>

the parameters handed to [adaptForcedList](adaptForcedList.md)

## Returns

`string`

a stable string naming that narrowing
