"""Figures for the data guides (defining entities, custom fetch, custom operations,
parent and child entities) in docs/en/guides and docs/ko/guides.

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP, CONTENT_W, HAIRLINE, STROKE, canvas, card,
                    card_h, centered_baseline, col_head, edge_label, note,
                    pill, pill_h, save, zone, CHIP_RISE, PAD, SANS)

LANGS = ("en", "ko")
OPS = ("list", "get", "create", "update", "delete")

LABELS = {
    "guides-defining-entities-structure": {
        "en": {
            "contract": "Contract · defineApi(config)",
            "entity": "Entity · project",
            "schema": ("schema", ["Zod object", "entity shape"]),
            "ops": "Operations · role from name",
            "client": "Client methods",
            "hooks": "Hooks",
        },
        "ko": {
            "contract": "계약 · defineApi(config)",
            "entity": "엔티티 · project",
            "schema": ("schema", ["Zod 객체", "엔티티 형태"]),
            "ops": "오퍼레이션 · 이름으로 정한 역할",
            "client": "클라이언트 메서드",
            "hooks": "훅",
        },
    },
    "guides-custom-fetch-resolution": {
        "en": {
            "call": "Client method call",
            "d0": "multipart or blob operation",
            "d1": "fetchFn in defineApi",
            "d2": "set by configureDefaultFetch",
            "last": "defaultFetch",
            "r0": "global fetch",
            "r1": "contract's fetchFn",
            "r2": "configured function",
            "yes": "yes",
            "no": "no",
        },
        "ko": {
            "call": "클라이언트 메서드 호출",
            "d0": "multipart 또는 blob 오퍼레이션",
            "d1": "defineApi의 fetchFn",
            "d2": "지정 함수 (configureDefaultFetch)",
            "last": "defaultFetch",
            "r0": "전역 fetch",
            "r1": "계약의 fetchFn",
            "r2": "지정한 함수",
            "yes": "예",
            "no": "아니요",
        },
    },
    "guides-custom-operations-hook-kind": {
        "en": {
            "op": "Operation",
            "in_entity": "inside an entity",
            "top": "top-level operations",
            "d1": "CRUD name or role",
            "d2": "method GET",
            "yes": "yes",
            "no": "no",
            "crud": ("CRUD hook", ["use<Name>", "list also useInfiniteList"]),
            "query": ("Query hook", ["use<Name>"]),
            "mutation": ("Mutation hook", ["use<Name>",
                                           "invalidates the keys of invalidates, else keys.all"]),
            "toph": ("Mutation hook", ["hooks.<operation>.useMutation()",
                                       "invalidates only what invalidates returns"]),
        },
        "ko": {
            "op": "오퍼레이션",
            "in_entity": "엔티티 안",
            "top": "최상위 operations",
            "d1": "CRUD 이름 또는 role",
            "d2": "GET 메서드",
            "yes": "예",
            "no": "아니요",
            "crud": ("CRUD 훅", ["use<Name>", "list는 useInfiniteList도"]),
            "query": ("쿼리 훅", ["use<Name>"]),
            "mutation": ("뮤테이션 훅", ["use<Name>",
                                       "invalidates가 반환한 키, 없으면 keys.all 무효화"]),
            "toph": ("뮤테이션 훅", ["hooks.<operation>.useMutation()",
                                    "invalidates가 반환한 키만 무효화"]),
        },
    },
    "guides-parent-child-url-composition": {
        "en": {
            "row1": "list · create",
            "row2": "get · update · delete",
            "segs": (("/api/v1", "basePath"), ("/projects", "parent.path"),
                     ("/:projectId", "parent ID"), ("/tasks", "operation path")),
            "seg2": ("/tasks/:id", "operation path"),
            "skip": "no parent prefix",
            "res1": "/api/v1/projects/:projectId/tasks",
            "res2": "/api/v1/tasks/:id",
        },
        "ko": {
            "row1": "list · create",
            "row2": "get · update · delete",
            "segs": (("/api/v1", "basePath"), ("/projects", "parent.path"),
                     ("/:projectId", "상위 ID"), ("/tasks", "오퍼레이션 경로")),
            "seg2": ("/tasks/:id", "오퍼레이션 경로"),
            "skip": "상위 경로를 추가하지 않음",
            "res1": "/api/v1/projects/:projectId/tasks",
            "res2": "/api/v1/tasks/:id",
        },
    },
}


def arrow(c, x1, y1, x2, y2):
    fg = c.t["fg_dim"]
    c.line(x1, y1, x2, y2, color=fg, sw=STROKE, marker=fg)


def route(c, d):
    fg = c.t["fg_dim"]
    c.path(d, color=fg, sw=STROKE, marker=fg)


def side_label(c, x, y, text, color):
    """A connector label set in open paper just right of a vertical line."""
    c.text(x + 12, y, text, size=CHIP, color=color, family=SANS, weight=600)


def fig_defining_entities_structure(lang):
    """Contract holds the entity; each operation maps to one client method and one hook."""
    fid = "guides-defining-entities-structure"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    ph = pill_h(BODY)
    rgap = 12
    zt = 40 + CHIP_RISE
    xo, wo = 290, 254
    xc, wc = 616, 265
    xh, wh = 911, 265
    # outer zone content starts where zone() says; the inner zone's chip sits there
    z_in = zt + CHIP_RISE + PAD
    ez = z_in + CHIP_RISE
    e_in = ez + CHIP_RISE + PAD
    head_base = e_in + 16
    rows_top = head_base + 18
    ys = [rows_top + k * (ph + rgap) for k in range(len(OPS))]
    rows_bottom = ys[-1] + ph
    ebottom = rows_bottom + PAD
    zbottom = ebottom + PAD

    zone(c, 24, zt, 560, zbottom - zt, c.purple, t["contract"])
    zone(c, 24 + PAD, ez, 560 - 2 * PAD, ebottom - ez, c.blue, t["entity"])
    title, lines = t["schema"]
    card(c, 24 + 2 * PAD, head_base - 16, 220, c.blue, title, lines,
         h=rows_bottom - head_base + 16, valign="middle")
    col_head(c, xo, head_base, t["ops"], c.t["fg"], size=CHIP)
    col_head(c, xc, head_base, t["client"], c.t["fg"], size=CHIP)
    col_head(c, xh, head_base, t["hooks"], c.t["fg"], size=CHIP)
    for op, y in zip(OPS, ys):
        pill(c, xo, y, wo, ph, op, c.blue, rx=8)
        pill(c, xc, y, wc, ph, f"client.project.{op}", c.green, rx=8)
        hook = "use" + op.capitalize()
        if op == "list":
            hook += " · useInfiniteList"
        pill(c, xh, y, wh, ph, hook, c.orange, rx=8)
        cy = y + ph / 2
        arrow(c, xo + wo, cy, xc, cy)
        arrow(c, xc + wc, cy, xh, cy)
    save(c, f"{fid}.{lang}")


def fig_custom_fetch_resolution(lang):
    """Per call: multipart/blob bypass, then fetchFn, configured fetch, defaultFetch."""
    fid = "guides-custom-fetch-resolution"
    t = LABELS[fid][lang]
    c = canvas(1200, 600)
    gap = 56
    n = 5
    ws = (140, 180, 170, 298, 140)
    xs = [24 + sum(ws[:k]) + k * gap for k in range(n)]
    keys = ("call", "d0", "d1", "d2", "last")
    h1 = max(card_h(w, None, [t[k]]) for k, w in zip(keys, ws))
    y1 = 40
    accents = (c.t["fg_dim"], c.purple, c.purple, c.purple, c.green)
    boxes = []
    for k, x, w, a in zip(keys, xs, ws, accents):
        boxes.append(card(c, x, y1, w, a, None, [t[k]], h=h1,
                          valign="middle", align="middle"))
    y2 = y1 + h1 + 72
    rk = ("r0", "r1", "r2")
    wr = 200
    h2 = max(card_h(wr, None, [t[k]]) for k in rk)
    for k, i in zip(rk, (1, 2, 3)):
        cx = xs[i] + ws[i] / 2
        card(c, cx - wr / 2, y2, wr, c.green, None, [t[k]], h=h2,
             valign="middle", align="middle")
        arrow(c, cx, y1 + h1, cx, y2)
        side_label(c, cx, (y1 + h1 + y2) / 2 + 6, t["yes"], c.green)
    cy = y1 + h1 / 2
    for i in range(n - 1):
        w = ws[i]
        arrow(c, xs[i] + w, cy, xs[i + 1], cy)
        if i >= 1:
            edge_label(c, xs[i] + w + gap / 2, cy - 22, t["no"], c.t["fg_dim"],
                       pill=False)
    save(c, f"{fid}.{lang}")


def fig_custom_operations_hook_kind(lang):
    """Where the operation is defined, then its role and method, pick the hook."""
    fid = "guides-custom-operations-hook-kind"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    gap = 36
    ws = (250, 250, 580)
    xs = [24 + sum(ws[:k]) + k * gap for k in range(3)]
    cx = [x + w / 2 for x, w in zip(xs, ws)]
    fg = c.t["fg_dim"]
    # row 1: the operation and, to its right, what a top-level operation gets
    y0 = 40
    title, lines = t["toph"]
    ht = card_h(ws[2], title, lines)
    top = card(c, xs[2], y0, ws[2], c.orange, title, lines)
    h0 = card_h(ws[0], None, [t["op"]])
    yo = y0 + ht / 2 - h0 / 2
    card(c, xs[0], yo, ws[0], fg, None, [t["op"]], h=h0,
         valign="middle", align="middle")
    arrow(c, xs[0] + ws[0], y0 + ht / 2, xs[2], y0 + ht / 2)
    edge_label(c, (xs[0] + ws[0] + xs[2]) / 2, y0 + ht / 2 - 20, t["top"], fg,
               pill=False)
    # row 2: inside an entity, role first, then method
    yd = y0 + ht + 64
    hd = max(card_h(w, None, [t[k]]) for k, w in (("d1", ws[0]), ("d2", ws[1])))
    card(c, xs[0], yd, ws[0], c.purple, None, [t["d1"]], h=hd,
         valign="middle", align="middle")
    card(c, xs[1], yd, ws[1], c.purple, None, [t["d2"]], h=hd,
         valign="middle", align="middle")
    arrow(c, cx[0], yo + h0, cx[0], yd)
    side_label(c, cx[0], (yo + h0 + yd) / 2 + 6, t["in_entity"], fg)
    # row 3: the hook each branch yields
    yr = yd + hd + 64
    res = ("crud", "query", "mutation")
    hr = max(card_h(w, *t[k]) for k, w in zip(res, ws))
    for k, x, w, a in zip(res, xs, ws, (c.green, c.green, c.orange)):
        title, lines = t[k]
        card(c, x, yr, w, a, title, lines, h=hr)
    arrow(c, cx[0], yd + hd, cx[0], yr)
    side_label(c, cx[0], (yd + hd + yr) / 2 + 6, t["yes"], c.green)
    arrow(c, xs[0] + ws[0], yd + hd / 2, xs[1], yd + hd / 2)
    edge_label(c, xs[0] + ws[0] + gap / 2, yd + hd / 2 - 20, t["no"], fg,
               pill=False)
    arrow(c, cx[1], yd + hd, cx[1], yr)
    side_label(c, cx[1], (yd + hd + yr) / 2 + 6, t["yes"], c.green)
    route(c, f"M{xs[1] + ws[1]},{yd + hd / 2} H{cx[2]} V{yr}")
    edge_label(c, (xs[1] + ws[1] + cx[2]) / 2, yd + hd / 2 - 20, t["no"], fg,
               pill=False)
    save(c, f"{fid}.{lang}")


def fig_parent_child_url_composition(lang):
    """list/create join four segments; get/update/delete skip the parent prefix."""
    fid = "guides-parent-child-url-composition"
    t = LABELS[fid][lang]
    c = canvas(1200, 600)
    xr, wr = 24, 230
    x0 = xr + wr + 20
    n = 4
    sw_ = (1176 - x0) / n
    xs = [x0 + k * sw_ for k in range(n)]
    sh = 70
    accents = (c.purple, c.blue, c.blue, c.green)

    def segment(x, y, w, value, source, accent):
        c.rrect(x, y, w, sh, rx=0, fill=c.t["box"], stroke=accent, sw=HAIRLINE)
        c.text(x + w / 2, y + 30, value, size=BODY, color=c.t["fg"],
               family=SANS, weight=700, anchor="middle")
        c.text(x + w / 2, y + 55, source, size=CHIP, color=accent,
               family=SANS, weight=600, anchor="middle")

    def rail(y, text):
        c.text(xr, centered_baseline(y, sh, BODY), text, size=BODY,
               color=c.t["fg"], family=SANS, weight=700)

    y1 = 40
    rail(y1, t["row1"])
    for (value, source), x, a in zip(t["segs"], xs, accents):
        segment(x, y1, sw_, value, source, a)
    r1 = note(c, x0, y1 + sh + 12, 1176 - x0, "→ " + t["res1"], c.blue,
              align="start")
    y2 = r1[1] + r1[3] + 36
    rail(y2, t["row2"])
    segment(xs[0], y2, sw_, *t["segs"][0], accents[0])
    c.text((xs[1] + xs[3]) / 2, centered_baseline(y2, sh, BODY), t["skip"],
           size=BODY, color=c.t["fg_dim"], family=SANS, anchor="middle")
    segment(xs[3], y2, sw_, *t["seg2"], accents[3])
    note(c, x0, y2 + sh + 12, 1176 - x0, "→ " + t["res2"], c.green,
         align="start")
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_defining_entities_structure(_lang)
    fig_custom_fetch_resolution(_lang)
    fig_custom_operations_hook_kind(_lang)
    fig_parent_child_url_composition(_lang)
