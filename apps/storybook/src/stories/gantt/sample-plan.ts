import {
  addCustomField,
  addLink,
  addResource,
  assignResource,
  computeSchedule,
  parseLocalDateTime,
  setBaseline,
  setCustomValue,
  setPercentComplete,
  standardCalendar,
} from "@simplix-react/gantt-core";
import type { LinkType, Project, Task } from "@simplix-react/gantt-core";

const DAY = 480;

function task(id: number, name: string, level: number, days: number, patch: Partial<Task> = {}): Task {
  return {
    id: String(id),
    name,
    outlineLevel: level,
    mode: "auto",
    duration: days * DAY,
    durationUnit: "d",
    constraintType: "asap",
    type: "fixed-units",
    percentComplete: 0,
    priority: 500,
    ...patch,
  };
}

function emptyProject(name: string, tasks: Task[]): Project {
  return {
    name,
    scheduleFrom: "start",
    start: parseLocalDateTime("2026-03-02T08:00"),
    calendarId: "standard",
    minutesPerDay: DAY,
    minutesPerWeek: 5 * DAY,
    daysPerMonth: 20,
    defaultStartTime: 8 * 60,
    defaultFinishTime: 17 * 60,
    criticalSlackLimit: 0,
    honorConstraints: true,
    calendars: [standardCalendar()],
    tasks,
    links: [],
    resources: [],
    assignments: [],
    baselines: {},
  };
}

/** A platform build plan with phases, every link type, resources, progress and a saved baseline. */
export function samplePlan(): Project {
  let project = emptyProject("Data platform build", [
    task(1, "Analysis", 1, 0),
    task(2, "Requirements workshops", 2, 5),
    task(3, "Current system survey", 2, 4),
    task(4, "Requirements baseline approved", 2, 0),
    task(5, "Design", 1, 0),
    task(6, "Architecture design", 2, 8),
    task(7, "Data model design", 2, 6),
    task(8, "Interface specification", 2, 5),
    task(9, "Design review", 2, 2),
    task(10, "Build", 1, 0),
    task(11, "Ingestion pipeline", 2, 12),
    task(12, "In-memory processing engine", 2, 15),
    task(13, "Query API", 2, 10),
    task(14, "Operations console", 2, 9),
    task(15, "Test", 1, 0),
    task(16, "Integration test", 2, 8),
    task(17, "Performance test", 2, 6, { deadline: parseLocalDateTime("2026-06-19T17:00") }),
    task(18, "Security review", 2, 4),
    task(19, "Rollout", 1, 0),
    task(20, "Operator training", 2, 3),
    task(21, "Cutover rehearsal", 2, 2),
    task(22, "Go-live", 2, 0),
  ]);

  const links: [number, number, LinkType, number][] = [
    [2, 4, "FS", 0],
    [3, 4, "FS", 0],
    [2, 3, "SS", 1],
    [4, 6, "FS", 0],
    [6, 7, "SS", 2],
    [6, 8, "FS", 0],
    [7, 9, "FS", 0],
    [8, 9, "FS", 0],
    [9, 11, "FS", 0],
    [9, 12, "FS", 0],
    [11, 13, "FS", -2],
    [12, 13, "FF", 0],
    [9, 14, "FS", 5],
    [13, 16, "FS", 0],
    [14, 16, "FS", 0],
    [16, 17, "SS", 3],
    [16, 18, "FS", 0],
    [17, 20, "FS", 0],
    [18, 21, "FS", 0],
    [20, 21, "FF", 0],
    [21, 22, "FS", 0],
  ];
  for (const [from, to, type, lagDays] of links) {
    project = addLink(project, { predecessorId: String(from), successorId: String(to), type, lag: lagDays * DAY });
  }

  const people: [string, string, string, number][] = [
    ["1", "Analyst", "Business", 60],
    ["2", "Architect", "Engineering", 90],
    ["3", "Backend developer", "Engineering", 75],
    ["4", "Frontend developer", "Engineering", 70],
    ["5", "QA engineer", "Quality", 55],
  ];
  for (const [id, name, group, standardRate] of people) {
    project = addResource(project, { id, name, group, standardRate });
  }
  project = addCustomField(project, { id: "owner", name: "Owner", type: "text" });
  project = addCustomField(project, { id: "risk", name: "At risk", type: "flag" });
  project = setCustomValue(project, "12", "owner", "Platform team");
  project = setCustomValue(project, "12", "risk", true);
  const staffing: [number, string][] = [
    [2, "1"],
    [3, "1"],
    [6, "2"],
    [7, "2"],
    [8, "2"],
    [9, "2"],
    [11, "3"],
    [12, "3"],
    [13, "3"],
    [14, "4"],
    [16, "5"],
    [17, "5"],
    [18, "5"],
    [20, "1"],
    [21, "3"],
  ];
  for (const [taskId, resourceId] of staffing) project = assignResource(project, String(taskId), resourceId);

  project = setBaseline(project, computeSchedule(project));
  project = setPercentComplete(project, computeSchedule(project), "2", 100);
  project = setPercentComplete(project, computeSchedule(project), "3", 60);
  // The survey ran long after the baseline was saved.
  project = { ...project, tasks: project.tasks.map((t) => (t.id === "3" ? { ...t, duration: 7 * DAY } : t)) };
  return project;
}

/** A long plan for scrolling: `phases` summary tasks with `perPhase` chained tasks each. */
export function largePlan(phases: number, perPhase: number): Project {
  const tasks: Task[] = [];
  let id = 0;
  for (let phase = 0; phase < phases; phase++) {
    tasks.push(task(++id, `Phase ${phase + 1}`, 1, 0));
    for (let i = 0; i < perPhase; i++) tasks.push(task(++id, `Task ${phase + 1}.${i + 1}`, 2, 1 + ((phase + i) % 5)));
  }
  let project = emptyProject("Large plan", tasks);
  let linkId = 0;
  const links = [];
  for (let phase = 0; phase < phases; phase++) {
    const first = phase * (perPhase + 1) + 2;
    for (let i = 0; i + 1 < perPhase; i++) {
      links.push({
        id: String(++linkId),
        predecessorId: String(first + i),
        successorId: String(first + i + 1),
        type: "FS" as const,
        lag: 0,
        lagMode: "working" as const,
        lagUnit: "d" as const,
      });
    }
  }
  project = { ...project, links };
  return project;
}
