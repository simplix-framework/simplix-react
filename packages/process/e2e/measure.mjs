// What a page of lanes is measured for, run inside the page. Every finding is a sentence; an
// empty list is a pass. The numbers are read from the boxes the browser laid out, never from
// the styles that asked for them.

/** The smallest a thing a finger presses may measure, in CSS pixels. */
export const TOUCH_TARGET = 44;

/** How far two ends of one line may stand apart, and how far a label may reach past its box. */
export const TOLERANCE = 1;

/**
 * Measures the lanes on the page.
 *
 * @returns `problems` as sentences, and the counts of what was measured, so that a pass over
 *   nothing cannot read as a pass
 */
export function measure({ touch, tolerance }) {
  const problems = [];
  const root = document.querySelector("[data-process-root]");
  const layout = root.dataset.layout;
  const rect = (element) => element.getBoundingClientRect();
  const name = (element) => element.dataset.processStop ?? element.dataset.processSlot ?? element.tagName;

  // The page is never wider than its window: sideways scrolling belongs to the grid's own box.
  const page = document.documentElement;
  if (page.scrollWidth > page.clientWidth) problems.push(`the page is ${page.scrollWidth - page.clientWidth}px wider than its window`);

  // Labels are whole: nothing reaches past the box that holds it.
  const labels = [...root.querySelectorAll('[data-process-slot="step-label"], [data-process-slot="act-label"], [data-process-slot="section-title"], [data-process-slot="lane-head"], [data-process-slot="chip"], [data-process-slot="jump"], [data-process-slot="act"], [data-process-slot="step-button"], [data-process-slot="off-reason"]')];
  for (const label of labels) {
    if (label.scrollWidth > label.clientWidth + tolerance || label.scrollHeight > label.clientHeight + tolerance) {
      problems.push(`${name(label)} "${label.textContent.trim().slice(0, 30)}" is cut: ${label.scrollWidth}x${label.scrollHeight} in ${label.clientWidth}x${label.clientHeight}`);
    }
  }

  // Everything pressed is at least a fingertip in both directions.
  const pressed = [...root.querySelectorAll('[data-process-stop], [data-process-slot="lane-toggle"], [data-process-slot="section-link"]')];
  for (const target of pressed) {
    const box = rect(target);
    if (box.width < touch - 0.5 || box.height < touch - 0.5) problems.push(`${name(target)} measures ${box.width.toFixed(1)}x${box.height.toFixed(1)}`);
  }

  // Boxes of one kind never overlap one another.
  const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > tolerance && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > tolerance;
  const apart = (selector) => {
    const boxes = [...root.querySelectorAll(selector)].map((element) => ({ element, box: rect(element) }));
    for (let a = 0; a < boxes.length; a += 1) {
      for (let b = a + 1; b < boxes.length; b += 1) {
        if (overlap(boxes[a].box, boxes[b].box)) problems.push(`${name(boxes[a].element)} and ${name(boxes[b].element)} overlap`);
      }
    }
    return boxes.length;
  };
  const stops = apart("[data-process-stop], [data-process-slot=\"act\"]");
  apart('[data-process-slot="card"]');
  apart('[data-process-slot="step-title"], [data-process-slot="jumps"], [data-process-slot="step-off"], [data-process-slot="section-title"]');

  let ends = 0;
  let arrows = 0;
  if (layout !== "stack") {
    // Every end of a line that stands on the edge of its cell is met by an end of the same style in the next cell.
    const points = [];
    for (const cell of root.querySelectorAll('[data-process-slot="lines"]')) {
      const frame = rect(cell);
      for (const segment of cell.querySelectorAll("[data-process-seg]")) {
        const box = rect(segment);
        const style = getComputedStyle(segment);
        const line = Math.max(parseFloat(style.borderLeftWidth), parseFloat(style.borderTopWidth), parseFloat(style.borderRightWidth), parseFloat(style.borderBottomWidth));
        const half = line / 2;
        const xc = box.left + box.width / 2;
        const yc = box.top + box.height / 2;
        const shape = segment.dataset.processSeg;
        const found = {
          tb: [[xc, box.top], [xc, box.bottom]],
          tc: [[xc, box.top]],
          bc: [[xc, box.bottom]],
          lr: [[box.left, yc], [box.right, yc]],
          lc: [[box.left, yc]],
          rc: [[box.right, yc]],
          tr: [[box.left + half, box.top], [box.right, box.bottom - half]],
          tl: [[box.right - half, box.top], [box.left, box.bottom - half]],
          br: [[box.left + half, box.bottom], [box.right, box.top + half]],
          bl: [[box.right - half, box.bottom], [box.left, box.top + half]],
        }[shape];
        if (found === undefined) {
          problems.push(`a line of unknown shape ${shape}`);
          continue;
        }
        for (const [x, y] of found) {
          const onEdge = Math.abs(x - frame.left) < 0.6 || Math.abs(x - frame.right) < 0.6 || Math.abs(y - frame.top) < 0.6 || Math.abs(y - frame.bottom) < 0.6;
          if (!onEdge) problems.push(`a ${shape} line of cell ${cell.dataset.processCell} ends ${x.toFixed(1)},${y.toFixed(1)} inside its cell`);
          points.push({ x, y, cell: cell.dataset.processCell, kind: segment.dataset.style, shape });
        }
        if (shape.length === 2 && "tb".includes(shape[0]) && "lr".includes(shape[1]) && style[`border${shape[0] === "t" ? "Bottom" : "Top"}${shape[1] === "r" ? "Left" : "Right"}Radius`] !== "8px") {
          problems.push(`a ${shape} corner is rounded by ${style.borderBottomLeftRadius || style.borderTopLeftRadius}`);
        }
      }
    }
    ends = points.length;
    for (const point of points) {
      const met = points.some((other) => other.cell !== point.cell && other.kind === point.kind && Math.abs(other.x - point.x) <= tolerance && Math.abs(other.y - point.y) <= tolerance);
      if (!met) problems.push(`the ${point.kind} ${point.shape} line of cell ${point.cell} ends at ${point.x.toFixed(1)},${point.y.toFixed(1)} and nothing meets it`);
    }

    // The line into an act runs down the middle of its box, and its arrowhead touches the box.
    for (const cell of root.querySelectorAll('[data-process-slot="act-cell"]')) {
      const button = cell.querySelector('[data-process-slot="act"]:not([aria-hidden])');
      if (button === null) continue;
      const box = rect(button);
      const frame = rect(cell);
      const lines = [...root.querySelectorAll('[data-process-slot="lines"]')].find((entry) => {
        const at = rect(entry);
        return Math.abs(at.left - frame.left) < 0.6 && Math.abs(at.top - frame.top) < 0.6;
      });
      const into = lines?.querySelector('[data-process-seg="tc"]');
      if (into === undefined || into === null) {
        problems.push(`no line runs into act ${button.dataset.processAct}`);
        continue;
      }
      const line = rect(into);
      if (Math.abs(line.left + line.width / 2 - (box.left + box.width / 2)) > tolerance) problems.push(`the line into act ${button.dataset.processAct} is off the middle of its box`);
      const arrow = lines.querySelector('[data-process-arrow="down"]');
      if (arrow === null) problems.push(`no arrowhead points at act ${button.dataset.processAct}`);
      else if (Math.abs(rect(arrow).bottom - box.top) > 1.5) problems.push(`the arrowhead above act ${button.dataset.processAct} stands ${(box.top - rect(arrow).bottom).toFixed(1)}px off its box`);
    }

    // Arrowheads keep one size whatever the cell measures.
    for (const arrow of root.querySelectorAll("[data-process-arrow]")) {
      const box = rect(arrow);
      const [width, height] = arrow.dataset.processArrow === "down" ? [10, 5] : [5, 10];
      arrows += 1;
      if (Math.abs(box.width - width) > 0.1 || Math.abs(box.height - height) > 0.1) problems.push(`an arrowhead measures ${box.width}x${box.height}`);
    }
  }

  return {
    problems,
    layout,
    width: Math.round(rect(root).width),
    lanes: Number(root.dataset.lanes),
    tracks: Number(root.dataset.tracks),
    counted: { labels: labels.length, pressed: pressed.length, stops, ends, arrows },
  };
}
