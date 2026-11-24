"""Figures for the data guides on hooks and forms (React hooks reference, form hooks)
in docs/en/guides and docs/ko/guides.

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP, HAIRLINE, STROKE, canvas, card, card_h,
                    centered_baseline, edge_label, pill, pill_h, save, zone,
                    CHIP_RISE, PAD, SANS)

LANGS = ("en", "ko")

LABELS = {
    "guides-react-hooks-reference-optimistic-update": {
        "en": {
            "actors": ("Component", "useUpdate hook", "Query cache", "Server"),
            "opt": "optimistic: true",
            "mutate": "mutate({ id, dto })",
            "cancel": "cancelQueries(keys.all)",
            "snap": "snapshot of keys.lists()",
            "merge": "merge dto into the matching item",
            "request": "update request",
            "ok": "success",
            "ok_reply": "updated entity",
            "err": "error",
            "err_reply": "rejected",
            "restore": "restore snapshot",
            "settled": "settled: invalidate keys.all",
        },
        "ko": {
            "actors": ("컴포넌트", "useUpdate 훅", "쿼리 캐시", "서버"),
            "opt": "optimistic: true",
            "mutate": "mutate({ id, dto })",
            "cancel": "cancelQueries(keys.all)",
            "snap": "keys.lists() 스냅샷",
            "merge": "일치하는 항목에 dto 병합",
            "request": "수정 요청",
            "ok": "성공",
            "ok_reply": "수정된 엔티티",
            "err": "오류",
            "err_reply": "거부",
            "restore": "스냅샷 복원",
            "settled": "완료: keys.all 무효화",
        },
    },
    "guides-form-hooks-dirty-fields": {
        "en": {
            "server": "Server",
            "useget": "useGet(entityId)",
            "loaded": "Loaded entity",
            "form": "Form values",
            "rows": (('title: "Old"', 'title: "New"'),
                     ('status: "open"', 'status: "open"'),
                     ("priority: 1", "priority: 3")),
            "extract": "extractDirtyFields",
            "request": ("Update request", ["id: entityId", "dto: { title, priority }"]),
            "refetch": "refetch → form.reset(entity)",
            "send": "mutateAsync({ id, dto })",
        },
        "ko": {
            "server": "서버",
            "useget": "useGet(entityId)",
            "loaded": "불러온 엔티티",
            "form": "폼 값",
            "rows": (('title: "Old"', 'title: "New"'),
                     ('status: "open"', 'status: "open"'),
                     ("priority: 1", "priority: 3")),
            "extract": "extractDirtyFields",
            "request": ("수정 요청", ["id: entityId", "dto: { title, priority }"]),
            "refetch": "다시 조회 → form.reset(entity)",
            "send": "mutateAsync({ id, dto })",
        },
    },
}


def arrow(c, x1, y1, x2, y2, color=None):
    col = color or c.t["fg_dim"]
    c.line(x1, y1, x2, y2, color=col, sw=STROKE, marker=col)


def route(c, d):
    fg = c.t["fg_dim"]
    c.path(d, color=fg, sw=STROKE, marker=fg)


def fig_optimistic_update(lang):
    """Cancel, snapshot, write, request; error restores; both end in invalidation."""
    fid = "guides-react-hooks-reference-optimistic-update"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    lane = 288
    xs = [24 + lane / 2 + k * lane for k in range(4)]
    head_w = 240
    y0 = 40
    hh = pill_h(BODY)
    accents = (c.t["fg_dim"], c.blue, c.green, c.orange)
    for x, name, a in zip(xs, t["actors"], accents):
        pill(c, x - head_w / 2, y0, head_w, hh, name, a, rx=8)
    c.text(xs[1] + 10, y0 + hh + 24, t["opt"], size=BODY, color=c.blue,
           family=SANS, weight=600)
    step = 54
    y = y0 + hh + 30
    msgs = []

    def msg(a, b, label, color=None):
        nonlocal y
        y += step
        msgs.append((a, b, label, y, color))
        return y

    msg(0, 1, t["mutate"])
    msg(1, 2, t["cancel"])
    msg(1, 2, t["snap"])
    msg(1, 2, t["merge"])
    msg(1, 3, t["request"])
    y += 22
    ok_top = y
    msg(3, 1, t["ok_reply"], c.green)
    ok_bottom = y + 18
    y = ok_bottom + 22
    err_top = y
    msg(3, 1, t["err_reply"], c.red)
    msg(1, 2, t["restore"], c.red)
    err_bottom = y + 18
    y = err_bottom + 4
    msg(1, 2, t["settled"])
    end = y + 24

    # branch bands sit under the lifelines and the messages
    for top, bottom, label, a in ((ok_top, ok_bottom, t["ok"], c.green),
                                  (err_top, err_bottom, t["err"], c.red)):
        c.rrect(24, top, 1152, bottom - top, rx=8, fill=a, stroke=None,
                opacity=0.08)
        c.text(40, centered_baseline(top, bottom - top, BODY), label,
               size=BODY, color=a, family=SANS, weight=700)
    for x in xs:
        c.line(x, y0 + hh, x, end, color=c.t["line"], sw=HAIRLINE, marker=None)
    for a, b, label, my, color in msgs:
        arrow(c, xs[a], my, xs[b], my, color)
        edge_label(c, (xs[a] + xs[b]) / 2, my - 18, label, color or c.t["fg"],
                   size=BODY)
    save(c, f"{fid}.{lang}")


def fig_form_dirty_fields(lang):
    """Only the fields that differ from the loaded entity reach the update request."""
    fid = "guides-form-hooks-dirty-fields"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    fg = c.t["fg_dim"]
    ws, xs = (90, 200, 200, 300), []
    gaps = (160, 40, 0)
    x = 24
    for k, w in enumerate(ws):
        xs.append(x)
        x += w + (gaps[k] if k < 3 else 0)
    xs[3] = 1176 - ws[3]
    ph = pill_h(BODY)
    rgap = 10
    ztop = 40 + 64
    rows_top = ztop + CHIP_RISE + PAD
    ys = [rows_top + k * (ph + rgap) for k in range(3)]
    rows_bottom = ys[-1] + ph
    zbottom = rows_bottom + PAD

    zone(c, xs[1], ztop, ws[1], zbottom - ztop, c.blue, t["loaded"])
    zone(c, xs[2], ztop, ws[2], zbottom - ztop, c.orange, t["form"])
    for k, ((old, new), y) in enumerate(zip(t["rows"], ys)):
        pill(c, xs[1] + PAD, y, ws[1] - 2 * PAD, ph, old, c.blue, rx=8,
             weight=400)
        dirty = old != new
        pill(c, xs[2] + PAD, y, ws[2] - 2 * PAD, ph, new,
             c.orange if dirty else c.t["line"], rx=8,
             weight=700 if dirty else 400,
             sw=STROKE if dirty else HAIRLINE)
    server = card(c, xs[0], ztop, ws[0], c.t["fg_dim"], None, [t["server"]],
                  h=zbottom - ztop, valign="middle", align="middle")
    # server -> loaded entity
    my = (ztop + zbottom) / 2
    arrow(c, xs[0] + ws[0], my, xs[1], my)
    edge_label(c, xs[0] + ws[0] + gaps[0] / 2, my - 18, t["useget"], fg,
               pill=False)
    # dirty rows -> update request
    title, lines = t["request"]
    rh = card_h(ws[3], title, lines)
    ry = (ys[0] + ys[2] + ph) / 2 - rh / 2
    card(c, xs[3], ry, ws[3], c.orange, title, lines, h=rh)
    rx = xs[2] + ws[2]
    for k in (0, 2):
        yy = ys[k] + ph / 2
        route(c, f"M{xs[2] + ws[2] - PAD},{yy} H{(rx + xs[3]) / 2} "
                 f"V{ry + rh / 2 + (k - 1) * 12} H{xs[3]}")
    edge_label(c, (rx + xs[3]) / 2, ys[2] + ph + 20, t["extract"], c.orange,
               pill=False)
    # request -> server, under everything
    yb = zbottom + 44
    route(c, f"M{xs[3] + ws[3] / 2},{ry + rh} V{yb} H{xs[0] + ws[0] / 2} "
             f"V{zbottom}")
    edge_label(c, (xs[2] + xs[3]) / 2, yb, t["send"], fg)
    # refetch: a changed entity resets the form
    yt = 64
    a = xs[1] + ws[1] - 18
    b = xs[2] + ws[2] - 24
    route(c, f"M{a},{ztop} V{yt} H{b} V{ztop}")
    edge_label(c, (a + b) / 2, yt - 20, t["refetch"], c.blue, pill=False)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_optimistic_update(_lang)
    fig_form_dirty_fields(_lang)
