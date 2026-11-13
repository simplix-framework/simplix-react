import type { Minutes } from "./time";

/** Identifier of a record. Unique within its collection. */
export type Id = string;

/** A span of working time inside one day, in minutes after midnight. `to` may be 1440. */
export interface WorkingRange {
  from: number;
  to: number;
}

/**
 * Working time of the seven weekdays, Sunday first. An empty array is a
 * non-working day; `null` takes the day from the base calendar.
 */
export type WeekPattern = readonly (readonly WorkingRange[] | null)[];

/** A dated override of single days. Both ends are day indexes and inclusive. */
export interface CalendarException {
  name?: string;
  fromDay: number;
  toDay: number;
  /** Working time on each covered day. Empty makes the days non-working. */
  ranges: readonly WorkingRange[];
}

/** A dated override of the week pattern. Both ends are day indexes and inclusive. */
export interface CalendarWorkWeek {
  name?: string;
  fromDay: number;
  toDay: number;
  weekDays: WeekPattern;
}

/**
 * Working time of a project, a task or a resource. A day resolves through its
 * exceptions, then its work weeks, then its week pattern, then the base
 * calendar.
 */
export interface WorkCalendar {
  id: Id;
  name: string;
  baseCalendarId?: Id;
  weekDays: WeekPattern;
  workWeeks?: readonly CalendarWorkWeek[];
  exceptions?: readonly CalendarException[];
}

export type DurationUnit = "m" | "h" | "d" | "w" | "mo";

export type TaskMode = "auto" | "manual";

/** Which of units, duration and work stays fixed when one of the others is edited. */
export type TaskType = "fixed-units" | "fixed-duration" | "fixed-work";

export type ConstraintType =
  | "asap"
  | "alap"
  | "must-start-on"
  | "must-finish-on"
  | "start-no-earlier-than"
  | "start-no-later-than"
  | "finish-no-earlier-than"
  | "finish-no-later-than";

/**
 * One row of the plan. Rows are kept in display order; `outlineLevel` (1 for
 * the top level) places a row under the nearest earlier row one level up, and
 * a row with rows under it is a summary task whose dates come from them.
 */
export interface Task {
  id: Id;
  name: string;
  outlineLevel: number;
  mode: TaskMode;
  /** Working minutes on the task's calendar, or clock minutes when `elapsed`. */
  duration: number;
  /** Unit the duration is shown and edited in. */
  durationUnit: DurationUnit;
  elapsed?: boolean;
  estimated?: boolean;
  /** Draws the task as a milestone even when its duration is not zero. */
  milestone?: boolean;
  /** Dates of a manually scheduled task. An automatic task ignores them. */
  manualStart?: Minutes;
  manualFinish?: Minutes;
  constraintType: ConstraintType;
  /** Required by every constraint type except `asap` and `alap`. */
  constraintDate?: Minutes;
  deadline?: Minutes;
  calendarId?: Id;
  /** With a task calendar set, schedules on it alone and ignores resource calendars. */
  ignoreResourceCalendar?: boolean;
  type: TaskType;
  effortDriven?: boolean;
  /** 0 to 100. */
  percentComplete: number;
  actualStart?: Minutes;
  actualFinish?: Minutes;
  /** 0 to 1000. Leveling never delays a task of priority 1000. */
  priority: number;
  /** Working minutes on the task's calendar that leveling added before the start. */
  levelingDelay?: number;
  /** An inactive task keeps its row and takes no part in scheduling. */
  inactive?: boolean;
  notes?: string;
  /** Pauses inside the task, in order of offset. The duration counts work only, not the pauses. */
  splits?: readonly TaskSplit[];
  /** A cost of the task itself, on top of what its resources cost. */
  fixedCost?: number;
  /** What the task has cost so far. Earned value takes the earned amount when it is not recorded. */
  actualCost?: number;
  /** Values of the plan's custom fields, by field id. */
  custom?: Readonly<Record<Id, CustomValue>>;
  /** Colour the task's bar is drawn in, as a CSS colour. The chart's own colour when not set. */
  color?: string;
  /** On the summary task of a recurring task: the rule its occurrences were made from. */
  recurrence?: TaskRecurrence;
}

/** When a recurring task happens, and how long each occurrence takes. */
export interface TaskRecurrence {
  frequency: "daily" | "weekly" | "monthly";
  /** Every `interval`-th day, week or month. */
  interval: number;
  /** Weekdays of a weekly recurrence, 0 for Sunday. */
  weekdays?: readonly number[];
  /** Day of the month of a monthly recurrence. A month without that day is skipped. */
  monthDay?: number;
  /** First day considered. */
  from: Minutes;
  /** Last day considered. One of `until` and `count` is required. */
  until?: Minutes;
  /** Number of occurrences. */
  count?: number;
  /** Working minutes each occurrence takes, and the unit it is shown in. */
  duration: number;
  durationUnit: DurationUnit;
}

/** A pause inside a task: after `offset` working minutes of work, work stops for `gap` working minutes. */
export interface TaskSplit {
  offset: number;
  gap: number;
  /** True for a pause resource leveling added; clearing the leveling removes it. */
  leveled?: boolean;
}

/** What a custom field holds. */
export type CustomFieldType = "text" | "number" | "date" | "flag";

/** A field a plan adds to its tasks. */
export interface CustomField {
  id: Id;
  name: string;
  type: CustomFieldType;
}

/** A value of a custom field: text, a number, an instant for a date, or a flag. */
export type CustomValue = string | number | boolean;

export type LinkType = "FS" | "SS" | "FF" | "SF";

