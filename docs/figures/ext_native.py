"""Figures for the native extension READMEs (extensions/native/**/README.md).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP_RISE, DASH_OUTSIDE, HAIRLINE, PAD, SANS,
                    STROKE, THICK, canvas, figure, card, card_h, cards_row, edge_label,
                    pill, save, zone)

LANGS = ("en", "ko")

LABELS = {
    "pkg-native-readme-layers": {
        "en": {
            "device": "Device-layer packages",
            "device_items": ["capture", "signature", "qr", "kiosk"],
            "native": "Native extension",
            "ui": ("ui", ["mobile UI kit"]),
            "runtime": ("runtime", ["Expo runtime"]),
            "web": ("DOM-dependent web packages (not imported)",
                    ["@simplix-react/ui", "@simplix-react/calendar"]),
            "core": "Platform-neutral core",
            "headless": ("headless", []),
            "i18n": ("i18n", []),
            "api": ("api", []),
            "auth": ("auth", []),
            "boot": ("simplix-boot-auth", ["Boot extension",
                                           "unwrapEnvelope only"]),
        },
        "ko": {
            "device": "기기 계층 패키지",
            "device_items": ["capture", "signature", "qr", "kiosk"],
            "native": "네이티브 확장",
            "ui": ("ui", ["모바일 UI 키트"]),
            "runtime": ("runtime", ["Expo 런타임"]),
            "web": ("DOM 의존 웹 패키지(가져오지 않음)",
                    ["@simplix-react/ui", "@simplix-react/calendar"]),
            "core": "플랫폼 중립 핵심 패키지",
            "headless": ("headless", []),
            "i18n": ("i18n", []),
            "api": ("api", []),
            "auth": ("auth", []),
            "boot": ("simplix-boot-auth", ["Boot 확장",
                                           "unwrapEnvelope만"]),
        },
    },
    "pkg-native-runtime-error-routing": {
        "en": {
            "mut": "Mutation error",
            "qry": "Query error",
            "form": "meta.handledByForm?",
            "classify": "classifyError",
            "network": "category = network?",
            "validation": "category = validation?",
            "hook": "onErrorEvent returns false?",
            "dispatch": ("dispatchError", ["→ ErrorDialogHost"]),
            "end_form": "Form handles it",
            "end_inline": "Inline error state",
            "end_none": "Suppressed",
            "yes": "yes",
            "no": "no",
        },
        "ko": {
            "mut": "뮤테이션 오류",
            "qry": "쿼리 오류",
            "form": "meta.handledByForm?",
            "classify": "classifyError",
            "network": "category = network?",
            "validation": "category = validation?",
            "hook": "onErrorEvent가 false 반환?",
            "dispatch": ("dispatchError", ["→ ErrorDialogHost"]),
            "end_form": "폼에서 처리",
            "end_inline": "인라인 오류 상태",
            "end_none": "표시하지 않음",
            "yes": "예",
            "no": "아니요",
        },
    },
    "pkg-native-capture-phases": {
        "en": {
            "pass": ["passing", "report"],
            "sustain": ["passing report", "after sustainMs"],
            "ends": ["countdown", "ends"],
            "resolves": ["takePhoto", "resolves"],
            "fail": "failing report",
            "photo_fail": "takePhoto fails",
            "retake": "retake()",
            "enter": "enterManualMode()",
            "now": "captureNow()",
            "notes": ["enterManualMode() from searching, holding, countdown",
                      "captureNow() from searching, holding, countdown, manual"],
        },
        "ko": {
            "pass": ["조건 충족", "보고"],
            "sustain": ["sustainMs 경과 후", "조건 충족 보고"],
            "ends": ["카운트다운 종료"],
            "resolves": ["촬영", "성공"],
            "fail": "조건 미충족 보고",
            "photo_fail": "촬영 실패",
            "retake": "retake()",
            "enter": "enterManualMode()",
            "now": "captureNow()",
            "notes": ["searching · holding · countdown에서 enterManualMode()",
                      "searching · holding · countdown · manual에서 captureNow()"],
        },
    },
    "pkg-native-ui-entity-feed": {
        "en": {
            "list": ("EntityList", ["search bar, filter sheet, scroll end"]),
            "feed": "useEntityFeed",
            "debounce": ("debounce 300 ms", ["search text"]),
            "params": ("buildSearchableParams", ["filters, sort, page"]),
            "hook": ("Orval list hook", ["one page per call"]),
            "items": ("Accumulated items", ["page 1 replaces, later pages append"]),
            "input": "setSearch / filters.setValue",
            "more": "loadMore → page + 1",
            "reset": "condition change → page 1",
            "rows": "rendered rows",
        },
        "ko": {
            "list": ("EntityList", ["검색창, 필터 시트, 스크롤 끝"]),
            "feed": "useEntityFeed",
            "debounce": ("300ms 지연", ["검색어"]),
            "params": ("buildSearchableParams", ["필터, 정렬, 페이지"]),
            "hook": ("Orval 목록 훅", ["호출마다 한 페이지"]),
            "items": ("누적된 항목", ["첫 페이지는 교체, 다음 페이지는 추가"]),
            "input": "setSearch / filters.setValue",
            "more": "loadMore → 다음 페이지",
            "reset": "조건 변경 → 첫 페이지",
            "rows": "렌더링한 행",
        },
    },
}


def fig_readme_layers(lang):
    """Native packages sit on the platform-neutral core; web packages stay out."""
    fid = "pkg-native-readme-layers"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    left, right = 24, 1176
    fg = c.t["fg_dim"]
    blue, green, purple, orange = (c.t["blue"], c.t["green"], c.t["purple"],
                                   c.t["orange"])
    zp = 18
    cg = 20
    split = 600
    lw = split - left - 12           # left column: device, ui, headless, i18n
    rx0 = split + 12
    rw = right - rx0                 # right column: web, runtime, api, auth, boot
    top = 20

    # row 1: device-layer zone (left) and the excluded web packages (right)
    dy = top + CHIP_RISE + PAD
    n = len(t["device_items"])
    pg = 14
    pw = (lw - 2 * zp - (n - 1) * pg) / n
    ph = 44
    hw = card_h(rw, *t["web"])
    row1_h = max(dy + ph + zp - top, hw)
    zone(c, left, top, lw, row1_h, orange, t["device"],
         tag="@simplix-react-native-ext/")
    py = top + row1_h - zp - ph
    for i, s in enumerate(t["device_items"]):
        pill(c, left + zp + i * (pw + pg), py, pw, ph, s, orange, rx=8)
    card(c, rx0, top, rw, fg, *t["web"], h=row1_h, dash=DASH_OUTSIDE)
    dev_bot = top + row1_h

    # row 2: native extension zone holding ui (left) and runtime (right)
    ntop = dev_bot + 60
    ny = ntop + CHIP_RISE + PAD
    uw = lw - zp
    rww = rw - zp
    hn = max(card_h(uw, *t["ui"]), card_h(rww, *t["runtime"]))
    zone(c, left, ntop, right - left, ny + hn + zp - ntop, purple, t["native"],
         tag="@simplix-react-native/")
    bu = card(c, left + zp, ny, uw, purple, *t["ui"], h=hn, sw=STROKE)
    br = card(c, rx0, ny, rww, purple, *t["runtime"], h=hn, sw=STROKE)
    nbot = ny + hn + zp

    # row 3: core zone (headless, i18n | api, auth) and the boot box
    ctop = nbot + 60
    cy = ctop + CHIP_RISE + PAD
    cw_l = (uw - cg) / 2
    bw = 290
    cw_r = (rww - bw - cg - zp - 24) / 2
    keys = (("headless", cw_l), ("i18n", cw_l), ("api", cw_r), ("auth", cw_r))
    hc = max(card_h(w, *t[k]) for k, w in keys)
    hb = card_h(bw, *t["boot"])
    zbot = cy + hc + zp
    core_w = right - left - bw - zp - 24
    zone(c, left, ctop, core_w, zbot - ctop, green, t["core"])
    bh = card(c, left + zp, cy, cw_l, green, *t["headless"], h=hc)
    bi = card(c, left + zp + cw_l + cg, cy, cw_l, green, *t["i18n"], h=hc)
    ba = card(c, rx0, cy, cw_r, green, *t["api"], h=hc)
    bt = card(c, rx0 + cw_r + cg, cy, cw_r, green, *t["auth"], h=hc)
    bb = card(c, left + zp + uw + 24 + rww - bw, ctop, bw, blue, *t["boot"],
              h=max(hb, zbot - ctop), valign="middle")

    # edges: device -> ui, ui -> headless and i18n, runtime -> ui, api, auth, boot
    dx = left + lw * 0.75
    c.line(dx, dev_bot, dx, ny, color=orange, sw=STROKE, marker=orange)
    for (x, y, w, h), f in zip((bh, bi, ba, bt, bb), (0.9, 0.5, 0.5, 0.5, 0.75)):
        cx = x + w * f
        c.line(cx, ny + hn, cx, y, color=purple, sw=STROKE, marker=purple)
    ry = ny + hn / 2
    c.line(br[0], ry, bu[0] + bu[2], ry, color=purple, sw=STROKE, marker=purple)
    save(c, f"{fid}.{lang}")


@figure(plain=True)
def fig_runtime_error_routing(lang):
    """Each cache checks its own exits first; both end at the global dialog."""
    fid = "pkg-native-runtime-error-routing"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    left, right = 24, 1176
    fg = c.t["fg_dim"]
    blue, green, orange, red = c.t["blue"], c.t["green"], c.t["orange"], c.t["red"]
    gap = 28
    zp = 18
    dw = 200
    lane_w = right - left - dw - gap
    w0 = 236
    w = (lane_w - 2 * zp - 3 * gap - w0) / 3
    ws = [w0, w, w, w]
    xs = [left + zp + sum(ws[:i]) + i * gap for i in range(4)]
    eh = 44
    top = 20
    lane_m = ["form", "classify", "validation", "hook"]
    lane_q = ["classify", "network", "validation", "hook"]
    dec = {"form", "network", "validation", "hook"}

    def row_h(keys):
        return max(card_h(ws[i], None, [t[k]], align="middle")
                   for i, k in enumerate(keys))

    hm = row_h(lane_m)
    hq = row_h(lane_q)
    vgap = 70
    zm = top + eh + vgap
    ym = zm + CHIP_RISE + PAD
    zm_bot = ym + hm + zp
    zq = zm_bot + 30
    yq = zq + CHIP_RISE + PAD
    zq_bot = yq + hq + zp
    ends_q = zq_bot + vgap
    zone(c, left, zm, lane_w, zm_bot - zm, blue, t["mut"])
    zone(c, left, zq, lane_w, zq_bot - zq, blue, t["qry"])

    def lane(keys, y, h):
        boxes = []
        for i, k in enumerate(keys):
            b = card(c, xs[i], y, ws[i], blue, None, [t[k]], h=h, align="middle",
                     valign="middle", sw=STROKE if k in dec else HAIRLINE,
                     rx=22 if k in dec else 10)
            boxes.append(b)
        for i in range(len(boxes) - 1):
            x, yy, bw_, bh_ = boxes[i]
            c.line(x + bw_, yy + bh_ / 2, boxes[i + 1][0], yy + bh_ / 2,
                   color=fg, sw=STROKE, marker=fg)
        return boxes

    bm = lane(lane_m, ym, hm)
    bq = lane(lane_q, yq, hq)

    # the shared exit: dispatchError -> ErrorDialogHost
    dx = right - dw
    bd = card(c, dx, ym, dw, red, *t["dispatch"], h=yq + hq - ym,
              valign="middle", sw=THICK)
    for b in (bm[-1], bq[-1]):
        yy = b[1] + b[3] / 2
        c.line(b[0] + b[2], yy, dx, yy, color=red, sw=THICK, marker=red)

    # branch ends: yes leads out of the lane
    def end(b, key, up, col):
        cx = b[0] + b[2] * (0.92 if b[0] < left + 100 else 0.7)
        if up:
            ey = top
            pill(c, b[0], ey, b[2], eh, t[key], col, rx=8)
            c.line(cx, b[1], cx, ey + eh, color=col, sw=STROKE, marker=col)
            edge_label(c, cx, (zm + ey + eh) / 2, t["yes"], col)
        else:
            ey = ends_q
            pill(c, b[0], ey, b[2], eh, t[key], col, rx=8)
            c.line(cx, b[1] + b[3], cx, ey, color=col, sw=STROKE, marker=col)
            edge_label(c, cx, (zq_bot + ey) / 2, t["yes"], col)

    end(bm[0], "end_form", True, green)
    end(bm[2], "end_form", True, green)
    end(bm[3], "end_none", True, fg)
    end(bq[1], "end_inline", False, orange)
    end(bq[2], "end_form", False, green)
    end(bq[3], "end_none", False, fg)
    save(c, f"{fid}.{lang}")


def fig_capture_phases(lang):
    """The session advances on passing reports and falls back on failing ones."""
    fid = "pkg-native-capture-phases"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    left, right = 24, 1176
    blue, green, orange, red, purple = (c.t["blue"], c.t["green"], c.t["orange"],
                                        c.t["red"], c.t["purple"])
    names = ["searching", "holding", "countdown", "capturing", "captured"]
    w = 150
    gap = (right - left - 5 * w) / 4
    xs = [left + i * (w + gap) for i in range(5)]
    sh = 52
    step = 26
    # manual on top, its bus under it, then the forward labels, then the row
    top = 20
    mx0 = xs[1] + w + gap / 2 - w / 2
    pill(c, mx0, top, w, sh, "manual", purple, rx=26, sw=STROKE)
    bus = top + sh + 40
    lab_top = bus + 30
    row = lab_top + 2 * step + 20
    cyv = row + sh / 2
    for i, s in enumerate(names):
        pill(c, xs[i], row, w, sh, s, green if s == "captured" else blue,
             rx=26, sw=STROKE)
    # forward transitions with their events stacked above the arrow
    for i, key in enumerate(("pass", "sustain", "ends", "resolves")):
        x1, x2 = xs[i] + w, xs[i + 1]
        c.line(x1, cyv, x2, cyv, color=green, sw=THICK, marker=green)
        for k, s in enumerate(t[key]):
            c.text((x1 + x2) / 2, lab_top + 18 + k * step, s, size=BODY,
                   color=green, family=SANS, weight=600, anchor="middle")
    # enterManualMode: the three states up to the bus, the bus up to manual
    mc = mx0 + w / 2
    for i in range(3):
        cx = xs[i] + w / 2
        c.line(cx, row, cx, bus, color=purple, sw=STROKE, marker=None)
    c.line(xs[0] + w / 2, bus, xs[2] + w / 2, bus, color=purple, sw=STROKE,
           marker=None)
    c.line(mc, bus, mc, top + sh, color=purple, sw=STROKE, marker=purple)
    edge_label(c, xs[0] + w / 2 + 110, bus, t["enter"], purple, size=BODY)
    # captureNow: manual across to capturing
    cc = xs[3] + w / 2
    c.path(f"M{mx0 + w},{top + sh / 2} H{cc} V{row}", color=orange,
           sw=STROKE, marker=orange)
    edge_label(c, cc, bus, t["now"], orange, size=BODY)

    # back edges below the row, nested by span
    rb = row + sh
    levels = ((1, "fail", red), (2, "fail", red), (3, "photo_fail", red),
              (4, "retake", blue))
    for lv, (i, key, col) in enumerate(levels):
        yy = rb + 34 + lv * 40
        xa = xs[i] + w / 2
        xb = xs[0] + w * (0.2 + 0.2 * lv)
        c.path(f"M{xa},{rb} V{yy} H{xb} V{rb}", color=col, sw=STROKE,
               marker=col)
        edge_label(c, (xa + xb) / 2 + 40, yy, t[key], col, size=BODY)
    ny = rb + 34 + 3 * 40 + 40
    for k, s in enumerate(t["notes"]):
        c.text(left, ny + k * step, s, size=BODY,
               color=purple if k == 0 else orange, family=SANS, weight=600)
    save(c, f"{fid}.{lang}")


@figure(plain=True)
def fig_entity_feed(lang):
    """Input becomes list parameters; pages come back and accumulate into rows."""
    fid = "pkg-native-ui-entity-feed"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    left, right = 24, 1176
    fg = c.t["fg_dim"]
    blue, green, purple, orange = (c.t["blue"], c.t["green"], c.t["purple"],
                                   c.t["orange"])
    top = 20
    zp = 18
    hw = 260
    hgap = 70
    zw = right - left - hw - hgap
    iy = top + CHIP_RISE + PAD
    ig = 40
    iw1 = 240
    iw2 = zw - 2 * zp - ig - iw1
    hi = max(card_h(iw1, *t["debounce"]), card_h(iw2, *t["params"]))
    zbot = iy + hi + zp
    zone(c, left, top, zw, zbot - top, purple, t["feed"])
    bd = card(c, left + zp, iy, iw1, purple, *t["debounce"], h=hi)
    bp = card(c, left + zp + iw1 + ig, iy, iw2, purple, *t["params"], h=hi,
              sw=STROKE)
    c.line(bd[0] + iw1, iy + hi / 2, bp[0], iy + hi / 2, color=fg, sw=STROKE,
           marker=fg)
    hh = card_h(hw, *t["hook"])
    bh = card(c, right - hw, iy, hw, green, *t["hook"], h=hh, sw=STROKE)
    c.line(bp[0] + iw2, iy + hi / 2, right - hw, iy + hi / 2, color=fg,
           sw=STROKE, marker=fg)

    # bottom row: EntityList and the accumulated items
    vgap = 120
    by = zbot + vgap
    lw = 440
    bgap = 150
    hl = max(card_h(lw, *t["list"]), card_h(right - left - lw - bgap, *t["items"]))
    bl = card(c, left, by, lw, blue, *t["list"], h=hl)
    ix = left + lw + bgap
    bi = card(c, ix, by, right - ix, green, *t["items"], h=hl)
    # hook pages down to the items, items back to the list
    hx = right - hw / 2
    c.line(hx, iy + hh, hx, by, color=green, sw=THICK, marker=green)
    ry = by + hl / 2
    c.line(ix, ry, left + lw, ry, color=green, sw=THICK, marker=green)
    c.text(left + lw + bgap / 2, ry - 12, t["rows"], size=BODY, color=green,
           family=SANS, weight=600, anchor="middle")
    # input and loadMore up into the feed
    x1 = left + 40
    c.line(x1, by, x1, zbot, color=blue, sw=STROKE, marker=blue)
    c.text(x1 + 14, zbot + 32, t["input"], size=BODY, color=blue,
           family=SANS, weight=600)
    c.text(x1 + 14, zbot + 32 + 26, t["reset"], size=BODY, color=purple,
           family=SANS, weight=600)
    x2 = left + lw - 30
    c.line(x2, by, x2, zbot, color=orange, sw=STROKE, marker=orange)
    c.text(x2 + 14, zbot + 32, t["more"], size=BODY, color=orange,
           family=SANS, weight=600)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_readme_layers(_lang)
    fig_runtime_error_routing(_lang)
    fig_capture_phases(_lang)
    fig_entity_feed(_lang)
