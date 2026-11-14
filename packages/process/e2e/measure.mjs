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
  const all = (selector) => [...root.querySelectorAll(selector)];

  // The page is never wider than its window: sideways scrolling belongs to the grid's own box.
  const page = document.documentElement;
  if (page.scrollWidth > page.clientWidth) problems.push(`the page is ${page.scrollWidth - page.clientWidth}px wider than its window`);

  // Labels are whole: nothing reaches past the box that holds it.
  const labels = all('[data-process-slot="step-label"], [data-process-slot="act-label"], [data-process-slot="section-title"], [data-process-slot="lane-name"], [data-process-slot="lane-caption"], [data-process-slot="jump"], [data-process-slot="act"], [data-process-slot="step-button"], [data-process-slot="off-reason"], [data-process-slot="step-title"], [data-process-slot="act-cell"], [data-process-slot="act-line"]');
  for (const label of labels) {
    if (label.scrollWidth > label.clientWidth + tolerance || label.scrollHeight > label.clientHeight + tolerance) {
      problems.push(`${name(label)} "${label.textContent.trim().slice(0, 30)}" is cut: ${label.scrollWidth}x${label.scrollHeight} in ${label.clientWidth}x${label.clientHeight}`);
    }
  }

  // Under a finger everything pressed is at least a fingertip in both directions; under a mouse
  // the controls keep the framework's own sizes and none is as tall as a fingertip.
  const coarse = matchMedia("(pointer: coarse)").matches;
  const pressed = all('[data-process-stop], [data-process-slot="lane-toggle"], [data-process-slot="section-link"]');
  for (const target of pressed) {
    const box = rect(target);
    if (coarse && (box.width < touch - 0.5 || box.height < touch - 0.5)) problems.push(`${name(target)} measures ${box.width.toFixed(1)}x${box.height.toFixed(1)} under a finger`);
  }
  if (!coarse) {
    for (const control of all('[data-process-slot="lane-toggle"], [data-process-slot="section-link"]')) {
      if (rect(control).height >= touch) problems.push(`${name(control)} is ${rect(control).height}px tall under a mouse`);
    }
  }

  // Boxes of one kind never overlap one another.
  const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > tolerance && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > tolerance;
  const apart = (selector) => {
    const boxes = all(selector).map((element) => ({ element, box: rect(element) }));
    for (let a = 0; a < boxes.length; a += 1) {
      for (let b = a + 1; b < boxes.length; b += 1) {
        if (overlap(boxes[a].box, boxes[b].box)) problems.push(`${name(boxes[a].element)} and ${name(boxes[b].element)} overlap`);
      }
    }
    return boxes.length;
  };
  const stops = apart('[data-process-stop], [data-process-slot="act"]');
  apart('[data-process-slot="card"]');
  apart('[data-process-slot="step-title"], [data-process-slot="step-off"], [data-process-slot="section-title"]');
  apart('[data-process-slot="node"], [data-process-slot="marker"]');

  let ends = 0;
  let arrows = 0;
  let nodes = 0;
  let rail = 0;
  if (layout === "stack") {
    // One column is one rail: every piece of it, and every number, node and mark on it, stands at one x.
    // A piece drawn by a pseudo-element is offset from inside its element's border.
    const drawn = (element, pseudo) => {
      const line = getComputedStyle(element, pseudo);
      if (line.content === "none") return undefined;
      return rect(element).left + parseFloat(getComputedStyle(element).borderLeftWidth) + parseFloat(line.left) + parseFloat(line.marginLeft) + parseFloat(line.borderLeftWidth) / 2;
    };
    const centre = (element) => rect(element).left + rect(element).width / 2;
    const pieces = [
      ...all('[data-process-slot="card"]').flatMap((element) => [["a card", drawn(element, "::before")], ["the gap under a card", drawn(element, "::after")]]),
      ...all('[data-process-slot="section-title"], [data-process-slot="parallel-title"]').map((element) => [`the ${element.dataset.processSlot}`, drawn(element, "::before")]),
      ...all('[data-process-slot="stack-marker"][data-kind="start"]').map((element) => ["the start mark's line", drawn(element, "::after")]),
      ...all('[data-process-slot="stack"] [data-process-slot="node"]').map((element) => ["a node", centre(element)]),
      ...all('[data-process-slot="stack"] [data-process-slot="step-number"]').map((element) => ["a step number", centre(element)]),
      ...all('[data-process-slot="stack-marker"] [data-process-slot="marker"]').map((element) => ["a mark", centre(element)]),
    ].filter(([, x]) => x !== undefined);
    rail = pieces.length;
    const at = pieces.length === 0 ? 0 : pieces[0][1];
    for (const [what, x] of pieces) {
      if (Math.abs(x - at) > 0.6) problems.push(`the rail of ${what} stands at ${x.toFixed(1)}px and the rail above it at ${at.toFixed(1)}px`);
    }
  }
  if (layout !== "stack") {
    const edgePoints = [];
    const nodePoints = [];
    for (const cell of all('[data-process-slot="lines"]')) {
      const frame = rect(cell);
      for (const segment of cell.querySelectorAll("[data-process-seg]")) {
        const box = rect(segment);
        const style = getComputedStyle(segment);
        // The width the line is drawn at: a corner of a dotted line draws no border of its own, so the width is read from where it is stated.
        const line = parseFloat(style.getPropertyValue("--process-line"));
        const half = line / 2;
        const xc = box.left + box.width / 2;
        const yc = box.top + box.height / 2;
        const shape = segment.dataset.processSeg;
        // Where each shape ends: on the edge of its cell, and at its node where it reaches one.
        const found = {
          bottom_top: { edge: [[xc, box.top], [xc, box.bottom]] },
          center_top: { edge: [[xc, box.top]], node: [xc, box.bottom] },
          bottom_center: { edge: [[xc, box.bottom]], node: [xc, box.top] },
          left_right: { edge: [[box.left, yc], [box.right, yc]] },
          center_left: { edge: [[box.left, yc]], node: [box.right, yc] },
          center_right: { edge: [[box.right, yc]], node: [box.left, yc] },
          right_top: { edge: [[box.left + half, box.top], [box.right, box.bottom - half]] },
          left_top: { edge: [[box.right - half, box.top], [box.left, box.bottom - half]] },
          bottom_right: { edge: [[box.left + half, box.bottom], [box.right, box.top + half]] },
          bottom_left: { edge: [[box.right - half, box.bottom], [box.left, box.top + half]] },
          "center_side-top": { edge: [[box.left + half, box.top]], beside: [box.right, box.bottom - half] },
          "left_side-bottom": { edge: [[box.left, box.top + half], [box.right - half, box.bottom]] },
          "center_rside-top": { edge: [[box.right - half, box.top]], beside: [box.left, box.bottom - half] },
          "right_rside-bottom": { edge: [[box.right, box.top + half], [box.left + half, box.bottom]] },
        }[shape];
        if (found === undefined) {
          problems.push(`a line of unknown shape ${shape}`);
          continue;
        }
        for (const [x, y] of found.edge) {
          const onEdge = Math.abs(x - frame.left) < 1.6 || Math.abs(x - frame.right) < 1.6 || Math.abs(y - frame.top) < 0.6 || Math.abs(y - frame.bottom) < 0.6;
          if (!onEdge) problems.push(`a ${shape} line of cell ${cell.dataset.processCell} ends ${x.toFixed(1)},${y.toFixed(1)} inside its cell`);
          edgePoints.push({ x, y, cell: cell.dataset.processCell, kind: segment.dataset.style, shape });
        }
        // A dotted or dashed line is a pattern of a fixed period; a dotted border is fitted to each box and changes density along one line.
        if (["dotted", "dashed"].some((kind) => [style.borderLeftStyle, style.borderTopStyle, style.borderRightStyle, style.borderBottomStyle].includes(kind))) {
          problems.push(`a ${segment.dataset.style} ${shape} line is dotted by its border`);
        }
        // And a dotted line is dotted along its whole length: the only piece drawn whole is the turn of a corner, a square of its radius.
        if (["parallel", "repeat", "rework"].includes(segment.dataset.style) && style.borderImageSource === "none" && style.backgroundImage === "none") {
          problems.push(`a ${segment.dataset.style} ${shape} line is drawn whole`);
        }
        if (found.node !== undefined) nodePoints.push({ x: found.node[0], y: found.node[1], reach: 0 });
        if (found.beside !== undefined) nodePoints.push({ x: found.beside[0], y: found.beside[1], reach: -1 });
        // A corner is rounded by one radius whatever its cell measures; on a dotted line the turn is a piece of its own.
        const turn = ["parallel", "repeat", "rework"].includes(segment.dataset.style) ? getComputedStyle(segment, "::before") : style;
        if (["right_top", "left_top", "bottom_right", "bottom_left"].includes(shape) && ![turn.borderTopLeftRadius, turn.borderTopRightRadius, turn.borderBottomLeftRadius, turn.borderBottomRightRadius].includes("9px")) {
          problems.push(`a ${shape} corner is not rounded by 9px`);
        }
      }
    }
    // Every end of a line that stands on the edge of its cell is met by an end of the same style in the next cell.
    ends = edgePoints.length;
    for (const point of edgePoints) {
      const met = edgePoints.some((other) => other.cell !== point.cell && other.kind === point.kind && Math.abs(other.x - point.x) <= tolerance && Math.abs(other.y - point.y) <= tolerance);
      if (!met) problems.push(`the ${point.kind} ${point.shape} line of cell ${point.cell} ends at ${point.x.toFixed(1)},${point.y.toFixed(1)} and nothing meets it`);
    }

    // Every node has a line that ends at its middle, or beside it on its rim.
    const circles = all('[data-process-slot="node"], [data-process-slot="marker"]').map((element) => {
      const box = rect(element);
      return { element, x: box.left + box.width / 2, y: box.top + box.height / 2, radius: box.width / 2 };
    });
    nodes = circles.length;
    for (const circle of circles) {
      const held = nodePoints.some((point) => {
        const distance = Math.hypot(point.x - circle.x, point.y - circle.y);
        return point.reach === 0 ? distance <= tolerance + 0.5 : Math.abs(distance - circle.radius) <= 1.5;
      });
      if (!held) problems.push(`no line reaches the ${circle.element.dataset.processSlot} at ${circle.x.toFixed(1)},${circle.y.toFixed(1)}`);
    }

    // Arrowheads keep one size whatever the cell measures, and one that points at a node touches it.
    for (const arrow of all("[data-process-arrow]")) {
      const box = rect(arrow);
      const direction = arrow.dataset.processArrow;
      const upright = direction === "down" || direction === "up";
      arrows += 1;
      if (Math.abs(box.width - (upright ? 10 : 7)) > 0.1 || Math.abs(box.height - (upright ? 7 : 10)) > 0.1) problems.push(`a ${direction} arrowhead measures ${box.width}x${box.height}`);
      if (arrow.dataset.at === "side" || arrow.dataset.at === "rside") {
        // A line from a gate row points down on the piece that carries it into the node: its head stands
        // on that piece, just past the foot of the gate row, with its tip level with the top of the node.
        const tip = [box.left + box.width / 2, box.bottom];
        const carried = edgePoints.some((point) => point.shape.startsWith("center_") && Math.abs(point.x - tip[0]) <= 1 && tip[1] - point.y >= -1 && tip[1] - point.y <= box.height + 1);
        const level = circles.some((circle) => Math.abs(tip[1] - (circle.y - circle.radius)) <= 1 && Math.abs(tip[0] - circle.x) <= circle.radius * 2 + 1);
        if (direction !== "down" || !carried || !level) problems.push(`the ${direction} arrowhead of a gate row at ${tip[0].toFixed(1)},${tip[1].toFixed(1)} stands on no line down into a node`);
        continue;
      }
      if (arrow.dataset.at !== "node") continue;
      const tip = direction === "down" ? [box.left + box.width / 2, box.bottom] : direction === "right" ? [box.right, box.top + box.height / 2] : [box.left, box.top + box.height / 2];
      const touches = circles.some((circle) => Math.abs(Math.hypot(tip[0] - circle.x, tip[1] - circle.y) - circle.radius) <= 1.5);
      if (!touches) problems.push(`a ${direction} arrowhead at ${tip[0].toFixed(1)},${tip[1].toFixed(1)} touches no node`);
    }
  }

  return {
    problems,
    layout,
    coarse,
    width: Math.round(rect(root).width),
    lanes: Number(root.dataset.lanes),
    tracks: Number(root.dataset.tracks),
    counted: { labels: labels.length, pressed: pressed.length, stops, ends, arrows, nodes, rail },
  };
}
