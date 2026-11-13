[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/gantt](../README.md) / GanttStoreState

# Interface: GanttStoreState

Defined in: [model/gantt-store-types.ts:28](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L28)

Reactive state of one chart, with the edits that change it.

## Properties

### baselineNumber

> **baselineNumber**: `number` \| `null`

Defined in: [model/gantt-store-types.ts:43](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L43)

Baseline drawn under the bars, or `null` for none.

***

### baselineSlot

> **baselineSlot**: `number`

Defined in: [model/gantt-store-types.ts:45](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L45)

Baseline the save, show and clear commands work on, 0 to 10.

***

### clipboard

> **clipboard**: `TaskClipboard` \| `null`

Defined in: [model/gantt-store-types.ts:48](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L48)

***

### clipboardText

> **clipboardText**: `string` \| `null`

Defined in: [model/gantt-store-types.ts:50](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L50)

The copied tasks as tab-separated text, as it was handed to the system clipboard.

***

### collapsed

> **collapsed**: `ReadonlySet`\<`string`\>

Defined in: [model/gantt-store-types.ts:35](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L35)

Summary tasks whose rows are folded away.

***

### columns

> **columns**: readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

Defined in: [model/gantt-store-types.ts:61](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L61)

Columns of the task table, in the order they are shown.

***

### dialogTaskId

> **dialogTaskId**: `string` \| `null`

Defined in: [model/gantt-store-types.ts:54](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L54)

The task whose information dialog is open, or `null`.

***

### history

> **history**: `History`\<`Project`\>

Defined in: [model/gantt-store-types.ts:29](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L29)

***

### levelingOptions

> **levelingOptions**: `LevelingOptions`

Defined in: [model/gantt-store-types.ts:63](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L63)

What resource leveling may do.

***

### printing

> **printing**: `boolean`

Defined in: [model/gantt-store-types.ts:58](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L58)

True while the chart is laid out for paper: every row drawn, scaled to the page width.

***

### projectDialogOpen

> **projectDialogOpen**: `boolean`

Defined in: [model/gantt-store-types.ts:55](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L55)

***

### recurringDialogOpen

> **recurringDialogOpen**: `boolean`

Defined in: [model/gantt-store-types.ts:56](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L56)

***

### rejection

> **rejection**: [`GanttRejection`](GanttRejection.md) \| `null`

Defined in: [model/gantt-store-types.ts:47](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L47)

The last refused edit; cleared by the next accepted one.

***

### schedule

> **schedule**: `Schedule`

Defined in: [model/gantt-store-types.ts:31](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L31)

Computed dates of `history.present`.

***

### scrollRequest

> **scrollRequest**: \{ `seq`: `number`; `target`: `string`; \} \| `null`

Defined in: [model/gantt-store-types.ts:65](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L65)

The latest request to bring something into view; `seq` tells two requests for the same target apart.

***

### selectedLinkId

> **selectedLinkId**: `string` \| `null`

Defined in: [model/gantt-store-types.ts:52](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L52)

The selected dependency line, or `null`. Selecting rows clears it.

***

### selection

> **selection**: readonly `string`[]

Defined in: [model/gantt-store-types.ts:33](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L33)

Selected task ids, in the order they were selected.

***

### showCriticalPath

> **showCriticalPath**: `boolean`

Defined in: [model/gantt-store-types.ts:38](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L38)

***

### showLinks

> **showLinks**: `boolean`

Defined in: [model/gantt-store-types.ts:39](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L39)

***

### showMarkers

> **showMarkers**: `boolean`

Defined in: [model/gantt-store-types.ts:41](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L41)

Whether today, the status date and the ends of the plan are marked on the timeline.

***

### view

> **view**: [`GanttView`](../type-aliases/GanttView.md)

Defined in: [model/gantt-store-types.ts:59](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L59)

***

### zoom

> **zoom**: `number`

Defined in: [model/gantt-store-types.ts:37](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L37)

Index into the zoom steps.

## Methods

### addTask()

> **addTask**(`name?`): `string` \| `null`

Defined in: [model/gantt-store-types.ts:122](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L122)

