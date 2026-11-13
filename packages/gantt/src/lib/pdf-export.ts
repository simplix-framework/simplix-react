import { compileCalendars, dayIndexOf, formatDuration } from "@simplix-react/gantt-core";
import type { Id, Project, Schedule, Task, TaskSchedule } from "@simplix-react/gantt-core";

import { formatDate, formatScaleCell } from "./format";
import { buildPdf } from "./pdf-file";
import type { PdfImage } from "./pdf-file";
import { routeLink, traceRoundedPath } from "./link-path";
import { MARKER_STYLE, dateMarkers, nowOnProjectClock } from "./markers";
import type { BarBox } from "./link-path";
import { ZOOM_LEVELS, createTimeScale, scaleCells } from "./time-scale";
import type { TimeScale, ZoomLevel } from "./time-scale";

/** A4 landscape in PDF points. */
const PAGE_WIDTH_PT = 842;
const PAGE_HEIGHT_PT = 595;
/** Drawing units per page: the page at 1.5 units per point, so text stays crisp when the page is shown full size. */
const PAGE_WIDTH = 1263;
const PAGE_HEIGHT = 892;
const MARGIN = 30;
const FOOTER = 22;
const HEADER = 40;
const ROW = 22;
/** Canvas pixels per drawing unit. */
const DENSITY = 2;
/** The timeline is not spread over more sheets than this side by side. */
const MAX_SHEETS_ACROSS = 6;

const COLUMNS = [
  { key: "row", width: 36, align: "right" },
  { key: "name", width: 230, align: "left" },
  { key: "duration", width: 60, align: "right" },
  { key: "start", width: 84, align: "left" },
  { key: "finish", width: 84, align: "left" },
] as const;
const GRID_WIDTH = COLUMNS.reduce((sum, column) => sum + column.width, 0);

/** How a plan is cut into sheets. */
export interface PdfLayout {
  level: ZoomLevel;
  scale: TimeScale;
  rowsPerSheet: number;
  sheetsDown: number;
  sheetsAcross: number;
  /** Timeline width one sheet shows. */
  timelineWidth: number;
}

/** What of the screen's view a PDF follows. Left out, the PDF shows the whole plan in the chart's own colours. */
export interface PdfView {
  /**
   * The rows to draw, in order: the id of a task, or the heading of a group of
   * the rows after it. These are the rows the screen shows after filtering,
   * sorting, grouping and folding.
   */
  rows?: readonly (Id | { heading: string })[];
  /** The colour of a task's bar, or `undefined` for the chart's own. */
  colorOf?: (task: Task) => string | undefined;
  /** Whether critical tasks are drawn in the critical colour. */
  showCriticalPath?: boolean;
}

/**
 * Cuts a plan into sheets: the task table repeats on every sheet, rows run
 * down the sheets and the timeline runs across them at the closest zoom step
 * that keeps it within six sheets. `rowCount` is the number of rows drawn,
 * every task of the plan when it is left out.
 */
export function layoutPdf(schedule: Schedule, project: Project, rowCount: number = project.tasks.length): PdfLayout {
  const timelineWidth = PAGE_WIDTH - 2 * MARGIN - GRID_WIDTH;
  const rowsPerSheet = Math.floor((PAGE_HEIGHT - 2 * MARGIN - FOOTER - HEADER) / ROW);
  const from = Math.min(schedule.start, project.start);
  let level = ZOOM_LEVELS[0];
  let scale = createTimeScale(from, schedule.finish, level.pxPerDay, 1);
  // Hour-level zoom is for the screen; on paper a day column is the closest step.
  for (let i = ZOOM_LEVELS.length - 2; i >= 0; i--) {
    const candidate = createTimeScale(from, schedule.finish, ZOOM_LEVELS[i].pxPerDay, 1);
    if (candidate.width <= timelineWidth * MAX_SHEETS_ACROSS || i === 0) {
      level = ZOOM_LEVELS[i];
      scale = candidate;
      break;
    }
  }
  return {
    level,
    scale,
    rowsPerSheet,
    sheetsDown: Math.max(1, Math.ceil(rowCount / rowsPerSheet)),
    sheetsAcross: Math.max(1, Math.ceil(scale.width / timelineWidth)),
    timelineWidth,
  };
}

const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#d1d5db";
const SHADE = "#f3f4f6";
const BAR = "#2563eb";
const BAR_FILL = "#bfdbfe";
const CRITICAL = "#dc2626";
const CRITICAL_FILL = "#fecaca";

