[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / GanttStoreState

# Interface: GanttStoreState

Defined in: [model/gantt-store.ts:45](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L45)

Reactive state of one chart, with the edits that change it.

## Properties

### baselineNumber

> **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store.ts:58](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L58)

Baseline drawn under the bars, or `null` for none.

***

### baselineSlot

> **baselineSlot**: `number`

Defined in: [model/gantt-store.ts:60](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L60)

Baseline the save, show and clear commands work on, 0 to 10.

***

### clipboard

> **clipboard**: `TaskClipboard` \| `null`

Defined in: [model/gantt-store.ts:63](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L63)

***

### clipboardText

> **clipboardText**: `string` \| `null`

Defined in: [model/gantt-store.ts:65](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L65)

The copied tasks as tab-separated text, as it was handed to the system clipboard.

***

### collapsed

> **collapsed**: `ReadonlySet`\<`string`\>

Defined in: [model/gantt-store.ts:52](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L52)

Summary tasks whose rows are folded away.

***

### dialogTaskId

> **dialogTaskId**: `string` \| `null`

Defined in: [model/gantt-store.ts:69](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L69)

The task whose information dialog is open, or `null`.

***

### history

> **history**: `History`\<`Project`\>

Defined in: [model/gantt-store.ts:46](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L46)

***

### printing

> **printing**: `boolean`

Defined in: [model/gantt-store.ts:73](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L73)

True while the chart is laid out for paper: every row drawn, scaled to the page width.

***

### projectDialogOpen

> **projectDialogOpen**: `boolean`

Defined in: [model/gantt-store.ts:70](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L70)

***

### recurringDialogOpen

> **recurringDialogOpen**: `boolean`

Defined in: [model/gantt-store.ts:71](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L71)

***

### rejection

> **rejection**: [`GanttRejection`](GanttRejection.md) \| `null`

Defined in: [model/gantt-store.ts:62](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L62)

The last refused edit; cleared by the next accepted one.

***

### schedule

> **schedule**: `Schedule`

Defined in: [model/gantt-store.ts:48](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L48)

Computed dates of `history.present`.

***

### selectedLinkId

> **selectedLinkId**: `string` \| `null`

Defined in: [model/gantt-store.ts:67](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L67)

The selected dependency line, or `null`. Selecting rows clears it.

***

### selection

> **selection**: readonly `string`[]

Defined in: [model/gantt-store.ts:50](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L50)

Selected task ids, in the order they were selected.

***

### showCriticalPath

> **showCriticalPath**: `boolean`

Defined in: [model/gantt-store.ts:55](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L55)

***

### showLinks

> **showLinks**: `boolean`

Defined in: [model/gantt-store.ts:56](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L56)

***

### view

> **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store.ts:74](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L74)

***

### zoom

> **zoom**: `number`

Defined in: [model/gantt-store.ts:54](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L54)

Index into the zoom steps.

## Methods

### addTask()

> **addTask**(`name?`): `string` \| `null`

Defined in: [model/gantt-store.ts:111](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L111)

Inserts a new task under the last selected row, or at the end, and selects it.

#### Parameters

##### name?

`string`

#### Returns

`string` \| `null`

***

### apply()

> **apply**(`label`, `edit`): `boolean`

Defined in: [model/gantt-store.ts:82](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L82)

Applies an edit as one undo step. A `ScheduleError` from the edit or
from scheduling its result refuses the edit and records the reason.

#### Parameters

##### label

`string`

##### edit

[`GanttEdit`](../type-aliases/GanttEdit.md)

#### Returns

`boolean`

Whether the edit was accepted.

***

### closeProjectDialog()

> **closeProjectDialog**(): `void`

Defined in: [model/gantt-store.ts:102](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L102)

#### Returns

`void`

***

### closeRecurringDialog()

> **closeRecurringDialog**(): `void`

Defined in: [model/gantt-store.ts:104](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L104)

#### Returns

`void`

***

### closeTaskDialog()

> **closeTaskDialog**(): `void`

Defined in: [model/gantt-store.ts:100](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L100)

#### Returns

`void`

***

### copySelected()

> **copySelected**(): `string` \| `null`

Defined in: [model/gantt-store.ts:121](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L121)

Copies the selected tasks and returns them as tab-separated text (name,
duration, start, finish, percent complete) for the system clipboard, or
`null` when nothing is selected.

#### Returns

`string` \| `null`

***

### dismissRejection()

> **dismissRejection**(): `void`

Defined in: [model/gantt-store.ts:87](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L87)

#### Returns

`void`

***

### indentSelected()

> **indentSelected**(): `void`

Defined in: [model/gantt-store.ts:114](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L114)

#### Returns

`void`

***

### insertionPoint()

> **insertionPoint**(): `object`

Defined in: [model/gantt-store.ts:106](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L106)

Row to insert new rows at, and the outline level to give them: just under the last selected row, or the end.

#### Returns

`object`

##### at

> **at**: `number`

##### level

> **level**: `number`

