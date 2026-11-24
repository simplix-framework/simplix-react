"""Figures for the gantt and process package READMEs and guides.

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, boundary, DASH_OUTSIDE, HAIRLINE, SANS, STROKE, THICK,
                    canvas, card, card_h, edge_label, figure, note, save, tw)

LANGS = ("en", "ko")

LABELS = {
    "pkg-gantt-core-model-flow": {
        "en": {
            "projects": [("Project", ["tasks, links, calendars"]),
                         ("next Project", ["one more task"]),
                         ("next Project", ["one more link"])],
            "edits": ["insertTask", "addLink"],
            "schedule": ("Schedule", ["tasks · links · conflicts"]),
            "compute": "computeSchedule",
            "verdict": "Edit functions return the next Project · "
                       "computed dates are never stored in it",
        },
        "ko": {
            "projects": [("프로젝트", ["작업 · 연결 · 달력"]),
                         ("다음 프로젝트", ["작업 하나 추가"]),
                         ("다음 프로젝트", ["연결 하나 추가"])],
            "edits": ["insertTask", "addLink"],
            "schedule": ("Schedule", ["작업 · 연결 · 충돌"]),
            "compute": "computeSchedule",
            "verdict": "편집 함수는 다음 프로젝트를 반환 · "
                       "계산된 날짜는 프로젝트에 저장하지 않음",
        },
    },
}


@figure(plain=True)
def fig_gantt_model_flow(lang):
    """A chain of immutable projects along the top; each one's schedule hangs
    below it and is never fed back."""
    fid = "pkg-gantt-core-model-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 600)
    fg = c.t["fg_dim"]
    gap = 130
    cw = (1152 - 2 * gap) / 3
    xs = [24 + k * (cw + gap) for k in range(3)]
    y1 = 24
    hp = max(card_h(cw, *p) for p in t["projects"])
    ps = [card(c, x, y1, cw, c.purple, *p, h=hp, sw=STROKE)
          for x, p in zip(xs, t["projects"])]
    y2 = y1 + hp + 70
    ss = [card(c, x, y2, cw, c.green, *t["schedule"], wash=True) for x in xs]
    ym = y1 + hp / 2
    for a, z, label in zip(ps, ps[1:], t["edits"]):
        c.line(a[0] + cw, ym, z[0], ym, color=c.purple, sw=THICK,
               marker=c.purple)
        edge_label(c, a[0] + cw + gap / 2, ym - 20, label, c.purple,
                   pill=False)
    lw = tw(t["compute"], 16) + 12
    for p, s in zip(ps, ss):
        x = p[0] + cw / 2
        c.line(x, p[1] + p[3], x, s[1], color=c.green, sw=STROKE,
               marker=c.green)
        edge_label(c, x + 10 + lw / 2, (p[1] + p[3] + s[1]) / 2, t["compute"],
                   c.green, pill=False)
    note(c, 24, ss[0][1] + ss[0][3] + 30, 1152, t["verdict"], c.purple)
    save(c, f"{fid}.{lang}")



LABELS["pkg-gantt-guide-merge"] = {
    "en": {
        "cols": ["base", "mine", "theirs", "merged plan"],
        "subs": ["both sides started from", "the chart's plan", "the server plan", ""],
        "rows": ["changed only there", "changed only here", "changed on both sides"],
        "orig": "original",
        "same": "unchanged",
        "changed": "changed",
        "taken": "theirs taken",
        "kept": "mine kept",
        "conflict": "kept · conflict",
        "settle": ("settleMerge", ["Take theirs: each chosen conflict gets their version"]),
    },
    "ko": {
        "cols": ["base", "mine", "theirs", "합친 계획"],
        "subs": ["양쪽이 출발한 계획", "이쪽 계획", "받아온 쪽", ""],
        "rows": ["받아온 쪽만 변경", "이쪽만 변경", "양쪽 모두 변경"],
        "orig": "원래 값",
        "same": "그대로",
        "changed": "변경",
        "taken": "받아들임",
        "kept": "이쪽 유지",
        "conflict": "이쪽 유지 · 충돌",
        "settle": ("settleMerge", ["받아온 변경: 고른 충돌에 받아온 쪽 값을 적용"]),
    },
}


@figure(plain=True)
def fig_gantt_merge(lang):
    """One record per row, compared against base on each side; the merged
    column follows from which side changed it, and conflicts go on to
    settleMerge."""
    fid = "pkg-gantt-guide-merge"
    t = LABELS[fid][lang]
    c = canvas(1200, 700)
    lab_w = 250
    gap = 18
    cw = (1152 - lab_w - 4 * gap) / 4
    xs = [24 + lab_w + gap + k * (cw + gap) for k in range(4)]
    head = 24
    for k, x in enumerate(xs):
        c.text(x + cw / 2, head + BODY * 0.8, t["cols"][k], size=BODY,
               color=c.t["fg"], weight=700, anchor="middle", family=SANS)
        if t["subs"][k]:
            c.text(x + cw / 2, head + BODY * 0.8 + 22, t["subs"][k], size=16,
                   color=c.t["fg_dim"], anchor="middle", family=SANS)
    y = head + 62
    ch = card_h(cw, None, [t["conflict"]], align="middle")
    rowgap = 16
    grid = [
        (t["orig"], (t["same"], False), (t["changed"], True), (t["taken"], c.green)),
        (t["orig"], (t["changed"], True), (t["same"], False), (t["kept"], c.purple)),
        (t["orig"], (t["changed"], True), (t["changed"], True), (t["conflict"], c.red)),
    ]
    last = None
    for r, (base, mine, theirs, merged) in enumerate(grid):
        yr = y + r * (ch + rowgap)
        c.text(24, yr + ch / 2 + BODY * 0.36, t["rows"][r], size=BODY,
               color=c.t["fg"], weight=600, family=SANS)
        card(c, xs[0], yr, cw, c.t["line"], None, [base], h=ch, align="middle",
             valign="middle")
        for x, (txt, hit) in ((xs[1], mine), (xs[2], theirs)):
            card(c, x, yr, cw, c.blue if hit else c.t["line"], None, [txt],
                 h=ch, align="middle", valign="middle", wash=hit,
                 color=c.blue if hit else None)
        txt, col = merged
        last = card(c, xs[3], yr, cw, col, None, [txt], h=ch, align="middle",
                    valign="middle", wash=True, sw=STROKE)
    ys = last[1] + ch + 56
    title, lines = t["settle"]
    sw_ = 3 * cw + 2 * gap
    sx = xs[3] + cw - sw_
    s = card(c, sx, ys, sw_, c.red, title, lines)
    x = xs[3] + cw / 2
    c.line(x, last[1] + ch, x, ys, color=c.red, sw=STROKE, marker=c.red)
    save(c, f"{fid}.{lang}")



LABELS["pkg-process-core-definition"] = {
    "en": {
        "def": "ProcessDefinition",
        "sec": "sections: Section[]",
        "steps": "steps: Step[]",
        "step": ("Step", ["condition", "parallel", "repeat.endedBy: a step",
                          "rework"]),
        "act": ("acts: Act[]", ["kind: do · check", "lanes: lane ids",
                                "condition"]),
        "lane": ("lanes: Lane[]", ["label · group · caption"]),
        "jump": ("jumps: Jump[]", ["from: a step", "to: a step or external",
                                   "label"]),
        "r_lane": "performed by",
        "r_jump": "from · to",
    },
    "ko": {
        "def": "ProcessDefinition (절차)",
        "sec": "sections: Section[] (구간)",
        "steps": "steps: Step[] (단계)",
        "step": ("Step (단계)", ["condition (조건)", "parallel (동시 진행)",
                                "repeat.endedBy (반복): 단계",
                                "rework (보완)"]),
        "act": ("acts: Act[] (행위)", ["kind: do (수행) · check (확인)",
                                      "lanes: 레인 id", "condition (조건)"]),
        "lane": ("lanes: Lane[] (레인)", ["label · group · caption"]),
        "jump": ("jumps: Jump[] (이동)", ["from: 단계",
                                         "to: 단계 또는 external", "label"]),
        "r_lane": "수행 레인",
        "r_jump": "출발 · 도착 단계",
    },
}


def fig_process_definition(lang):
    """Containment drawn as nested boundaries; the references that cross it
    (an act's lanes, a jump's steps) drawn as arrows out of it."""
    fid = "pkg-process-core-definition"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    lw_ = 330
    x_left = 48
    x_sec = x_left + lw_ + 150
    x_step = x_sec + 24
    w_step = 1152 - 24 - (x_step - 24) - 24
    w_in = w_step - 48
    hs = card_h(w_in, *t["step"])
    ha = card_h(w_in, *t["act"])
    top = 30
    y_sec = top + 52
    y_step = y_sec + 52
    y_s = y_step + 34
    y_a = y_s + hs + 24
    bottom_step = y_a + ha + 24
    bottom_sec = bottom_step + 24
    bottom = bottom_sec + 24
    boundary(c, 24, top, 1152, bottom - top, c.purple, t["def"])
    boundary(c, x_sec, y_sec, 1176 - 24 - x_sec, bottom_sec - y_sec, c.blue,
             t["sec"])
    boundary(c, x_step, y_step, w_step, bottom_step - y_step, c.teal,
             t["steps"])
    s = card(c, x_step + 24, y_s, w_in, c.teal, *t["step"])
    a = card(c, x_step + 24, y_a, w_in, c.green, *t["act"], sw=STROKE)
    hj = card_h(lw_, *t["jump"])
    hl = card_h(lw_, *t["lane"])
    j = card(c, x_left, y_step, lw_, c.orange, *t["jump"])
    yl = a[1] + a[3] / 2 - hl / 2
    ln = card(c, x_left, yl, lw_, c.purple, *t["lane"])
    # an act names the lanes that perform it
    ya = a[1] + a[3] / 2
    c.line(a[0], ya, ln[0] + lw_, ya, color=c.green, sw=STROKE, marker=c.green)
    edge_label(c, (ln[0] + lw_ + x_sec) / 2, ya - 18, t["r_lane"], c.green,
               pill=False)
    # a jump leaves one step and arrives at another
    yj = j[1] + j[3] / 2
    c.line(j[0] + lw_, yj, x_step, yj, color=c.orange, sw=STROKE,
           marker=c.orange)
    edge_label(c, (j[0] + lw_ + x_sec) / 2, yj - 18, t["r_jump"], c.orange,
               pill=False)
    save(c, f"{fid}.{lang}")



LABELS["pkg-process-layouts"] = {
    "en": {
        "head": "chooseLayout(width): the width of the component's box, not the screen",
        "modes": [("stack", "one column of step cards"),
                  ("lanes-scroll", "lane grid, scrolled sideways"),
                  ("lanes", "lanes side by side")],
        "t1": "under 560 px",
        "t2": "under requiredWidth",
        "t3": "requiredWidth or wider",
        "step": "Step",
        "jump": "jump lines",
    },
    "ko": {
        "head": "chooseLayout(width): 화면이 아닌 컴포넌트 상자의 너비로 선택",
        "modes": [("stack", "한 열 배치"),
                  ("lanes-scroll", "레인 배치, 가로 스크롤"),
                  ("lanes", "레인 배치")],
        "t1": "560 px 미만",
        "t2": "requiredWidth 미만",
        "t3": "requiredWidth 이상",
        "step": "단계",
        "jump": "이동 선",
    },
}


def _frame(c, x, y, w, h, color, rx=10):
    """The component's box, drawn as a path: a box that holds a drawing is a
    boundary, not a node the arrows inside it would be read as crossing."""
    c.path(f"M{x + rx},{y} H{x + w - rx} A{rx},{rx} 0 0 1 {x + w},{y + rx} "
           f"V{y + h - rx} A{rx},{rx} 0 0 1 {x + w - rx},{y + h} "
           f"H{x + rx} A{rx},{rx} 0 0 1 {x},{y + h - rx} "
           f"V{y + rx} A{rx},{rx} 0 0 1 {x + rx},{y} Z", color=color,
           sw=STROKE, marker=None)


def _grid(c, x, y, lane_w, cut, t, jumps):
    """A lane grid of three steps and three lanes, acts as chips in their lane,
    clipped at `cut`. Returns the right edge of what it drew."""
    title_w, track, row_h = 84, 16, 46
    x_lanes = x + title_w + track
    chips = []
    for r in range(3):
        yr = y + r * (row_h + 8)
        c.text(x, yr + row_h / 2 + 7, f"{t['step']} {r + 1}", size=BODY,
               color=c.t["fg"], weight=600, family=SANS)
        cx = x_lanes + r * lane_w + 16
        cw = min(lane_w - 32, cut - cx)
        if cw > 8:
            c.rrect(cx, yr + 10, cw, row_h - 20, rx=6, fill=c.green,
                    stroke=c.green, sw=HAIRLINE, opacity=0.35)
        chips.append((cx, yr + 10, cw, row_h - 20) if cw == lane_w - 32
                     else None)
    for k in range(3):
        lx = x_lanes + k * lane_w
        if lx < cut:
            c.line(lx, y, lx, y + 3 * row_h + 16, color=c.t["line"],
                   sw=HAIRLINE, marker=None)
    right = min(x_lanes + 3 * lane_w, cut)
    if jumps:
        a, b, z = chips
        xr = z[0] + z[2] / 2
        c.path(f"M{a[0] + a[2]},{a[1] + a[3] / 2} H{xr} V{z[1]}",
               color=c.orange, sw=STROKE, marker=c.orange)
        xl = x + title_w + track / 2
        c.path(f"M{z[0]},{z[1] + z[3] / 2 + 6} H{xl} V{b[1] + b[3] / 2} "
               f"H{b[0]}", color=c.orange, sw=STROKE, marker=c.orange)
        right = z[0] + z[2]
    return right


@figure(plain=True)
def fig_process_layouts(lang):
    """One definition, three drawings, picked by the width of the box."""
    fid = "pkg-process-layouts"
    t = LABELS[fid][lang]
    c = canvas(1200, 700)
    fg = c.t["fg_dim"]
    c.text(24, 24 + BODY * 0.8, t["head"], size=BODY, color=c.t["fg"],
           weight=700, family=SANS)
    regions = [(24, 250), (304, 380), (714, 462)]
    accs = (c.blue, c.teal, c.purple)
    y_rail = 70
    rail_h = 32
    for (x, w), lab, acc in zip(regions, (t["t1"], t["t2"], t["t3"]), accs):
        c.rrect(x, y_rail, w, rail_h, rx=6, fill=acc, stroke=None,
                opacity=0.16, measure="width")
        c.text(x + w / 2, y_rail + rail_h / 2 + 7, lab, size=BODY, color=acc,
               weight=600, anchor="middle", family=SANS)
    y_head = y_rail + rail_h + 28
    for (x, w), (code, desc), acc in zip(regions, t["modes"], accs):
        c.text(x, y_head + BODY * 0.8, code, size=BODY, color=acc, weight=700,
               family=SANS)
        c.text(x, y_head + BODY * 0.8 + 26, desc, size=BODY, color=fg,
               family=SANS)
    pad = 16
    y_box = y_head + 56
    yin = y_box + pad
    grid_h = 3 * 46 + 16
    # stack: one column of step cards
    x, w = regions[0]
    bw = 190
    ch = (grid_h - 2 * 10) / 3
    for r in range(3):
        card(c, x + pad, yin + r * (ch + 10), bw - 2 * pad, c.blue, None,
             [f"{t['step']} {r + 1}"], h=ch, valign="middle")
    _frame(c, x, y_box, bw, grid_h + 2 * pad, c.blue)
    # lanes-scroll: the grid clipped by the box, with a scroll bar
    x, w = regions[1]
    bw = 300
    _grid(c, x + pad, yin, 74, x + bw - pad, t, False)
    ysb = yin + grid_h + 10
    c.rrect(x + pad, ysb, bw - 2 * pad, 6, rx=3, fill=c.t["line"],
            stroke=None, measure="width")
    c.band(x + pad, ysb, (bw - 2 * pad) * 0.6, 6, 3, c.teal, opacity=0.9,
           side="left")
    _frame(c, x, y_box, bw, grid_h + 16 + 2 * pad, c.teal)
    # lanes: every lane side by side, jump lines on the tracks
    x, w = regions[2]
    right = _grid(c, x + pad, yin, 104, 1176, t, True)
    bw = right - x + pad
    _frame(c, x, y_box, bw, grid_h + 2 * pad, c.purple)
    c.text(x + bw, y_head + BODY * 0.8, t["jump"], size=16, color=c.orange,
           weight=600, anchor="end", family=SANS)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_gantt_model_flow(_lang)
    fig_gantt_merge(_lang)
    fig_process_definition(_lang)
    fig_process_layouts(_lang)
