"""Figures for the tutorials (docs/en/tutorials, docs/ko/tutorials): project app and
full-stack mock.

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP, CONTENT_W, HAIRLINE, STROKE, canvas, card, card_h,
                    edge_label, figure, note, row, save, tw)

LANGS = ("en", "ko")

LABELS = {
    "tutorials-project-app-flow": {
        "en": {
            "contract": ("projectApi", ["contract", "project · task"]),
            "derive": ("deriveEntityHooks", ["hooks.project",
                                                "hooks.task"]),
            "query": ("Query hooks", ["useList", "useGet",
                                      "useInfiniteList"]),
            "mutation": ("Mutation hooks", ["useCreate", "useUpdate",
                                            "useDelete"]),
            "read": ("Components", ["ProjectList", "TaskList"]),
            "write": ("Components", ["CreateProject", "EditProject",
                                     "DeleteProject"]),
            "api": ("API server", ["HTTP API /api/v1"]),
            "client": "client fetch",
            "invalidate": "invalidates [domain, entity]",
        },
        "ko": {
            "contract": ("projectApi", ["계약", "project · task"]),
            "derive": ("deriveEntityHooks", ["hooks.project",
                                                "hooks.task"]),
            "query": ("쿼리 훅", ["useList", "useGet",
                                 "useInfiniteList"]),
            "mutation": ("뮤테이션 훅", ["useCreate", "useUpdate",
                                       "useDelete"]),
            "read": ("컴포넌트", ["ProjectList", "TaskList"]),
            "write": ("컴포넌트", ["CreateProject", "EditProject",
                                  "DeleteProject"]),
            "api": ("API 서버", ["HTTP API /api/v1"]),
            "client": "클라이언트 fetch",
            "invalidate": "[domain, entity] 쿼리 무효화",
        },
    },
    "tutorials-full-stack-mock-request": {
        "en": {
            "actors": ["Hook", "Contract client", "MSW service worker",
                       "Mock handler", "In-memory store"],
            "subs": ["hooks.project.useList", "fetch", "in the browser",
                     "per operation", "project_project"],
            "m": ["fetch list", "GET /api/v1/…", "route match", "read rows",
                  "rows", "{ data: ... }", "response", "data"],
            "unmatched": "No backend server takes part; a request no handler "
                         "matches goes on to the network",
        },
        "ko": {
            "actors": ["훅", "계약 클라이언트", "MSW 서비스 워커",
                       "목 핸들러", "인메모리 저장소"],
            "subs": ["hooks.project.useList", "fetch", "브라우저 안",
                     "오퍼레이션별", "project_project"],
            "m": ["목록 요청", "GET /api/v1/…", "경로 일치", "행 읽기",
                  "행", "{ data: ... }", "응답", "데이터"],
            "unmatched": "백엔드 서버 없이 처리, 일치하는 핸들러가 없는 요청만 "
                         "네트워크로 전달",
        },
    },
    "tutorials-full-stack-mock-switch": {
        "en": {
            "contract": ("Contract (shared)", ["defineApi(projectConfig)"]),
            "ui": ("Hooks and components", ["the same code on both sides"]),
            "main": ("src/main.tsx", ["bootstrap()"]),
            "mock": ("In-memory store + MSW", ["development"]),
            "real": ("Backend API server", ["production · /api/v1"]),
            "yes": "DEV and VITE_USE_MOCK=true",
            "no": "VITE_USE_MOCK=false",
        },
        "ko": {
            "contract": ("계약(공통)", ["defineApi(projectConfig)"]),
            "ui": ("훅과 컴포넌트", ["양쪽에서 같은 코드"]),
            "main": ("src/main.tsx", ["bootstrap()"]),
            "mock": ("인메모리 저장소 + MSW", ["개발"]),
            "real": ("백엔드 API 서버", ["프로덕션 · /api/v1"]),
            "yes": "DEV이고 VITE_USE_MOCK=true",
            "no": "VITE_USE_MOCK=false",
        },
    },
}


def sequence_board(c, x0, top, actors, subs, accents, messages, step=44):
    """Lifeline heads across the content width and one arrow per message.

    `messages` are (from, to, label, accent); a label sits on a plate in the
    lane gap next to the sender, so it never rests on a lifeline. Returns the
    y of the last message."""
    n = len(actors)
    gap = 18
    w = (CONTENT_W - gap * (n - 1)) / n
    xs = [x0 + i * (w + gap) for i in range(n)]
    hh = max(card_h(w, a, [s] if s else [], bullet=False) for a, s in zip(actors, subs))
    for x, a, s, acc in zip(xs, actors, subs, accents):
        card(c, x, top, w, acc, a, [s] if s else [], h=hh, align="middle",
             bullet=False)
    cx = [x + w / 2 for x in xs]
    y = top + hh + step
    ends = []
    for k, (a, b, label, acc) in enumerate(messages):
        my = top + hh + step * (k + 1) - 6
        ends.append(my)
    bottom = ends[-1] + step / 2
    for x in cx:
        c.line(x, top + hh, x, bottom, color=c.t["line"], sw=HAIRLINE, marker=None)
    for (a, b, label, acc), my in zip(messages, ends):
        d = 1 if b > a else -1
        c.line(cx[a], my, cx[b] - d * 2, my, color=acc, sw=STROKE, marker=acc)
        lx = cx[a] + d * (w + gap) / 2
        edge_label(c, lx, my - 17, label, acc, size=BODY)
    return bottom


def fig_project_app_flow(lang):
    """Contract → derived hooks → components, and mutations invalidate lists."""
    fid = "tutorials-project-app-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    fg = c.t["fg_dim"]
    x0, top, gap = 28, 28, 48
    (xa, xb, xc, xd), w = row(4, gap, width=CONTENT_W, x0=x0)
    wa = wb = wc = wd = w
    vgap = 70
    hq = max(card_h(wc, *t["query"]), card_h(wd, *t["read"]))
    hm = max(card_h(wc, *t["mutation"]), card_h(wd, *t["write"]))
    yq, ym = top, top + hq + vgap
    bq = card(c, xc, yq, wc, c.green, *t["query"], h=hq)
    bm = card(c, xc, ym, wc, c.orange, *t["mutation"], h=hm)
    card(c, xd, yq, wd, c.blue, *t["read"], h=hq)
    card(c, xd, ym, wd, c.blue, *t["write"], h=hm)
    for b in (bq, bm):
        my = b[1] + b[3] / 2
        c.line(xd, my, xc + wc, my, color=fg, sw=STROKE, marker=fg)
    mid = (yq + ym + hm) / 2
    hb = card_h(wb, *t["derive"])
    yb = mid - hb / 2
    card(c, xb, yb, wb, c.purple, *t["derive"], h=hb)
    ha = card_h(wa, *t["contract"])
    ya = mid - ha / 2
    card(c, xa, ya, wa, c.purple, *t["contract"], h=ha)
    c.line(xa + wa, mid, xb, mid, color=fg, sw=STROKE, marker=fg)
    jx = xb + wb + gap / 2
    c.path(f"M{xb + wb},{mid - 12} H{jx} V{yq + hq / 2} H{xc}", color=fg,
           sw=STROKE, marker=fg)
    c.path(f"M{xb + wb},{mid + 12} H{jx} V{ym + hm / 2} H{xc}", color=fg,
           sw=STROKE, marker=fg)
    # every mutation invalidates the entity's queries, so the lists refetch
    ix = xc + 28
    c.line(ix, ym, ix, yq + hq, color=c.orange, sw=STROKE, marker=c.orange)
    edge_label(c, ix + 12 + tw(t["invalidate"], CHIP) / 2, yq + hq + vgap / 2,
               t["invalidate"], c.orange, pill=False)
    # the contract's client is what reaches the API
    hapi = card_h(wa, *t["api"])
    yapi = ya + ha + 60
    card(c, xa, yapi, wa, c.t["fg_dim"], *t["api"], h=hapi, dash="5 4")
    cx = xa + wa / 2
    c.line(cx, ya + ha, cx, yapi, color=fg, sw=STROKE, marker=fg)
    edge_label(c, cx + 12 + tw(t["client"], CHIP) / 2, ya + ha + 30,
               t["client"], fg, pill=False)
    save(c, f"{fid}.{lang}")


@figure(plain=True)
def fig_mock_request(lang):
    """One request through the worker to the store and back, no backend."""
    fid = "tutorials-full-stack-mock-request"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    H, CL, W, MH, ST = range(5)
    m = t["m"]
    blue, green = c.blue, c.green
    msgs = [(H, CL, m[0], blue), (CL, W, m[1], blue), (W, MH, m[2], blue),
            (MH, ST, m[3], blue), (ST, MH, m[4], green), (MH, W, m[5], green),
            (W, CL, m[6], green), (CL, H, m[7], green)]
    accents = [c.purple, c.purple, c.orange, c.orange, c.teal]
    bottom = sequence_board(c, 28, 28, t["actors"], t["subs"], accents, msgs)
    note(c, 28, bottom + 20, CONTENT_W, t["unmatched"], c.orange)
    save(c, f"{fid}.{lang}")


@figure(plain=True)
def fig_mock_switch(lang):
    """One contract and one UI; main.tsx alone picks mock or real API."""
    fid = "tutorials-full-stack-mock-switch"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    fg = c.t["fg_dim"]
    x0, top, gap = 28, 28, 120
    xs, w = row(2, gap, width=CONTENT_W, x0=x0)
    h1 = max(card_h(w, *t[k], bullet=False) for k in ("contract", "ui"))
    card(c, xs[0], top, w, c.purple, *t["contract"], h=h1, bullet=False)
    card(c, xs[1], top, w, c.purple, *t["ui"], h=h1, bullet=False)
    c.line(xs[0] + w, top + h1 / 2, xs[1], top + h1 / 2, color=fg, sw=STROKE,
           marker=fg)
    wm = 300
    xm = x0 + CONTENT_W / 2 - wm / 2
    hm = card_h(wm, *t["main"], bullet=False)
    ym = top + h1 + 50
    card(c, xm, ym, wm, c.blue, *t["main"], h=hm, bullet=False, align="middle")
    c.line(xs[1] + w / 2, top + h1, xs[1] + w / 2, ym + hm / 2, color=fg,
           sw=STROKE, marker=None)
    c.line(xs[1] + w / 2, ym + hm / 2, xm + wm, ym + hm / 2, color=fg,
           sw=STROKE, marker=fg)
    y3 = ym + hm + 90
    h3 = max(card_h(w, *t[k], bullet=False) for k in ("mock", "real"))
    card(c, xs[0], y3, w, c.orange, *t["mock"], h=h3, bullet=False)
    card(c, xs[1], y3, w, c.green, *t["real"], h=h3, bullet=False)
    for k, (key, acc) in enumerate((("yes", c.orange), ("no", c.green))):
        bx = xs[k] + w / 2
        sx = xm + wm * (0.3 if k == 0 else 0.7)
        mid = ym + hm + 40
        c.path(f"M{sx},{ym + hm} V{mid} H{bx} V{y3}", color=acc, sw=STROKE,
               marker=acc)
        # each condition sits inside its own bend, toward the centre
        inward = 1 if k == 0 else -1
        lx = bx + inward * (12 + tw(t[key], BODY) / 2)
        edge_label(c, lx, mid + 24, t[key], acc, size=BODY, pill=False)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_project_app_flow(_lang)
    fig_mock_switch(_lang)
    fig_mock_request(_lang)
