// Proves the layout checks by breaking one thing at a time: each defect below is added to the
// page as a style sheet, and the checks must then fail. A check that still passes over its own
// defect guards nothing, and the script exits with a failure naming it.
//
//   PROCESS_STORYBOOK_URL=http://localhost:6006 node e2e/planted-defects.mjs
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const STORIES = "^(default|long-labels|lane-filter|stack|stack-parallel|large): ";

/** Each defect, the style sheet that plants it, and words its finding must contain. */
const DEFECTS = [
  ["a label is kept on one line and cut", '[data-process-slot="act-label"], [data-process-slot="step-label"] { white-space: nowrap; overflow: hidden; }', "is cut"],
  ["a pressed thing is 32px under a finger", "@media (pointer: coarse) { [data-process-stop] { min-height: 32px !important; min-width: 32px !important; height: 32px; overflow: hidden; } }", "under a finger"],
  ["a lane toggle is 44px tall under a mouse", '[data-process-slot="lane-toggle"] { min-height: 44px; }', "under a mouse"],
  ["two nodes are drawn over one another", '[data-process-slot="act-cell"] { transform: translateX(-60%); }', "overlap"],
  ["the sideways line runs 3px low", '[data-process-seg="left_right"] { margin-top: 3px; }', "nothing meets it"],
  ["a corner is rounded by 4px", "[data-process-root] { --process-corner: 4px; }", "not rounded by 9px"],
  ["the arrowhead is wider", "[data-process-root] { --process-arrow: 7px; }", "arrowhead measures"],
  ["the arrowhead stands off its node", '[data-process-arrow="down"][data-at="node"] { margin-top: -5px; }', "touches no node"],
  ["a node stands 5px under its row's line", '[data-process-slot="act-cell"] { padding-top: 16px; }', "no line reaches"],
  ["the gate line comes down 4px off the side", '[data-process-seg="left_side-bottom"], [data-process-seg="right_rside-bottom"] { margin-left: 4px; }', "nothing meets it"],
  ["a hop stands 6px off the line it crosses", '[data-process-seg][data-hop]::after { margin-left: 6px; }', "stands over no line"],
  ["the head of a gate line stands off the line", '[data-process-arrow="down"]:is([data-at="side"], [data-at="rside"]) { margin-left: 5px; }', "stands on no line down into a node"],
  ["a dashed line is a border again, fitted to each cell", '[data-process-seg][data-style="rework"] { border-image: none; border-style: dashed; }', "is dotted by its border"],
  ["the corners of a dashed line are drawn whole", '[data-process-seg][data-style="rework"][data-process-seg="right_top"], [data-process-seg][data-style="rework"][data-process-seg="bottom_right"] { background-image: none; border-left-width: 2px; border-bottom-width: 2px; }', "is drawn whole"],
  ["a parallel run sets its cards in, off the rail", '[data-process-slot="stack"] li[data-process-slot="parallel-run"] { margin-left: 6px; }', "the rail of"],
  ["a section's heading draws its rail one pixel off", '[data-process-slot="stack"] [data-process-slot="section-title"]::before { margin-left: 1px; }', "the rail of"],
  ["the grid does not scroll inside its own box", '[data-process-slot="scroll"] { overflow: visible; }', "wider than its window"],
];

function run(css) {
  const result = spawnSync("node", ["--test", "--test-concurrency=1", `--test-name-pattern=${STORIES}`, "layout.e2e.mjs"], { cwd: HERE, encoding: "utf8", env: { ...process.env, PROCESS_E2E_PLANTED_CSS: css } });
  return { passed: result.status === 0, output: `${result.stdout}${result.stderr}` };
}

if (!run("").passed) {
  console.error("the checks do not pass before any defect is planted");
  process.exit(1);
}
let missed = 0;
for (const [name, css, words] of DEFECTS) {
  const { passed, output } = run(css);
  const found = !passed && output.includes(words);
  if (!found) missed += 1;
  console.log(`${found ? "caught" : passed ? "MISSED" : "FAILED FOR ANOTHER REASON"}  ${name}`);
}
console.log(missed === 0 ? `every one of ${DEFECTS.length} planted defects was caught` : `${missed} planted defects were not caught`);
process.exit(missed === 0 ? 0 : 1);
