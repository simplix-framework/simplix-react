"""Figures for the core package READMEs (contract, react, form, mock, api).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (DASH_OUTSIDE, BODY, HAIRLINE, CONTENT_W, STROKE, THICK, canvas, card, card_h,
                    edge_label, figure, save, tw, SANS)

LANGS = ("en", "ko")

LABELS = {
    "pkg-contract-query-key-hierarchy": {
        "en": {
            "all": ("task.all", ['["project", "task"]']),
            "mid": [("lists()", ['[…, "list"]']),
                    ("details()", ['[…, "detail"]']),
                    ("trees()", ['[…, "tree"]'])],
            "leaf": [("list({...})", ['[…, "list", params]']),
                     ('detail("id")', ['[…, "detail", "id"]']),
                     ("tree({...})", ['[…, "tree", params]'])],
            "broad": "broadest",
            "specific": "most specific",
            "reach": "invalidation reaches",
        },
        "ko": {
            "all": ("task.all", ['["project", "task"]']),
            "mid": [("lists()", ['[…, "list"]']),
                    ("details()", ['[…, "detail"]']),
                    ("trees()", ['[…, "tree"]'])],
            "leaf": [("list({...})", ['[…, "list", params]']),
                     ('detail("id")', ['[…, "detail", "id"]']),
                     ("tree({...})", ['[…, "tree", params]'])],
            "broad": "가장 넓은 키",
            "specific": "가장 구체적인 키",
            "reach": "무효화 범위",
        },
    },
}


@figure(plain=True)
def fig_query_key_hierarchy(lang):
    """A key tree: every key extends the one above it, invalidation runs down."""
    fid = "pkg-contract-query-key-hierarchy"
    t = LABELS[fid][lang]
    c = canvas(1200, 600)
    fg = c.t["fg_dim"]
    x0, rail = 24, 200
    tx = x0 + rail
    tw_ = 1176 - tx
    gap = 34
    cw = (tw_ - 2 * gap) / 3
    xs = [tx + k * (cw + gap) for k in range(3)]
    vgap = 56
    y1 = 24
    rw = cw
    rx = xs[1]
    title, lines = t["all"]
    root = card(c, rx, y1, rw, c.purple, title, lines, sw=STROKE)
    # The gap under the root also holds the label of the reach, clear of the box and of the bus.
    y2 = y1 + root[3] + vgap + 30
    hm = max(card_h(cw, ti, ln) for ti, ln in t["mid"])
    mids = [card(c, x, y2, cw, c.blue, ti, ln, h=hm)
            for x, (ti, ln) in zip(xs, t["mid"])]
    y3 = y2 + hm + vgap
    hl = max(card_h(cw, ti, ln) for ti, ln in t["leaf"])
    leaves = [card(c, x, y3, cw, c.green, ti, ln, h=hl)
              for x, (ti, ln) in zip(xs, t["leaf"])]
    # root fans out to the three prefix keys
    bus = y2 - vgap / 2
    cx = rx + rw / 2
    c.line(cx, root[1] + root[3], cx, bus, color=fg, sw=STROKE, marker=None)
    c.line(mids[0][0] + cw / 2, bus, mids[2][0] + cw / 2, bus, color=fg,
           sw=STROKE, marker=None)
    for (bx_, by, bw, bh) in mids:
        mx = bx_ + bw / 2
        c.line(mx, bus, mx, by, color=fg, sw=STROKE, marker=fg)
    # each prefix key reaches its specific key
    for (mx_, my, mw, mh), (lx, ly, lw, lh) in zip(mids, leaves):
        x = mx_ + mw / 2
        c.line(x, my + mh, x, ly, color=fg, sw=STROKE, marker=fg)
    lw = tw(t["reach"], BODY) + 12
    edge_label(c, cx - 14 - lw / 2, (root[1] + root[3] + bus) / 2, t["reach"],
               c.purple, size=BODY, pill=False)
    # level names on a rail flush to the canvas edge
    c.text(x0, root[1] + root[3] / 2 + BODY * 0.36, t["broad"], size=BODY,
           color=c.purple, weight=700, family=SANS)
    c.text(x0, y3 + hl / 2 + BODY * 0.36, t["specific"], size=BODY,
           color=c.green, weight=700, family=SANS)
    save(c, f"{fid}.{lang}")



LABELS["pkg-react-mutation-invalidation"] = {
    "en": {
        "actors": ["Component", "useCreate · useUpdate · useDelete",
                   "contract client", "Server", "QueryClient"],
        "msgs": ["mutate(dto)", "create · update · delete", "HTTP request",
                 "response", "invalidateQueries(task.all)",
                 "useList · useGet refetch"],
        "trigger": "onSuccess · useUpdate: onSettled",
    },
    "ko": {
        "actors": ["컴포넌트", "useCreate · useUpdate · useDelete",
                   "계약 클라이언트", "서버", "QueryClient"],
        "msgs": ["mutate(dto)", "create · update · delete", "HTTP 요청",
                 "응답", "invalidateQueries(task.all)",
                 "useList · useGet 다시 가져옴"],
        "trigger": "onSuccess · useUpdate는 onSettled",
    },
}


@figure(plain=True)
def fig_mutation_invalidation(lang):
    """Lifelines top to bottom: the mutation, its response, then the
    invalidation that makes the list and detail queries refetch."""
    fid = "pkg-react-mutation-invalidation"
    t = LABELS[fid][lang]
    c = canvas(1200, 800)
    fg = c.t["fg_dim"]
    n = len(t["actors"])
    lane = (1176 - 24) / n
    xs = [24 + lane / 2 + k * lane for k in range(n)]
    hw = lane - 24
    accents = [c.purple, c.blue, c.blue, c.orange, c.green]
    hh = max(card_h(hw, None, [a], align="middle") for a in t["actors"])
    for x, a, acc in zip(xs, t["actors"], accents):
        card(c, x - hw / 2, 24, hw, acc, None, [a], h=hh, align="middle",
             valign="middle")
    top = 24 + hh
    step = 58
    # (from, to, label index, extra gap before)
    msgs = [(0, 1, 0, 0), (1, 2, 1, 0), (2, 3, 2, 0), (3, 1, 3, 0),
            (1, 4, 4, 34), (4, 3, 5, 0)]
    y = top - 6
    ys = []
    for a, b, k, extra in msgs:
        y += step + extra
        ys.append(y)
    bottom = ys[-1] + 30
    for x in xs:
        c.line(x, top, x, bottom, color=c.t["line"], sw=HAIRLINE, marker=None)
    for (a, b, k, extra), y in zip(msgs, ys):
        col = c.green if k >= 4 else fg
        c.line(xs[a], y, xs[b], y, color=col, sw=STROKE, marker=col)
        edge_label(c, (xs[a] + xs[b]) / 2, y - 18, t["msgs"][k], col,
                   size=BODY)
    yi = ys[4]
    edge_label(c, (xs[1] + xs[4]) / 2, yi - 52, t["trigger"], fg, size=BODY)
    save(c, f"{fid}.{lang}")



LABELS["pkg-form-update-flow"] = {
    "en": {
        "get": ("useGet(entityId)", ["loads the entity"]),
        "form": ("form", ["starts from entity"]),
        "edit": ("user edits", ["changes fields", "submits"]),
        "dirty": ("extractDirtyFields", ["(values, entity)", "changed only"]),
        "update": ("useUpdate", ["mutateAsync({ id, dto })"]),
        "server": ("Server", ["validates, saves"]),
        "refetch": ("useGet", ["refetch"]),
        "map": ("mapServerErrorsToForm", ["422 field errors"]),
        "errors": ("field errors", ["on each field"]),
        "reset": "form.reset(entity)",
        "ok": "success",
        "fail": "error",
    },
    "ko": {
        "get": ("useGet(entityId)", ["엔티티 불러오기"]),
        "form": ("form", ["처음 값: 엔티티"]),
        "edit": ("사용자 편집", ["필드 수정", "제출"]),
        "dirty": ("extractDirtyFields", ["(values, entity)", "변경된 필드만"]),
        "update": ("useUpdate", ["mutateAsync({ id, dto })"]),
        "server": ("서버", ["검증 후 저장"]),
        "refetch": ("useGet", ["다시 가져옴"]),
        "map": ("mapServerErrorsToForm", ["422 필드 오류"]),
        "errors": ("필드 오류", ["필드마다 표시"]),
        "reset": "form.reset(entity)",
        "ok": "성공",
        "fail": "오류",
    },
}


def fig_form_update_flow(lang):
    """Load, edit, send only the changed fields; success refetches and resets
    the form, a server error lands back on the fields."""
    fid = "pkg-form-update-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 800)
    fg = c.t["fg_dim"]
    gap = 84
    cw = (1152 - 3 * gap) / 4
    xs = [24 + k * (cw + gap) for k in range(4)]
    vgap = 60
    r1 = ("get", "form", "edit", "dirty")
    h1 = max(card_h(cw, *t[k]) for k in r1)
    h2 = max(card_h(cw, *t[k]) for k in ("refetch", "server", "update"))
    wm = 2 * cw + gap
    h3 = max(card_h(cw, *t["errors"]), card_h(wm, *t["map"]))
    y1 = 24
    y2 = y1 + h1 + vgap
    y3 = y2 + h2 + vgap
    acc = {"get": c.blue, "form": c.purple, "edit": c.purple, "dirty": c.blue,
           "update": c.blue, "server": c.orange, "refetch": c.green,
           "map": c.red, "errors": c.red}
    b = {}
    for x, k in zip(xs, r1):
        b[k] = card(c, x, y1, cw, acc[k], *t[k], h=h1)
    for x, k in zip(xs[1:], ("refetch", "server", "update")):
        b[k] = card(c, x, y2, cw, acc[k], *t[k], h=h2)
    b["errors"] = card(c, xs[1], y3, cw, acc["errors"], *t["errors"], h=h3)
    b["map"] = card(c, xs[2], y3, wm, acc["map"], *t["map"], h=h3)

    def right(a, z):
        ya = a[1] + a[3] / 2
        c.line(a[0] + a[2], ya, z[0], ya, color=fg, sw=STROKE, marker=fg)

    def left(a, z, col=fg):
        ya = a[1] + a[3] / 2
        c.line(a[0], ya, z[0] + z[2], ya, color=col, sw=STROKE, marker=col)

    def down(a, z, col=fg):
        x = a[0] + a[2] / 2
        c.line(x, a[1] + a[3], x, z[1], color=col, sw=STROKE, marker=col)

    def up(a, z, col=fg):
        x = a[0] + a[2] / 2
        c.line(x, a[1], x, z[1] + z[3], color=col, sw=STROKE, marker=col)

    right(b["get"], b["form"])
    right(b["form"], b["edit"])
    right(b["edit"], b["dirty"])
    down(b["dirty"], b["update"])
    left(b["update"], b["server"])
    left(b["server"], b["refetch"], c.green)
    up(b["refetch"], b["form"], c.green)
    xsv = b["server"][0] + cw / 2
    c.line(xsv, y2 + h2, xsv, y3, color=c.red, sw=STROKE, marker=c.red)
    left(b["map"], b["errors"], c.red)
    xr = b["refetch"][0] + cw / 2
    rw_ = tw(t["reset"], 16) + 12
    edge_label(c, xr + 8 + rw_ / 2, (y1 + h1 + y2) / 2, t["reset"], c.green,
               pill=False)
    ys = b["server"][1] + b["server"][3] / 2
    edge_label(c, b["server"][0] - gap / 2, ys - 20, t["ok"], c.green,
               pill=False)
    xm = b["server"][0] + cw / 2
    lw = tw(t["fail"], 16) + 12
    edge_label(c, xm + 8 + lw / 2, (b["server"][1] + b["server"][3] + y3) / 2,
               t["fail"], c.red, pill=False)
    save(c, f"{fid}.{lang}")



LABELS["pkg-mock-request-flow"] = {
    "en": {
        "app": ("Application", ['fetch("/api/tasks")']),
        "worker": ("MSW service worker", ["intercepts the request"]),
        "handlers": ("derived handlers", ["deriveMockHandlers", "matched by method and path"]),
        "store": ("in-memory store", ["Map project_task", "{domain}_{entity}", "read and written by handlers"]),
        "seed": ("seed", ["domain seed records"]),
        "net": ("Network", ["passthrough"]),
        "bypass": "cross-origin · unmatched",
        "boot": "setupMockWorker",
    },
    "ko": {
        "app": ("애플리케이션", ['fetch("/api/tasks")']),
        "worker": ("MSW 서비스 워커", ["요청을 가로챔"]),
        "handlers": ("파생된 핸들러", ["deriveMockHandlers", "메서드 · 경로로 일치"]),
        "store": ("인메모리 저장소", ["Map project_task", "{domain}_{entity}", "핸들러가 읽고 씀"]),
        "seed": ("시드", ["도메인 시드 레코드"]),
        "net": ("네트워크", ["그대로 통과"]),
        "bypass": "다른 출처 · 일치 없음",
        "boot": "setupMockWorker",
    },
}


def fig_mock_request_flow(lang):
    """A request runs app → worker → derived handler → store; seed fills the
    store at startup and anything the worker does not handle goes out."""
    fid = "pkg-mock-request-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 600)
    fg = c.t["fg_dim"]
    gap = 64
    ws = [(1152 - 3 * gap) / 4] * 4
    xs = [24]
    for w in ws[:-1]:
        xs.append(xs[-1] + w + gap)
    keys = ("app", "worker", "handlers", "store")
    acc = {"app": c.purple, "worker": c.blue, "handlers": c.blue,
           "store": c.green, "seed": c.green, "net": c.t["muted"]}
    h1 = max(card_h(w, *t[k]) for w, k in zip(ws, keys))
    y1 = 24
    b = {k: card(c, x, y1, w, acc[k], *t[k], h=h1)
         for x, w, k in zip(xs, ws, keys)}
    y2 = y1 + h1 + 76
    h2 = max(card_h(ws[1], *t["net"]), card_h(ws[3], *t["seed"]))
    b["net"] = card(c, xs[1], y2, ws[1], acc["net"], *t["net"], h=h2,
                    dash=DASH_OUTSIDE)
    b["seed"] = card(c, xs[3], y2, ws[3], acc["seed"], *t["seed"], h=h2)
    ym = y1 + h1 / 2
    for a, z in zip(keys, keys[1:]):
        c.line(b[a][0] + b[a][2], ym, b[z][0], ym, color=fg, sw=STROKE,
               marker=fg)
    xw = xs[1] + ws[1] / 2
    c.line(xw, y1 + h1, xw, y2, color=c.t["muted"], sw=STROKE,
           marker=c.t["muted"], dash=DASH_OUTSIDE)
    lw = tw(t["bypass"], 16) + 12
    edge_label(c, xw + 10 + lw / 2, (y1 + h1 + y2) / 2, t["bypass"], fg,
               pill=False)
    xsd = xs[3] + ws[3] / 2
    c.line(xsd, y2, xsd, y1 + h1, color=c.green, sw=STROKE, marker=c.green)
    lw = tw(t["boot"], 16) + 12
    edge_label(c, xsd - 10 - lw / 2, (y1 + h1 + y2) / 2, t["boot"], c.green,
               pill=False)
    save(c, f"{fid}.{lang}")



LABELS["pkg-api-mutator-registry"] = {
    "en": {
        "app": ("Application startup", ["configureMutator(fetch)",
                                        "configureMutator(name, fetch)"]),
        "pkg": ("domain package", ["generated code", 'getMutator("admin-api")']),
        "reg": ("registry", ["Map by strategy", '"default" · "admin-api"']),
        "locale": ("setRequestLocale", ["sets the locale"]),
        "wrap": ("Accept-Language", ["header wrapper", "if a locale is set"]),
        "err": ("Error", ["strategy not configured"]),
        "server": ("Server", ["receives the request"]),
        "found": "found",
        "missing": "missing",
        "fetch": "fetch",
    },
    "ko": {
        "app": ("앱 시작", ["configureMutator(fetch)",
                          "configureMutator(name, fetch)"]),
        "pkg": ("도메인 패키지", ["생성된 코드", 'getMutator("admin-api")']),
        "reg": ("레지스트리", ["전략별 Map", '"default" · "admin-api"']),
        "locale": ("setRequestLocale", ["요청 로케일 지정"]),
        "wrap": ("Accept-Language", ["헤더 래퍼", "로케일이 있을 때만"]),
        "err": ("Error", ["등록되지 않은 전략"]),
        "server": ("서버", ["요청 수신"]),
        "found": "있음",
        "missing": "없음",
        "fetch": "fetch",
    },
}


def fig_api_mutator_registry(lang):
    """Startup writes fetch functions into the registry by strategy; generated
    code reads one back, wrapped with the locale header when one is set."""
    fid = "pkg-api-mutator-registry"
    t = LABELS[fid][lang]
    c = canvas(1200, 700)
    fg = c.t["fg_dim"]
    gap = 64
    cw = (1152 - 3 * gap) / 4
    xs = [24 + k * (cw + gap) for k in range(4)]
    vgap = 50
    rows = (("app", "locale"), ("reg", "wrap", "server"), ("pkg", "err"))
    hs = [max(card_h(cw, *t[k]) for k in r) for r in rows]
    ys = [24]
    for h in hs[:-1]:
        ys.append(ys[-1] + h + vgap)
    place = {"app": (0, 0), "locale": (2, 0), "reg": (1, 1), "wrap": (2, 1),
             "server": (3, 1), "pkg": (0, 2), "err": (2, 2)}
    acc = {"app": c.purple, "pkg": c.purple, "reg": c.blue, "locale": c.teal,
           "wrap": c.teal, "err": c.red, "server": c.orange}
    # each card keeps its own height, centred on its row's middle
    b = {k: card(c, xs[col], ys[r] + (hs[r] - card_h(cw, *t[k])) / 2, cw,
                 acc[k], *t[k])
         for k, (col, r) in place.items()}
    reg = b["reg"]
    rcx = reg[0] + cw / 2
    a = b["app"]
    c.path(f"M{a[0] + cw},{a[1] + a[3] / 2} H{rcx} V{reg[1]}", color=c.purple,
           sw=STROKE, marker=c.purple)
    p = b["pkg"]
    c.path(f"M{p[0] + cw},{p[1] + p[3] / 2} H{rcx} V{reg[1] + reg[3]}",
           color=c.purple, sw=STROKE, marker=c.purple)
    ym = reg[1] + reg[3] / 2
    w_ = b["wrap"]
    sw_ = b["server"]
    if not (w_[1] < ym < w_[1] + w_[3] and sw_[1] < ym < sw_[1] + sw_[3]):
        raise ValueError("row-2 cards do not share the registry's middle")
    c.line(reg[0] + cw, ym, w_[0], ym, color=fg, sw=STROKE, marker=fg)
    edge_label(c, reg[0] + cw + gap / 2, ym - 18, t["found"], fg, pill=False)
    e = b["err"]
    xg = reg[0] + cw + gap / 2
    y0 = reg[1] + reg[3] * 0.78
    c.path(f"M{reg[0] + cw},{y0} H{xg} V{e[1] + e[3] / 2} H{e[0]}",
           color=c.red, sw=STROKE, marker=c.red)
    lw = tw(t["missing"], 16) + 12
    edge_label(c, xg - 10 - lw / 2, (reg[1] + reg[3] + e[1]) / 2, t["missing"],
               c.red, pill=False)
    lc = b["locale"]
    xl = lc[0] + cw / 2
    c.line(xl, lc[1] + lc[3], xl, w_[1], color=c.teal, sw=STROKE,
           marker=c.teal)
    s = b["server"]
    c.line(w_[0] + cw, ym, s[0], ym, color=fg, sw=STROKE, marker=fg)
    edge_label(c, w_[0] + cw + gap / 2, ym - 18, t["fetch"], fg, pill=False)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_query_key_hierarchy(_lang)
    fig_mutation_invalidation(_lang)
    fig_form_update_flow(_lang)
    fig_mock_request_flow(_lang)
    fig_api_mutator_registry(_lang)