Inserts a new task under the last selected row, or at the end, and selects it.

#### Parameters

##### name?

`string`

#### Returns

`string` \| `null`

***

### apply()

> **apply**(`label`, `edit`): `boolean`

Defined in: [model/gantt-store-types.ts:73](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L73)

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

Defined in: [model/gantt-store-types.ts:94](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L94)

#### Returns

`void`

***

### closeRecurringDialog()

> **closeRecurringDialog**(): `void`

Defined in: [model/gantt-store-types.ts:96](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L96)

#### Returns

`void`

***

### closeTaskDialog()

> **closeTaskDialog**(): `void`

Defined in: [model/gantt-store-types.ts:92](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L92)

#### Returns

`void`

***

### copySelected()

> **copySelected**(): `string` \| `null`

Defined in: [model/gantt-store-types.ts:132](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L132)

Copies the selected tasks and returns them as tab-separated text (name,
duration, start, finish, percent complete) for the system clipboard, or
`null` when nothing is selected.

#### Returns

`string` \| `null`

***

### dismissRejection()

> **dismissRejection**(): `void`

Defined in: [model/gantt-store-types.ts:78](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L78)

#### Returns

`void`

***

### indentSelected()

> **indentSelected**(): `void`

Defined in: [model/gantt-store-types.ts:125](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L125)

#### Returns

`void`

***

### insertionPoint()

> **insertionPoint**(): `object`

Defined in: [model/gantt-store-types.ts:98](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L98)

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

Defined in: [model/gantt-store-types.ts:75](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L75)

Replaces the plan and forgets the undo history.

#### Parameters

##### project

`Project`

#### Returns

`void`

***

### moveColumn()

> **moveColumn**(`column`, `toIndex`): `void`

Defined in: [model/gantt-store-types.ts:105](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L105)

Moves a column to a place among the columns.

#### Parameters

##### column

[`GanttColumnId`](../type-aliases/GanttColumnId.md)

##### toIndex

`number`

#### Returns

`void`

***

### openProjectDialog()

> **openProjectDialog**(): `void`

Defined in: [model/gantt-store-types.ts:93](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L93)

#### Returns

`void`

***

### openRecurringDialog()

> **openRecurringDialog**(): `void`

Defined in: [model/gantt-store-types.ts:95](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L95)

#### Returns

`void`

***

### openTaskDialog()

> **openTaskDialog**(`id`): `void`

Defined in: [model/gantt-store-types.ts:91](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L91)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### outdentSelected()

> **outdentSelected**(): `void`

Defined in: [model/gantt-store-types.ts:126](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L126)

#### Returns

`void`

***

### paste()

> **paste**(): `void`

Defined in: [model/gantt-store-types.ts:143](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L143)

Pastes the copied tasks under the last selected row, or at the end.

#### Returns

`void`

***

### pasteText()

> **pasteText**(`text`): `void`

Defined in: [model/gantt-store-types.ts:139](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L139)

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

Defined in: [model/gantt-store-types.ts:77](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L77)

#### Returns

`void`

***

### removeSelected()

> **removeSelected**(): `void`

Defined in: [model/gantt-store-types.ts:124](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L124)

Removes the selected dependency line, or else the selected tasks.

#### Returns

`void`

***

### reveal()

> **reveal**(`id`): `void`

Defined in: [model/gantt-store-types.ts:108](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L108)

Selects a task and scrolls its row and its bar into view.

#### Parameters

##### id

`string`

#### Returns

`void`

***

### scrollToStart()

> **scrollToStart**(): `void`

Defined in: [model/gantt-store-types.ts:110](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L110)

Scrolls the timeline to the start of the plan.

#### Returns

`void`

***

### scrollToToday()

> **scrollToToday**(): `void`

Defined in: [model/gantt-store-types.ts:112](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L112)

Scrolls the timeline to today, when today lies on it.

#### Returns

`void`

***

### select()

> **select**(`ids`): `void`

Defined in: [model/gantt-store-types.ts:80](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L80)

#### Parameters

##### ids

readonly `string`[]

#### Returns

`void`

