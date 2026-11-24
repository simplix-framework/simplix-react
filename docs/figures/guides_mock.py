"""Figures for the mock handlers guide (docs/en/guides/mock-handlers.md and
docs/ko/guides/mock-handlers.md).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, STROKE, canvas, card, card_h, edge_label, pill,
                    pill_h, save, zone, CHIP_RISE, PAD)

LANGS = ("en", "ko")
ROLES = ("list", "get", "create", "update", "delete", "tree", "custom")

LABELS = {
    "guides-mock-handlers-request-flow": {
        "en": {
            "request": ("Request", ["basePath + operation.path"]),
            "handlers": "Derived handler per operation · role",
            "store": ("In-memory store", ['"project_task"', "{domain}_{entity}",
                                         "entity in snake_case"]),
            "rw": "read · write",
            "wrap": "Response wrapping",
            "w1": ("Wired output", ["output.wrap"]),
            "w2": ("responseWrapper", ["success(data)"]),
            "w3": ("Default", ["{ data }"]),
            "else": "else",
            "response": ("Response", ["200 · 201 success", "404 not_found",
                                      "409 unique_violation",
                                      "422 foreign_key_violation",
                                      "500 other errors"]),
        },
        "ko": {
            "request": ("요청", ["basePath + operation.path"]),
            "handlers": "오퍼레이션별 파생 핸들러 · 역할",
            "store": ("인메모리 저장소", ['"project_task"', "{domain}_{entity}",
                                       "엔티티 이름은 snake_case"]),
            "rw": "읽기 · 쓰기",
            "wrap": "응답 감싸기",
            "w1": ("연결된 output", ["output.wrap"]),
            "w2": ("responseWrapper", ["success(data)"]),
            "w3": ("기본값", ["{ data }"]),
            "else": "없으면",
            "response": ("응답", ["200 · 201 성공", "404 not_found",
                                 "409 unique_violation",
                                 "422 foreign_key_violation",
                                 "500 그 밖의 오류"]),
        },
    },
}


def arrow(c, x1, y1, x2, y2):
    fg = c.t["fg_dim"]
    c.line(x1, y1, x2, y2, color=fg, sw=STROKE, marker=fg)


def fig_request_flow(lang):
    """Request -> handler by role <-> store; result wrapped in a fixed order -> response."""
    fid = "guides-mock-handlers-request-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    fg = c.t["fg_dim"]
    # row 1: request, the handlers by role, the store
    y1 = 40 + CHIP_RISE
    xr, wr = 24, 230
    xz, wz = 300, 446
    xs_, ws_ = 846, 330
    ph = pill_h(BODY)
    top = y1 + CHIP_RISE + PAD
    per_row = 4
    pw = (wz - 2 * PAD - (per_row - 1) * 12) / per_row
    rows = [ROLES[:per_row], ROLES[per_row:]]
    zh = (top - y1) + len(rows) * ph + (len(rows) - 1) * 12 + PAD
    zone(c, xz, y1, wz, zh, c.blue, t["handlers"])
    for r, names in enumerate(rows):
        for k, name in enumerate(names):
            pill(c, xz + PAD + k * (pw + 12), top + r * (ph + 12), pw, ph, name,
                 c.purple if name == "custom" else c.blue, rx=8, weight=400)
    title, lines = t["request"]
    rh = card_h(wr, title, lines)
    mid = y1 + zh / 2
    card(c, xr, mid - rh / 2, wr, fg, title, lines, h=rh)
    arrow(c, xr + wr, mid, xz, mid)
    title, lines = t["store"]
    sh = card_h(ws_, title, lines)
    card(c, xs_, mid - sh / 2, ws_, c.green, title, lines, h=sh)
    arrow(c, xz + wz, mid - 12, xs_, mid - 12)
    arrow(c, xs_, mid + 12, xz + wz, mid + 12)
    edge_label(c, (xz + wz + xs_) / 2, mid - 34, t["rw"], fg, pill=False)

    # row 2: the wrapping order, then the response
    y2 = y1 + zh + 64
    ww = xz + wz - 24
    cw = (ww - 2 * PAD - 2 * 44) / 3
    keys = ("w1", "w2", "w3")
    ch = max(card_h(cw, *t[k]) for k in keys)
    ctop = y2 + CHIP_RISE + PAD
    wh = (ctop - y2) + ch + PAD
    zone(c, 24, y2, ww, wh, c.orange, t["wrap"])
    cx = [24 + PAD + k * (cw + 44) for k in range(3)]
    for k, x in zip(keys, cx):
        title, lines = t[k]
        card(c, x, ctop, cw, c.orange, title, lines, h=ch)
    cy = ctop + ch / 2
    for k in range(2):
        arrow(c, cx[k] + cw, cy, cx[k + 1], cy)
        edge_label(c, cx[k] + cw + 22, cy - 20, t["else"], fg, pill=False)
    arrow(c, xz + wz / 2, y1 + zh, xz + wz / 2, y2)
    title, lines = t["response"]
    oh = card_h(ws_, title, lines)
    oy = y2 + wh / 2 - oh / 2
    card(c, xs_, oy, ws_, c.t["fg_dim"], title, lines, h=oh)
    arrow(c, 24 + ww, y2 + wh / 2, xs_, y2 + wh / 2)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_request_flow(_lang)
