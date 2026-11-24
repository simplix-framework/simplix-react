"""Figures for the getting-started documents (docs/en/getting-started, docs/ko/getting-started).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CONTENT_W, HAIRLINE, STROKE, canvas, card, card_h,
                    edge_label, figure, note, save)

LANGS = ("en", "ko")

LABELS = {
    "start-overview-derivation": {
        "en": {
            "contract": ("Contract", ["defineApi()", "Zod schemas"]),
            "client": ("Client", ["client", "@simplix-react/contract"]),
            "keys": ("Query keys", ["queryKeys", "@simplix-react/contract"]),
            "hooks": ("Hooks", ["deriveEntityHooks", "@simplix-react/react"]),
            "form": ("Form hooks", ["deriveEntityFormHooks",
                                    "@simplix-react/form"]),
            "mock": ("Mock handlers", ["deriveMockHandlers",
                                       "@simplix-react/mock"]),
            "auth": ("Auth", ["createAuthFetch", "@simplix-react/auth"]),
            "server": ("Server", ["HTTP"]),
            "store": ("In-memory store", ["records of the mock handlers"]),
            "fetch": "fetch",
            "verdict": "Every layer is derived from one contract; "
                       "auth wraps the client's fetch",
        },
        "ko": {
            "contract": ("계약", ["defineApi()", "Zod 스키마"]),
            "client": ("클라이언트", ["client", "@simplix-react/contract"]),
            "keys": ("쿼리 키", ["queryKeys", "@simplix-react/contract"]),
            "hooks": ("훅", ["deriveEntityHooks", "@simplix-react/react"]),
            "form": ("폼 훅", ["deriveEntityFormHooks", "@simplix-react/form"]),
            "mock": ("목 핸들러", ["deriveMockHandlers", "@simplix-react/mock"]),
            "auth": ("인증", ["createAuthFetch", "@simplix-react/auth"]),
            "server": ("서버", ["HTTP"]),
            "store": ("인메모리 저장소", ["목 핸들러의 레코드"]),
            "fetch": "fetch",
            "verdict": "모든 계층을 계약 하나에서 파생 · "
                       "인증은 클라이언트의 fetch를 감쌈",
        },
    },
    "start-quick-start-request-flow": {
        "en": {
            "heads": [("TaskList", ["component"]),
                      ("useList()", ["projectHooks.task"]),
                      ("client.task", ["projectApi"]),
                      ("MSW worker", ["service worker"]),
                      ("In-memory store", ["project_task"])],
            "seed": "setupMockWorker: seed",
            "render": "render starts after the seed",
            "m": ["useList()", "list()", "fetch GET", "read records",
                  "records", "{ data: [...] }", "data unwrapped", "tasks"],
            "verdict": "MSW answers the request; the real server is never reached",
        },
        "ko": {
            "heads": [("TaskList", ["컴포넌트"]),
                      ("useList()", ["projectHooks.task"]),
                      ("client.task", ["projectApi"]),
                      ("MSW 워커", ["서비스 워커"]),
                      ("인메모리 저장소", ["project_task"])],
            "seed": "setupMockWorker: 초기 데이터 적재",
            "render": "적재가 끝난 뒤 렌더링 시작",
            "m": ["useList()", "list()", "fetch GET", "레코드 조회",
                  "레코드", "{ data: [...] }", "data 꺼냄", "할 일 목록"],
            "verdict": "MSW가 요청에 응답 · 실제 서버에는 도달하지 않음",
        },
    },
}


def fig_overview_derivation(lang):
    """One contract, five derived layers; auth sits between client and server."""
    fid = "start-overview-derivation"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    x0 = 28
    wa, gap, wb = 220, 52, 300
    xa, xb = x0, x0 + wa + gap
    xc = xb + wb + gap
    wauth = wb
    xs = xc + wauth + gap
    ws = x0 + CONTENT_W - xs
    vgap = 22
    rows = ("client", "keys", "hooks", "form", "mock")
    h = max(card_h(wb, *t[k]) for k in rows)
    h = max(h, card_h(wauth, *t["auth"]), card_h(ws, *t["server"]),
            card_h(wauth, *t["store"]))
    top = 30
    boxes = {}
    for i, k in enumerate(rows):
        acc = c.orange if k == "mock" else (c.green if k in ("hooks", "form")
                                            else c.blue)
        title, lines = t[k]
        boxes[k] = card(c, xb, top + i * (h + vgap), wb, acc, title, lines, h=h)
    bottom = top + 5 * h + 4 * vgap
    title, lines = t["contract"]
    card(c, xa, top, wa, c.purple, title, lines, h=bottom - top,
         valign="middle", sw=STROKE)
    fg = c.t["fg_dim"]
    for k in rows:
        bx, by, bw, bh = boxes[k]
        c.line(xa + wa, by + bh / 2, bx, by + bh / 2, color=fg, sw=STROKE,
               marker=fg)
    # client -> auth -> server: auth wraps the fetch the client calls
    cy = boxes["client"][1]
    title, lines = t["auth"]
    ba = card(c, xc, cy, wauth, c.red, title, lines, h=h)
    title, lines = t["server"]
    bs = card(c, xs, cy, ws, c.t["fg_dim"], title, lines, h=h)
    yy = cy + h / 2
    c.line(xb + wb, yy, xc, yy, color=fg, sw=STROKE, marker=fg)
    edge_label(c, xb + wb + gap / 2, yy - 18, t["fetch"], fg, pill=False)
    c.line(xc + wauth, yy, xs, yy, color=fg, sw=STROKE, marker=fg)
    # mock handlers -> in-memory store
    my = boxes["mock"][1]
    title, lines = t["store"]
    card(c, xc, my, wauth, c.orange, title, lines, h=h)
    c.line(xb + wb, my + h / 2, xc, my + h / 2, color=fg, sw=STROKE, marker=fg)
    note(c, x0, bottom + 26, CONTENT_W, t["verdict"], c.purple)
    save(c, f"{fid}.{lang}")


@figure(plain=True)
def fig_quick_start_request_flow(lang):
    """Sequence: seeding before render, then one list request answered by MSW."""
    fid = "start-quick-start-request-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    x0, n, gap = 28, 5, 24
    w = (CONTENT_W - (n - 1) * gap) / n
    xs = [x0 + i * (w + gap) for i in range(n)]
    cx = [x + w / 2 for x in xs]
    accents = [c.blue, c.green, c.blue, c.orange, c.orange]
    h = max(card_h(w, *hd) for hd in t["heads"])
    top = 30
    for i, (title, lines) in enumerate(t["heads"]):
        card(c, xs[i], top, w, accents[i], title, lines, h=h, align="middle")
    fg = c.t["fg_dim"]
    step = 52
    end = top + h + 52 + 40 + 56 + 7 * step + 20
    for x in cx:
        c.line(x, top + h, x, end, color=c.t["line"], sw=HAIRLINE, marker=None)
    y = top + h + 52
    # 0: seeding at bootstrap, before any render
    c.line(cx[3], y, cx[4], y, color=c.orange, sw=STROKE, marker=c.orange)
    edge_label(c, (cx[3] + cx[4]) / 2, y - 18, t["seed"], c.orange,
               size=BODY)
    y += 40
    c.line(x0, y, x0 + CONTENT_W, y, color=c.t["line"], sw=HAIRLINE,
           marker=None)
    edge_label(c, x0 + CONTENT_W / 2, y, t["render"], fg, size=BODY)
    y += 56
    hops = [(0, 1), (1, 2), (2, 3), (3, 4), (4, 3), (3, 2), (2, 1), (1, 0)]
    for (a, b), label in zip(hops, t["m"]):
        col = c.blue if b > a else c.green
        c.line(cx[a], y, cx[b], y, color=col, sw=STROKE, marker=col)
        edge_label(c, (cx[a] + cx[b]) / 2, y - 18, label, col, size=BODY,
                   pill=False)
        y += step
    note(c, x0, end + 22, CONTENT_W, t["verdict"], c.purple)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_overview_derivation(_lang)
    fig_quick_start_request_flow(_lang)
