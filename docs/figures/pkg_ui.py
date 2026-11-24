"""Figures for the ui and calendar package READMEs.

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, STROKE, THICK, SANS, canvas, card, card_h,
                    cards_row, save, zone, CHIP_RISE, PAD, DASH_OUTSIDE,
                    PAD_Y, TITLE_GAP, CARD, badges, badges_h,
                    badge_rows, BADGE_GAP)

LANGS = ("en", "ko")

LABELS = {
    "pkg-ui-addressed-filters": {
        "en": {
            "address": ("Address", ["?filters[status.in]=FAILED",
                                    "CrudSearch.filters"]),
            "nav": ("useCrudNavigation", ["nav.filters", "nav.setFilters"]),
            "list": ("useCrudList", ["addressedFilters",
                                     "tab-forced filter left out"]),
            "badges": ("Filter badges", ["CrudList.FilterBar",
                                         "reader commits a filter"]),
            "request": ("Server request", ["filter parameters",
                                           "filtersToRequestParams"]),
            "outside": ("Outside change", ["followed link", "Back"]),
            "onchange": "onChange",
            "write": ["setFilters →", "onNavigate(search, { replace: true })"],
            "adopt": ["list adopts the address", "returns to page 1"],
        },
        "ko": {
            "address": ("주소", ["?filters[status.in]=FAILED",
                                "CrudSearch.filters"]),
            "nav": ("useCrudNavigation", ["nav.filters", "nav.setFilters"]),
            "list": ("useCrudList", ["addressedFilters",
                                     "탭이 고정한 필터 제외"]),
            "badges": ("필터 배지", ["CrudList.FilterBar",
                                    "사용자가 필터 확정"]),
            "request": ("서버 요청", ["필터 매개변수",
                                     "filtersToRequestParams"]),
            "outside": ("외부 변경", ["링크 이동", "뒤로 가기"]),
            "onchange": "onChange",
            "write": ["setFilters →", "onNavigate(search, { replace: true })"],
            "adopt": ["목록이 주소를 받아들임", "1페이지로 복귀"],
        },
    },
    "pkg-calendar-composition": {
        "en": {
            "app": "Application",
            "records": ("App records", ["events, shifts, bookings"]),
            "convert": ["converted", "by the app"],
            "items": ("CalendarItem[]", ["items", "resources"]),
            "provider": "CalendarProvider",
            "store": ("Store", ["view · date · resource filter"]),
            "shell": "CalendarShell",
            "header": ("CalendarHeader", ["view switch · date navigation"]),
            "body": ("CalendarBody", ["renders the active view"]),
            "view": "Active view",
            "views": ["month", "week", "day", "year", "agenda",
                      "resource-timeline", "heatmap-month", "gantt-day",
                      "gantt-week"],
            "callbacks": ("Interaction callbacks", ["onItemClick", "onItemMove",
                                        "onItemResize", "onCellClick",
                                        "onRangeChange", "onResourceClick"]),
            "events": "interactions",
        },
        "ko": {
            "app": "애플리케이션",
            "records": ("앱 레코드", ["일정 · 근무 · 예약"]),
            "convert": ["앱에서 변환"],
            "items": ("CalendarItem[]", ["항목", "리소스"]),
            "provider": "CalendarProvider",
            "store": ("스토어", ["보기 · 날짜 · 리소스 필터"]),
            "shell": "CalendarShell",
            "header": ("CalendarHeader", ["보기 전환 · 날짜 이동"]),
            "body": ("CalendarBody", ["현재 보기 렌더링"]),
            "view": "현재 보기",
            "views": ["month", "week", "day", "year", "agenda",
                      "resource-timeline", "heatmap-month", "gantt-day",
                      "gantt-week"],
            "callbacks": ("상호작용 콜백", ["onItemClick", "onItemMove",
                                  "onItemResize", "onCellClick",
                                  "onRangeChange", "onResourceClick"]),
            "events": "상호작용",
        },
    },
}


def lines_at(c, x, y, lines, color, anchor="start"):
    """A short stack of connector-label lines in open paper beside a route."""
    for k, s in enumerate(lines):
        c.text(x, y + k * 26, s, size=BODY, color=color, family=SANS,
               weight=600, anchor=anchor)


def fig_addressed_filters(lang):
    """The address and the list keep one set of filters, written and adopted both ways."""
    fid = "pkg-ui-addressed-filters"
    t = LABELS[fid][lang]
    c = canvas(1200, 700)
    left, right = 24, 1176
    blue, orange, green, purple = (c.t["blue"], c.t["orange"], c.t["green"],
                                   c.t["purple"])
    fg = c.t["fg_dim"]
    top = 20
    # row 1: the address and what changes it from outside
    wa = 716
    wo = 300
    xo = right - wo
    h1 = max(card_h(wa, *t["address"]), card_h(wo, *t["outside"]))
    ba = card(c, left, top, wa, purple, *t["address"], h=h1, sw=STROKE)
    bo = card(c, xo, top, wo, orange, *t["outside"], h=h1, dash=DASH_OUTSIDE)
    oy = top + h1 / 2
    c.line(xo, oy, left + wa, oy, color=orange, sw=STROKE, marker=orange)

    # row 2: navigation, list, and what the list feeds
    y2 = top + h1 + 150
    wn, wl, wr = 290, 330, 330
    xn = left
    xl = xn + wn + 110
    xr = right - wr
    keys2 = ("nav", "list")
    h2 = max(card_h(wn, *t["nav"]), card_h(wl, *t["list"]))
    bn = card(c, xn, y2, wn, blue, *t["nav"], h=h2)
    bl = card(c, xl, y2, wl, green, *t["list"], h=h2, sw=STROKE)
    hr = max(card_h(wr, *t[k]) for k in ("badges", "request"))
    vg = 24
    yb = y2 + h2 / 2 - hr - vg / 2
    yr = y2 + h2 / 2 + vg / 2
    bb = card(c, xr, yb, wr, blue, *t["badges"], h=hr)
    br = card(c, xr, yr, wr, green, *t["request"], h=hr)

    # list to address: onChange, setFilters, onNavigate with replace
    ly = y2 + h2 * 0.5
    c.line(xl, ly, xn + wn, ly, color=blue, sw=THICK, marker=blue)
    c.text((xl + xn + wn) / 2, ly - 12, t["onchange"], size=BODY, color=blue,
           family=SANS, weight=600, anchor="middle")
    ux = xn + wn * 0.4
    c.line(ux, y2, ux, top + h1, color=blue, sw=THICK, marker=blue)
    lines_at(c, ux + 14, top + h1 + 46, t["write"], blue)
    # address to list: adopt and return to page 1
    dx = xl + wl - 40
    c.line(dx, top + h1, dx, y2, color=orange, sw=THICK, marker=orange)
    lines_at(c, dx + 14, top + h1 + 46, t["adopt"], orange)
    # the reader commits in the filter bar; the list sends the request
    jx = (xl + wl + xr) / 2
    mid = y2 + h2 / 2
    by_ = yb + hr / 2
    c.path(f"M{xr},{by_} H{jx} V{mid - 18} H{xl + wl}", color=blue,
           sw=STROKE, marker=blue)
    ry = yr + hr / 2
    c.path(f"M{xl + wl},{mid + 18} H{jx} V{ry} H{xr}", color=green,
           sw=STROKE, marker=green)
    save(c, f"{fid}.{lang}")


def fig_calendar_composition(lang):
    """Items flow into the provider and its shell; interactions flow back as callbacks."""
    fid = "pkg-calendar-composition"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    left, right = 24, 1176
    blue, green, purple, orange = (c.t["blue"], c.t["green"], c.t["purple"],
                                   c.t["orange"])
    fg = c.t["fg_dim"]
    zp = 18
    az = 20 + CHIP_RISE
    pin = az + CHIP_RISE + PAD

    aw = 300
    px = left + aw + 80
    pw = right - px
    inw = pw - 2 * zp
    hst = card_h(inw, *t["store"])
    # the app column is the taller one; the provider spends the difference
    # on the two gaps a connector already crosses
    iw = aw - 2 * zp
    hrec = card_h(iw, *t["records"])
    hit = card_h(iw, *t["items"])
    hcb = card_h(iw, *t["callbacks"])
    y_rec = pin
    y_it = y_rec + hrec + 64
    need_a = y_it + hit + 40 + hcb + zp - az
    spare = 0.0
    for _pass in range(2):
        sz = pin + hst + 50 + spare
        sin = sz + CHIP_RISE + PAD
        cw = pw - 4 * zp
        hw = (cw - 40) / 2
        hhb = max(card_h(hw, *t["header"]), card_h(hw, *t["body"]))
        vb = sin + hhb + 34 + spare + CARD * 0.78 + 16
        hv = badges_h(t["views"], cw, BODY)
        need_p = vb + hv + zp + zp - az
        spare += max(0.0, need_a - need_p) / 2
    sz = pin + hst + 50 + spare
    sin = sz + CHIP_RISE + PAD
    sxw = inw
    sx = px + zp
    cw = sxw - 2 * zp
    hgap = 40
    hw = (cw - hgap) / 2
    hhb = max(card_h(hw, *t["header"]), card_h(hw, *t["body"]))
    y_v = sin + hhb + 34 + spare
    vt = y_v + CARD * 0.78
    vb = vt + 16
    hv = badges_h(t["views"], cw, BODY)
    shell_h = vb + hv + zp - sz
    need_p = sz + shell_h + zp - az

    zone_h = max(need_p, need_a)
    y_cb = az + zone_h - zp - hcb

    zone(c, left, az, aw, zone_h, blue, t["app"])
    zone(c, px, az, pw, zone_h, green, t["provider"])
    zone(c, sx, sz, sxw, shell_h, blue, t["shell"])

    card(c, left + zp, y_rec, iw, blue, *t["records"], h=hrec)
    card(c, left + zp, y_it, iw, purple, *t["items"], h=hit, sw=STROKE)
    card(c, left + zp, y_cb, iw, orange, *t["callbacks"], h=hcb)
    cx = left + zp + iw / 2
    c.line(cx, y_rec + hrec, cx, y_it, color=fg, sw=STROKE, marker=fg)
    lines_at(c, cx + 12, y_rec + hrec + 30, t["convert"], fg)

    card(c, px + zp, pin, inw, green, *t["store"], h=hst, sw=STROKE)
    bxh = sx + zp
    card(c, bxh, sin, hw, blue, *t["header"], h=hhb)
    card(c, bxh + hw + hgap, sin, hw, blue, *t["body"], h=hhb)
    c.text(bxh, vt, t["view"], size=CARD, color=c.t["fg"], family=SANS,
           weight=700)
    badges(c, bxh, vb, t["views"], cw, blue, BODY)
    c.line(px + zp + inw / 2, pin + hst, px + zp + inw / 2, sz,
           color=green, sw=STROKE, marker=green)

    # items in, interactions out
    iy = y_it + hit / 2
    gx = left + aw + 40
    c.path(f"M{left + zp + iw},{iy} H{gx} V{pin + hst / 2} H{px + zp}",
           color=purple, sw=THICK, marker=purple)
    ey = y_cb + hcb / 2
    vy = vb + hv / 2
    c.path(f"M{sx},{vy} H{gx} V{ey} H{left + zp + iw}", color=orange,
           sw=THICK, marker=orange)
    save(c, f"{fid}.{lang}")

for _lang in LANGS:
    fig_addressed_filters(_lang)
    fig_calendar_composition(_lang)