/** How a lag is counted: on the successor's calendar, on the clock, or as a share of the predecessor's duration. */
export type LagMode = "working" | "elapsed" | "percent";

/** A dependency between two tasks. A negative lag is a lead. */
export interface Link {
  id: Id;
  predecessorId: Id;
  successorId: Id;
  type: LinkType;
  /** Minutes for `working` and `elapsed`; percent of the predecessor's duration for `percent`. */
  lag: number;
  lagMode: LagMode;
  /** Unit a minute lag is shown and edited in. */
  lagUnit: DurationUnit;
}

export type ResourceType = "work" | "material" | "cost";

export interface Resource {
  id: Id;
  name: string;
  type: ResourceType;
  /** Capacity of a work resource: 1 is one full-time unit. */
  maxUnits: number;
  calendarId?: Id;
  initials?: string;
  group?: string;
  /** Cost of one hour of a work resource, or of one unit of a material resource. */
  standardRate?: number;
  /** Cost added once for every task the resource is assigned to. */
  costPerUse?: number;
  /** Cost of one hour of overtime. The standard rate applies when it is not set. */
  overtimeRate?: number;
  /** Standard rates that take effect from a date on, in any order. A task is costed at the rate in effect when it starts. */
  rates?: readonly { from: Minutes; standardRate: number }[];
}

/** How an assignment's work is spread over the task: evenly, or weighted toward the start, the end or the middle. */
export type WorkContour = "flat" | "front-loaded" | "back-loaded" | "bell";

export interface Assignment {
  id: Id;
  taskId: Id;
  resourceId: Id;
  /** Share of the resource's time: 1 is full time. */
  units: number;
  /** Working minutes the resource spends on the task. */
  work: number;
  /** Minutes of the work done outside working time: they cost the overtime rate and take no duration. */
  overtimeWork?: number;
  /** How the work is spread over the task in the usage figures. Flat when not set. */
  contour?: WorkContour;
}

/** The dates a task had when a baseline was saved. */
export interface BaselineEntry {
  start: Minutes;
  finish: Minutes;
  duration: number;
  /** The task's cost when the baseline was saved: its budget. */
  cost?: number;
}

/** Saved dates of every task, by task id. */
export type Baseline = Readonly<Record<Id, BaselineEntry>>;

export interface Project {
  name: string;
  /** Schedules forward from `start`, or backward from `finish`. */
  scheduleFrom: "start" | "finish";
  start: Minutes;
  /** Required when `scheduleFrom` is `finish`. */
  finish?: Minutes;
  /** Progress is reported as of this instant. */
  statusDate?: Minutes;
  calendarId: Id;
  /** Working minutes a duration of one day, one week and one month stand for. */
  minutesPerDay: number;
  minutesPerWeek: number;
  daysPerMonth: number;
  /** Minutes after midnight a date typed without a time starts and ends at. */
  defaultStartTime: number;
  defaultFinishTime: number;
  /** A task with total slack at or under this many working minutes is critical. */
  criticalSlackLimit: number;
  /**
   * When true a must-start-on, must-finish-on, start-no-later-than or
   * finish-no-later-than date wins over a link that needs a later date, and
   * the link is reported as violated. When false the link wins.
   */
  honorConstraints: boolean;
  calendars: readonly WorkCalendar[];
  tasks: readonly Task[];
  links: readonly Link[];
  resources: readonly Resource[];
  assignments: readonly Assignment[];
  /** Saved baselines by number, 0 to 10. */
  baselines: Readonly<Record<number, Baseline>>;
  /** Fields the plan adds to its tasks. */
  customFields?: readonly CustomField[];
  /** ISO 4217 code of the currency costs are in, such as `KRW`. Costs show as plain numbers without one. */
  currencyCode?: string;
}

export type ConflictKind =
  | "link-violated"
  | "constraint-violated"
  | "deadline-missed"
  | "before-project-start"
  | "after-project-finish";

/** A rule the computed dates break. The plan is still scheduled. */
export interface ScheduleConflict {
  kind: ConflictKind;
  taskId: Id;
  linkId?: Id;
}

/** Computed dates of one task. */
export interface TaskSchedule {
  id: Id;
  /** Row position in `Project.tasks`. */
  index: number;
  parentId: Id | null;
  /** Outline number, such as `1.2.3`. */
  wbs: string;
  summary: boolean;
  milestone: boolean;
  start: Minutes;
  finish: Minutes;
  /** The stretches the task works in: one, or one more than it has splits. */
  segments: readonly { start: Minutes; finish: Minutes }[];
  /** Working minutes of work between start and finish, pauses left out; clock minutes for an elapsed task. */
  duration: number;
  earlyStart: Minutes;
  earlyFinish: Minutes;
  lateStart: Minutes;
  lateFinish: Minutes;
  /** Working minutes the task can slip without moving the project's end. Negative when a late date is already missed. */
  totalSlack: number;
  /** Working minutes the task can slip without moving any successor. */
  freeSlack: number;
  critical: boolean;
  /** Own value for a task; duration-weighted over the tasks under a summary. */
  percentComplete: number;
  /** Calendar the dates were computed on. */
  calendarId: Id;
}

/** Computed state of one link. */
export interface LinkSchedule {
  id: Id;
  /** The successor's date is earlier than the link allows. */
  violated: boolean;
  /** The link is what holds the successor at its date. */
  driving: boolean;
}

export interface Schedule {
  start: Minutes;
  finish: Minutes;
  tasks: ReadonlyMap<Id, TaskSchedule>;
  links: ReadonlyMap<Id, LinkSchedule>;
  conflicts: readonly ScheduleConflict[];
}