function fitText(ctx: CanvasRenderingContext2D, text: string, width: number): string {
  if (ctx.measureText(text).width <= width) return text;
  let cut = text.length;
  while (cut > 1 && ctx.measureText(`${text.slice(0, cut)}…`).width > width) cut -= 1;
  return `${text.slice(0, cut)}…`;
}

function drawSheet(
  ctx: CanvasRenderingContext2D,
  project: Project,
  schedule: Schedule,
  layout: PdfLayout,
  rows: readonly PdfRow[],
  sheet: { down: number; across: number; number: number; total: number },
  language: string,
  label: (key: string) => string,
  view: PdfView,
): void {
  const { scale, level, timelineWidth } = layout;
  const marksCritical = view.showCriticalPath !== false;
  const firstRow = sheet.down * layout.rowsPerSheet;
  const sheetRows = rows.slice(firstRow, firstRow + layout.rowsPerSheet);
  const offsetX = sheet.across * timelineWidth;
  const timelineLeft = MARGIN + GRID_WIDTH;
  const top = MARGIN;
  const bodyTop = top + HEADER;
  const bodyHeight = sheetRows.length * ROW;
  const font = (weight: string, size: number): void => {
    ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
  };

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PAGE_WIDTH, PAGE_HEIGHT);
  ctx.textBaseline = "middle";

  // Table heading and rows.
  font("600", 10);
  ctx.fillStyle = SHADE;
  ctx.fillRect(MARGIN, top, GRID_WIDTH + timelineWidth, HEADER);
  let x = MARGIN;
  for (const column of COLUMNS) {
    ctx.fillStyle = MUTED;
    const text = column.key === "row" ? "#" : label(`column.${column.key}`);
    ctx.textAlign = column.align;
    ctx.fillText(fitText(ctx, text, column.width - 10), column.align === "right" ? x + column.width - 5 : x + 5, top + HEADER / 2);
    x += column.width;
  }
  sheetRows.forEach((at, i) => {
    const y = bodyTop + i * ROW + ROW / 2;
    if ("heading" in at) {
      // A group's heading: a shaded band across the table and the timeline, named at its left.
      ctx.fillStyle = SHADE;
      ctx.fillRect(MARGIN, bodyTop + i * ROW, GRID_WIDTH + timelineWidth, ROW);
      font("600", 10);
      ctx.fillStyle = INK;
      ctx.textAlign = "left";
      ctx.fillText(fitText(ctx, at.heading, GRID_WIDTH - 10), MARGIN + 5, y);
      return;
    }
    const task = project.tasks[at.index];
    const cells: Record<(typeof COLUMNS)[number]["key"], string> = {
      row: String(at.index + 1),
      name: task.name,
      duration: formatDuration(
        at.summary
          ? { minutes: at.duration, unit: "d", elapsed: false, estimated: false }
          : { minutes: task.duration, unit: task.durationUnit, elapsed: task.elapsed === true, estimated: task.estimated === true },
        project,
      ),
      start: formatDate(at.start, language),
      finish: formatDate(at.finish, language),
    };
    let cx = MARGIN;
    for (const column of COLUMNS) {
      font(at.summary && column.key === "name" ? "600" : "400", 10);
      ctx.fillStyle = column.key === "row" ? MUTED : INK;
      ctx.textAlign = column.align;
      const indent = column.key === "name" ? (task.outlineLevel - 1) * 10 : 0;
      const text = fitText(ctx, cells[column.key], column.width - 10 - indent);
      ctx.fillText(text, column.align === "right" ? cx + column.width - 5 : cx + 5 + indent, y);
      cx += column.width;
    }
  });

  // Timeline: clipped to its own area, drawn in plan coordinates shifted by the sheet's offset.
  ctx.save();
  ctx.beginPath();
  ctx.rect(timelineLeft, top, timelineWidth, HEADER + bodyHeight);
  ctx.clip();
  ctx.translate(timelineLeft - offsetX, 0);
  const projectTime = compileCalendars(project.calendars).get(project.calendarId);
  if (projectTime && level.pxPerDay >= 5) {
    ctx.fillStyle = SHADE;
    for (let day = dayIndexOf(scale.at(offsetX)); day <= dayIndexOf(scale.at(offsetX + timelineWidth)); day++) {
      if (projectTime.rangesOfDay(day).length === 0) ctx.fillRect(scale.x(day * 1440), bodyTop, scale.pxPerDay, bodyHeight);
    }
  }
  ctx.textAlign = "left";
  for (const [unit, y, height] of [
    [level.top, top, HEADER / 2],
    [level.bottom, top + HEADER / 2, HEADER / 2],
  ] as const) {
    for (const cell of scaleCells(scale, unit, offsetX, offsetX + timelineWidth)) {
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cell.x, y);
      ctx.lineTo(cell.x, unit === level.bottom ? bodyTop + bodyHeight : y + height);
      ctx.stroke();
      font(unit === level.top ? "600" : "400", 9);
      ctx.fillStyle = unit === level.top ? INK : MUTED;
      const text = formatScaleCell(cell.from, unit, language, cell.width);
      if (ctx.measureText(text).width <= cell.width - 4) ctx.fillText(text, Math.max(cell.x, offsetX) + 3, y + height / 2);
    }
  }

  // Marked dates: a coloured line through the rows, named at the foot of the header.
  for (const marker of dateMarkers(project, schedule, nowOnProjectClock())) {
    if (marker.at < scale.start || marker.at > scale.end) continue;
    const mx = scale.x(marker.at);
    if (mx < offsetX || mx > offsetX + timelineWidth) continue;
    ctx.strokeStyle = MARKER_STYLE[marker.kind].ink;
    ctx.fillStyle = MARKER_STYLE[marker.kind].ink;
    ctx.lineWidth = marker.kind === "today" || marker.kind === "statusDate" ? 1.5 : 0.75;
    ctx.setLineDash(marker.kind === "statusDate" ? [4, 3] : []);
    ctx.beginPath();
    ctx.moveTo(mx, bodyTop);
    ctx.lineTo(mx, bodyTop + bodyHeight);
    ctx.stroke();
    ctx.setLineDash([]);
    font("600", 8);
    ctx.textAlign = "center";
    ctx.fillText(label(`marker.${marker.kind}`), mx, bodyTop + 6);
  }
  ctx.textAlign = "left";

  const rowOf = new Map(sheetRows.flatMap((at, i) => ("heading" in at ? [] : [[at.id, i] as const])));
  const boxOf = (id: string): BarBox | null => {
    const i = rowOf.get(id);
    const at = schedule.tasks.get(id);
    if (i === undefined || !at) return null;
    const left = scale.x(at.start);
    const right = scale.x(at.finish);
    const y = bodyTop + i * ROW + ROW / 2;
    return at.milestone && right - left < 10 ? { left: left - 5, right: left + 5, y } : { left, right, y };
  };
  ctx.strokeStyle = MUTED;
  ctx.fillStyle = MUTED;
  ctx.lineWidth = 0.75;
  for (const link of project.links) {
    const from = boxOf(link.predecessorId);
    const to = boxOf(link.successorId);
    if (!from || !to) continue;
    const route = routeLink(link.type, from, to, 6, ROW);
    ctx.beginPath();
    traceRoundedPath(ctx, route.points, 3);
    ctx.stroke();
    const tip = route.points[route.points.length - 1];
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(tip.x - route.arrow * 4, tip.y - 3);
    ctx.lineTo(tip.x - route.arrow * 4, tip.y + 3);
    ctx.fill();
  }
  sheetRows.forEach((at, i) => {
    if ("heading" in at) return;
    const y = bodyTop + i * ROW;
    const left = scale.x(at.start);
    const width = Math.max(scale.x(at.finish) - left, 2);
    const critical = marksCritical && at.critical;
    const own = critical ? undefined : view.colorOf?.(project.tasks[at.index]);
    const stroke = critical ? CRITICAL : (own ?? BAR);
    if (at.summary) {
      ctx.fillStyle = INK;
      ctx.fillRect(left, y + ROW / 2 - 3, width, 4);
      for (const edge of [left, left + width]) {
        ctx.beginPath();
        ctx.moveTo(edge - 3, y + ROW / 2 + 1);
        ctx.lineTo(edge + 3, y + ROW / 2 + 1);
        ctx.lineTo(edge, y + ROW / 2 + 5);
        ctx.fill();
      }
      return;
    }
    if (at.milestone) {
      ctx.fillStyle = critical ? CRITICAL : (own ?? INK);
      ctx.beginPath();
      ctx.moveTo(left, y + ROW / 2 - 5);
      ctx.lineTo(left + 5, y + ROW / 2);
      ctx.lineTo(left, y + ROW / 2 + 5);
      ctx.lineTo(left - 5, y + ROW / 2);
      ctx.fill();
      return;
    }
    for (const segment of at.segments) {
      const sx = scale.x(segment.start);
      const sw = Math.max(scale.x(segment.finish) - sx, 2);
      // A task's own colour fills its bar lightly, as the chart's colour does.
      ctx.globalAlpha = own === undefined ? 1 : 0.3;
      ctx.fillStyle = critical ? CRITICAL_FILL : (own ?? BAR_FILL);
      ctx.fillRect(sx, y + 5, sw, ROW - 10);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 0.75;
      ctx.strokeRect(sx, y + 5, sw, ROW - 10);
    }
    if (at.segments.length === 1 && at.percentComplete > 0) {
      ctx.fillStyle = stroke;
      ctx.fillRect(left, y + 5, (width * at.percentComplete) / 100, ROW - 10);
    }
  });
  ctx.restore();

  // Rules, frame and footer.
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= sheetRows.length; i++) {
    ctx.beginPath();
    ctx.moveTo(MARGIN, bodyTop + i * ROW);
    ctx.lineTo(MARGIN + GRID_WIDTH + timelineWidth, bodyTop + i * ROW);
    ctx.stroke();
  }
  ctx.strokeStyle = MUTED;
  ctx.strokeRect(MARGIN, top, GRID_WIDTH + timelineWidth, HEADER + bodyHeight);
  ctx.beginPath();
  ctx.moveTo(timelineLeft, top);
  ctx.lineTo(timelineLeft, bodyTop + bodyHeight);
  ctx.stroke();
  font("400", 9);
  ctx.fillStyle = MUTED;
  ctx.textAlign = "left";
  ctx.fillText(project.name, MARGIN, PAGE_HEIGHT - MARGIN - FOOTER / 2 + 8);
  ctx.textAlign = "right";
  ctx.fillText(`${sheet.number} / ${sheet.total}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - MARGIN - FOOTER / 2 + 8);
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("The browser could not encode a page of the chart"));
          return;
        }
        blob.arrayBuffer().then((buffer) => resolve(new Uint8Array(buffer)), reject);
      },
      "image/jpeg",
      0.92,
    );
  });
}

/** One line of a PDF sheet: a task, or the heading of a group of tasks. */
export type PdfRow = TaskSchedule | { heading: string };

/** The rows a PDF draws: the ones a view names, in its order, or every task of the plan. */
export function pdfRows(schedule: Schedule, view: PdfView): PdfRow[] {
  if (!view.rows) return [...schedule.tasks.values()];
  return view.rows.flatMap((row): PdfRow[] => {
    if (typeof row !== "string") return [row];
    const at = schedule.tasks.get(row);
    return at ? [at] : [];
  });
}

/**
 * Draws a plan as an A4 landscape PDF: the task table on every sheet, rows
 * running down the sheets and the timeline running across them. The text is
 * drawn by the browser, so every script the reader's fonts cover is shown.
 *
 * @param label - Translates a `column.*` key for the table headings and a `marker.*` key for the marked dates.
 * @param view - The rows and colours of the screen for the PDF to follow.
 */
export async function renderPdf(project: Project, schedule: Schedule, language: string, label: (key: string) => string, view: PdfView = {}): Promise<Uint8Array> {
  const rows = pdfRows(schedule, view);
  const layout = layoutPdf(schedule, project, rows.length);
  const total = layout.sheetsDown * layout.sheetsAcross;
  const canvas = document.createElement("canvas");
  canvas.width = PAGE_WIDTH * DENSITY;
  canvas.height = PAGE_HEIGHT * DENSITY;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("The browser gave no 2D canvas to draw the chart on");
  const images: PdfImage[] = [];
  for (let down = 0; down < layout.sheetsDown; down++) {
    for (let across = 0; across < layout.sheetsAcross; across++) {
      ctx.setTransform(DENSITY, 0, 0, DENSITY, 0, 0);
      drawSheet(ctx, project, schedule, layout, rows, { down, across, number: images.length + 1, total }, language, label, view);
      images.push({ jpeg: await canvasToJpeg(canvas), width: canvas.width, height: canvas.height });
    }
  }
  return buildPdf(images, PAGE_WIDTH_PT, PAGE_HEIGHT_PT);
}

/** Renders the plan as a PDF and hands it to the browser as a download named after the project. */
export async function downloadPdf(project: Project, schedule: Schedule, language: string, label: (key: string) => string, view: PdfView = {}): Promise<void> {
  const pdf = await renderPdf(project, schedule, language, label, view);
  const url = URL.createObjectURL(new Blob([pdf.buffer as ArrayBuffer], { type: "application/pdf" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${project.name || "project"}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}