***

### load()

> **load**(`project`): `void`

Defined in: [model/gantt-store.ts:84](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L84)

Replaces the plan and forgets the undo history.

#### Parameters

##### project

`Project`

#### Returns

`void`

***

### openProjectDialog()

> **openProjectDialog**(): `void`

Defined in: [model/gantt-store.ts:101](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L101)

#### Returns

`void`

***

### openRecurringDialog()

> **openRecurringDialog**(): `void`

Defined in: [model/gantt-store.ts:103](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L103)

#### Returns

`void`

***

### openTaskDialog()

> **openTaskDialog**(`id`): `void`

Defined in: [model/gantt-store.ts:99](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L99)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### outdentSelected()

> **outdentSelected**(): `void`

Defined in: [model/gantt-store.ts:115](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L115)

#### Returns

`void`

***

### paste()

> **paste**(): `void`

Defined in: [model/gantt-store.ts:132](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L132)

Pastes the copied tasks under the last selected row, or at the end.

#### Returns

`void`

***

### pasteText()

> **pasteText**(`text`): `void`

Defined in: [model/gantt-store.ts:128](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L128)

Pastes text from the system clipboard. Text this chart copied pastes the
copied tasks with their links and assignments. Any other text makes one
task per line, reading the first tab-separated cell as the name and the
second, when it is a duration, as the duration.

#### Parameters

##### text

`string`

#### Returns

`void`

***

### redo()

> **redo**(): `void`

Defined in: [model/gantt-store.ts:86](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L86)

#### Returns

`void`

***

### removeSelected()

> **removeSelected**(): `void`

Defined in: [model/gantt-store.ts:113](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L113)

Removes the selected dependency line, or else the selected tasks.

#### Returns

`void`

***

### select()

> **select**(`ids`): `void`

Defined in: [model/gantt-store.ts:89](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L89)

#### Parameters

##### ids

readonly `string`[]

#### Returns

`void`

***

### selectLink()

> **selectLink**(`id`): `void`

Defined in: [model/gantt-store.ts:98](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L98)

#### Parameters

##### id

`string` | `null`

#### Returns

`void`

***

### selectRow()

> **selectRow**(`id`, `mode?`): `void`

Defined in: [model/gantt-store.ts:91](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L91)

Selects one row; with `extend` every row from the last selected one to it, with `toggle` adds or removes it.

#### Parameters

##### id

`string`

##### mode?

`"replace"` | `"extend"` | `"toggle"`

#### Returns

`void`

***

### setBaselineNumber()

> **setBaselineNumber**(`number`): `void`

Defined in: [model/gantt-store.ts:97](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L97)

#### Parameters

##### number

`number` | `null`

#### Returns

`void`

***

### setBaselineSlot()

> **setBaselineSlot**(`slot`): `void`

Defined in: [model/gantt-store.ts:130](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L130)

Picks the baseline the commands work on; a baseline that is shown follows it.

#### Parameters

##### slot

`number`

#### Returns

`void`

***

### setCollapsed()

> **setCollapsed**(`ids`): `void`

Defined in: [model/gantt-store.ts:93](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L93)

#### Parameters

##### ids

readonly `string`[]

#### Returns

`void`

***

### setDurationText()

> **setDurationText**(`id`, `text`): `boolean`

Defined in: [model/gantt-store.ts:134](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L134)

Sets a task's duration from text such as `3d`, `2w` or `4h`.

#### Parameters

##### id

`string`

##### text

`string`

#### Returns

`boolean`

***

### setPredecessorText()

> **setPredecessorText**(`id`, `text`): `boolean`

Defined in: [model/gantt-store.ts:136](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L136)

Replaces a task's predecessors from text such as `3, 4SS+2d`, naming rows by number.

#### Parameters

##### id

`string`

##### text

`string`

#### Returns

`boolean`

***

### setPrinting()

> **setPrinting**(`printing`): `void`

Defined in: [model/gantt-store.ts:107](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L107)

#### Parameters

##### printing

`boolean`

#### Returns

`void`

***

### setShowCriticalPath()

> **setShowCriticalPath**(`show`): `void`

Defined in: [model/gantt-store.ts:95](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L95)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setShowLinks()

> **setShowLinks**(`show`): `void`

Defined in: [model/gantt-store.ts:96](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L96)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setView()

> **setView**(`view`): `void`

Defined in: [model/gantt-store.ts:108](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L108)

#### Parameters

##### view

[`GanttView`](../type-aliases/GanttView.md)

#### Returns

`void`

***

### setZoom()

> **setZoom**(`zoom`): `void`

Defined in: [model/gantt-store.ts:94](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L94)

#### Parameters

##### zoom

`number`

#### Returns

`void`

***

### toggleCollapsed()

> **toggleCollapsed**(`id`): `void`

Defined in: [model/gantt-store.ts:92](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L92)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### undo()

> **undo**(): `void`

Defined in: [model/gantt-store.ts:85](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store.ts#L85)

#### Returns

`void`