***

### selectLink()

> **selectLink**(`id`): `void`

Defined in: [model/gantt-store-types.ts:90](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L90)

#### Parameters

##### id

`string` | `null`

#### Returns

`void`

***

### selectRow()

> **selectRow**(`id`, `mode?`): `void`

Defined in: [model/gantt-store-types.ts:82](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L82)

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

Defined in: [model/gantt-store-types.ts:89](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L89)

#### Parameters

##### number

`number` | `null`

#### Returns

`void`

***

### setBaselineSlot()

> **setBaselineSlot**(`slot`): `void`

Defined in: [model/gantt-store-types.ts:141](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L141)

Picks the baseline the commands work on; a baseline that is shown follows it.

#### Parameters

##### slot

`number`

#### Returns

`void`

***

### setCollapsed()

> **setCollapsed**(`ids`): `void`

Defined in: [model/gantt-store-types.ts:84](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L84)

#### Parameters

##### ids

readonly `string`[]

#### Returns

`void`

***

### setColumns()

> **setColumns**(`columns`): `void`

Defined in: [model/gantt-store-types.ts:101](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L101)

#### Parameters

##### columns

readonly [`GanttColumnId`](../type-aliases/GanttColumnId.md)[]

#### Returns

`void`

***

### setDurationText()

> **setDurationText**(`id`, `text`): `boolean`

Defined in: [model/gantt-store-types.ts:145](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L145)

Sets a task's duration from text such as `3d`, `2w` or `4h`.

#### Parameters

##### id

`string`

##### text

`string`

#### Returns

`boolean`

***

### setLevelingOptions()

> **setLevelingOptions**(`options`): `void`

Defined in: [model/gantt-store-types.ts:106](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L106)

#### Parameters

##### options

`LevelingOptions`

#### Returns

`void`

***

### setPredecessorText()

> **setPredecessorText**(`id`, `text`): `boolean`

Defined in: [model/gantt-store-types.ts:147](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L147)

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

Defined in: [model/gantt-store-types.ts:99](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L99)

#### Parameters

##### printing

`boolean`

#### Returns

`void`

***

### setShowCriticalPath()

> **setShowCriticalPath**(`show`): `void`

Defined in: [model/gantt-store-types.ts:86](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L86)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setShowLinks()

> **setShowLinks**(`show`): `void`

Defined in: [model/gantt-store-types.ts:87](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L87)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setShowMarkers()

> **setShowMarkers**(`show`): `void`

Defined in: [model/gantt-store-types.ts:88](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L88)

#### Parameters

##### show

`boolean`

#### Returns

`void`

***

### setView()

> **setView**(`view`): `void`

Defined in: [model/gantt-store-types.ts:100](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L100)

#### Parameters

##### view

[`GanttView`](../type-aliases/GanttView.md)

#### Returns

`void`

***

### setZoom()

> **setZoom**(`zoom`): `void`

Defined in: [model/gantt-store-types.ts:85](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L85)

#### Parameters

##### zoom

`number`

#### Returns

`void`

***

### sync()

> **sync**(`project`): `void`

Defined in: [model/gantt-store-types.ts:119](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L119)

Replaces the plan with one changed elsewhere, such as an edit another
user saved. The undo history is kept; undoing past this point brings back
the plan as it was here, without the outside change. `onChange` is not
called, since the change did not come from this chart.

#### Parameters

##### project

`Project`

#### Returns

`void`

***

### toggleCollapsed()

> **toggleCollapsed**(`id`): `void`

Defined in: [model/gantt-store-types.ts:83](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L83)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### toggleColumn()

> **toggleColumn**(`column`): `void`

Defined in: [model/gantt-store-types.ts:103](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L103)

Shows a column at the end of the table, or hides it.

#### Parameters

##### column

[`GanttColumnId`](../type-aliases/GanttColumnId.md)

#### Returns

`void`

***

### undo()

> **undo**(): `void`

Defined in: [model/gantt-store-types.ts:76](https://github.com/simplix-react/simplix-react/blob/main/model/gantt-store-types.ts#L76)

#### Returns

`void`
