"""Figures for the core-concepts documents, set A (docs/en/core-concepts, docs/ko/core-concepts).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP_RISE, CONTENT_W, DASH_OUTSIDE, HAIRLINE, PAD,
                    STROKE, canvas, card, card_h, edge_label, figure, note,
                    save, tw, zone)

LANGS = ("en", "ko")
X0 = 28
RIGHT = X0 + CONTENT_W
# a zone's content starts this far below its top edge; its sides inset by PAD
CHIP = CHIP_RISE + PAD

LABELS = {
    "concepts-api-contracts-structure": {
        "en": {
            "config": "ApiContractConfig",
            "fields": ("Contract settings", ["domain", "basePath", "queryBuilder"]),
            "entities": "entities",
            "entity": ("EntityDefinition", ["schema", "parent · queries",
                                            "filterSchema · identity"]),
            "ops": "operations",
            "op": ("EntityOperationDef", ["method · path · role",
                                          "input · output · invalidates"]),
            "top": "operations (top-level)",
            "topop": ("OperationDefinition", ["method · path",
                                              "input · output · invalidates"]),
            "reads": "reads",
            "layers": [("Client", ["client"]), ("Query keys", ["queryKeys"]),
                       ("Hooks", ["deriveEntityHooks"]),
                       ("Form hooks", ["deriveEntityFormHooks"]),
                       ("Mock handlers", ["deriveMockHandlers"])],
        },
        "ko": {
            "config": "ApiContractConfig(계약 구성)",
            "fields": ("계약 설정", ["domain", "basePath", "queryBuilder"]),
            "entities": "entities(엔티티)",
            "entity": ("EntityDefinition", ["schema", "parent · queries",
                                            "filterSchema · identity"]),
            "ops": "operations(오퍼레이션)",
            "op": ("EntityOperationDef", ["method · path · role",
                                          "input · output · invalidates"]),
            "top": "operations(최상위)",
            "topop": ("OperationDefinition", ["method · path",
                                              "input · output · invalidates"]),
            "reads": "읽기",
            "layers": [("클라이언트", ["client"]), ("쿼리 키", ["queryKeys"]),
                       ("훅", ["deriveEntityHooks"]),
                       ("폼 훅", ["deriveEntityFormHooks"]),
                       ("목 핸들러", ["deriveMockHandlers"])],
        },
    },
    "concepts-cache-invalidation-key-hierarchy": {
        "en": {
            "zone": "invalidateQueries({ queryKey: keys.all }): prefix match",
            "root": ("keys.all", ['["project", "task"]']),
            "mid": [("lists()", ['+ "list"']), ("details()", ['+ "detail"']),
                    ("trees()", ['+ "tree"'])],
            "leaf": [('list({ status: "open" })', ['+ { status: "open" }']),
                     ('list({ projectId: "project-1" })', ['+ { projectId: "project-1" }']),
                     ('detail("abc-123")', ['+ "abc-123"']),
                     ("tree({ rootId })", ["+ { rootId }"])],
            "sib": ("Another entity", ['["project", "project"]']),
            "sibkids": ("Its list, detail and tree keys", ["not invalidated"]),
        },
        "ko": {
            "zone": "invalidateQueries({ queryKey: keys.all }): 접두사 일치",
            "root": ("keys.all(루트 키)", ['["project", "task"]']),
            "mid": [("lists()(목록)", ['+ "list"']), ("details()(상세)", ['+ "detail"']),
                    ("trees()(트리)", ['+ "tree"'])],
            "leaf": [('list({ status: "open" })', ['+ { status: "open" }']),
                     ('list({ projectId: "project-1" })', ['+ { projectId: "project-1" }']),
                     ('detail("abc-123")', ['+ "abc-123"']),
                     ("tree({ rootId })", ["+ { rootId }"])],
            "sib": ("다른 엔티티", ['["project", "project"]']),
            "sibkids": ("이 엔티티의 목록 · 상세 · 트리 키", ["무효화되지 않음"]),
        },
    },
    "concepts-mock-data-layer-request-flow": {
        "en": {
            "heads": [("React app", ["fetch"]), ("MSW worker", ["service worker"]),
                      ("Mock handlers", ["deriveMockHandlers"]),
                      ("Map store", ["in-memory"]),
                      ("Network", ["real server"])],
            "matched": "request a handler matches",
            "m": ["fetch request", "intercepts", "reads / writes", "records",
                  "HTTP response", "HTTP response"],
            "unmatched": "request no handler matches",
            "u": ["fetch request", 'onUnhandledRequest: "bypass"'],
        },
        "ko": {
            "heads": [("React 앱", ["fetch"]), ("MSW 워커", ["서비스 워커"]),
                      ("목 핸들러", ["deriveMockHandlers"]),
                      ("Map 저장소", ["인메모리"]),
                      ("네트워크", ["실제 서버"])],
            "matched": "핸들러와 일치하는 요청",
            "m": ["fetch 요청", "가로챔", "읽기 / 쓰기", "레코드",
                  "HTTP 응답", "HTTP 응답"],
            "unmatched": "일치하지 않는 요청",
            "u": ["fetch 요청", 'onUnhandledRequest: "bypass"'],
        },
    },
    "concepts-form-derivation-chain": {
        "en": {
            "z1": "defineApi()", "z2": "deriveEntityHooks()",
            "z3": "deriveEntityFormHooks()",
            "contract": ("Contract", ["config", "client", "queryKeys"]),
            "hooks": ["useList", "useGet", "useCreate", "useUpdate", "useDelete"],
            "more": "other operation hooks",
            "forms": ["useCreateForm", "useUpdateForm"],
            "verdict": "Form hooks read only useCreate, useGet and useUpdate",
        },
        "ko": {
            "z1": "defineApi()", "z2": "deriveEntityHooks()",
            "z3": "deriveEntityFormHooks()",
            "contract": ("계약", ["config", "client", "queryKeys"]),
            "hooks": ["useList", "useGet", "useCreate", "useUpdate", "useDelete"],
            "more": "그 밖의 오퍼레이션 훅",
            "forms": ["useCreateForm", "useUpdateForm"],
            "verdict": "폼 훅이 읽는 훅은 useCreate · useGet · useUpdate뿐",
        },
    },
    "concepts-authentication-fetch-flow": {
        "en": {
            "headers": ("Collect and merge headers", ["globalHeaders()",
                         "scheme.getHeaders()", "user headers override"]),
            "fetch": ("Base fetch", ["baseFetchFn()"]),
            "resp": ("Response", ["returned to the caller"]),
            "is401": ("401?", ["is401(error)", "attempt < maxRetries"]),
            "refresh": ("Token refresh", ["RefreshManager", "refresh()"]),
            "fail": ("Refresh failed", ["onRefreshFailure()",
                                        "AuthError REFRESH_FAILED"]),
            "throw": ("Error thrown", ["not a 401", "or maxRetries used"]),
            "ok": "success", "err": "error", "yes": "yes",
            "no": "no", "retry": "retry with fresh headers",
            "refused": "fails",
        },
        "ko": {
            "headers": ("헤더 수집과 병합", ["globalHeaders()",
                         "scheme.getHeaders()", "사용자 헤더 우선"]),
            "fetch": ("기본 fetch", ["baseFetchFn()"]),
            "resp": ("응답", ["호출한 쪽에 반환"]),
            "is401": ("401 여부", ["is401(error)", "attempt < maxRetries"]),
            "refresh": ("토큰 갱신", ["RefreshManager", "refresh()"]),
            "fail": ("갱신 실패", ["onRefreshFailure()",
                                   "AuthError REFRESH_FAILED"]),
            "throw": ("오류 전달", ["401이 아님", "또는 maxRetries 소진"]),
            "ok": "성공", "err": "오류", "yes": "예",
            "no": "아니요", "retry": "새 헤더로 재시도",
            "refused": "실패",
        },
    },
    "concepts-authentication-single-flight": {
        "en": {
            "heads": [("Request A", ["401"]), ("Request B", ["401"]),
                      ("Request C", ["401"]), ("RefreshManager", ["inflight"]),
                      ("Refresh endpoint", ["token issuer"])],
            "m": ["refresh(): starts inflight", "one refresh call",
                  "refresh(): awaits inflight", "awaits inflight",
                  "new tokens"],
            "resume": "inflight resolves: A, B and C retry together",
        },
        "ko": {
            "heads": [("요청 A", ["401"]), ("요청 B", ["401"]),
                      ("요청 C", ["401"]), ("RefreshManager", ["inflight"]),
                      ("갱신 엔드포인트", ["토큰 발급처"])],
            "m": ["refresh(): 진행 중인 Promise 시작", "갱신 호출 한 번",
                  "refresh(): 같은 Promise 대기", "같은 Promise 대기",
                  "새 토큰"],
            "resume": "Promise 완료 · A, B, C가 함께 재개",
        },
    },
    "concepts-extensions-provider-pattern": {
        "en": {
            "app": ("Application", ["components", "hooks"]),
            "core": "Core, environment-agnostic",
            "ext": "Extensions, environment-specific",
            "rows": [
                (("@simplix-react/auth", ["AuthInstance · TokenPair", "FetchFn"]),
                 ("simplix-boot-auth", ["createBootAuth()"])),
                (("@simplix-react/access", ["AccessAdapter · AccessPolicy"]),
                 ("simplix-boot-access",
                  ["createSpringAccessAdapter()", "createBootAccessPolicy()"])),
                (("@simplix-react/cli", ["registerPlugin()", "registerSchemaAdapter()"]),
                 ("simplix-boot-cli-plugin",
                  ["simplixBootNaming", "bootSchemaAdapter"])),
            ],
            "uses": "depends on", "impls": ["implements", "implements", "registers"],
        },
        "ko": {
            "app": ("애플리케이션", ["컴포넌트", "훅"]),
            "core": "핵심 패키지, 환경 독립",
            "ext": "확장, 환경별",
            "rows": [
                (("@simplix-react/auth", ["AuthInstance · TokenPair", "FetchFn"]),
                 ("simplix-boot-auth", ["createBootAuth()"])),
                (("@simplix-react/access", ["AccessAdapter · AccessPolicy"]),
                 ("simplix-boot-access",
                  ["createSpringAccessAdapter()", "createBootAccessPolicy()"])),
                (("@simplix-react/cli", ["registerPlugin()", "registerSchemaAdapter()"]),
                 ("simplix-boot-cli-plugin",
                  ["simplixBootNaming", "bootSchemaAdapter"])),
            ],
            "uses": "의존", "impls": ["구현", "구현", "등록"],
        },
    },
}


def arrow(c, x1, y1, x2, y2, color):
    c.line(x1, y1, x2, y2, color=color, sw=STROKE, marker=color)


def lifelines(c, heads, accents, body, top=30, gap=24):
    """Header cards across the width and their lifelines; returns centres,
    the y of the first message and the y where the lifelines end."""
    n = len(heads)
    w = (CONTENT_W - (n - 1) * gap) / n
    xs = [X0 + i * (w + gap) for i in range(n)]
    h = max(card_h(w, *hd) for hd in heads)
    end = top + h + 52 + body + 20
    for x in xs:
        c.line(x + w / 2, top + h, x + w / 2, end, color=c.t["line"],
               sw=HAIRLINE, marker=None)
    for i, (title, lines) in enumerate(heads):
        card(c, xs[i], top, w, accents[i], title, lines, h=h, align="middle")
    return [x + w / 2 for x in xs], top + h + 52, end


def message(c, cx, a, b, y, label, color):
    """A message arrow; its label sits on a plate when a lifeline crosses it."""
    arrow(c, cx[a], y, cx[b], y, color)
    crosses = abs(b - a) > 1
    edge_label(c, (cx[a] + cx[b]) / 2, y - (22 if crosses else 18), label,
               color, size=BODY, pill=crosses)


def divider(c, y, label):
    c.line(X0, y, RIGHT, y, color=c.t["line"], sw=HAIRLINE, marker=None)
    edge_label(c, X0 + CONTENT_W / 2, y, label, c.t["fg_dim"], size=BODY)


def fig_api_contracts_structure(lang):
    """Containment of the contract, read whole by every derived layer."""
    fid = "concepts-api-contracts-structure"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    wz = 770
    xl = RIGHT - 290
    top = 30
    ix = X0 + PAD
    iw = wz - 2 * PAD
    hf = card_h(iw, *t["fields"])
    gap = 24
    we = 420
    wt = iw - we - gap
    he = card_h(we - 2 * PAD, *t["entity"])
    ho = card_h(we - 4 * PAD, *t["op"])
    ht = card_h(wt - 2 * PAD, *t["topop"])
    ops_h = CHIP + ho + PAD
    ent_h = CHIP + he + gap + ops_h + PAD
    top_h = CHIP + ht + PAD
    outer_h = CHIP + hf + gap + CHIP_RISE + max(ent_h, top_h) + PAD
    y0 = zone(c, X0, top, wz, outer_h, c.purple, t["config"])
    card(c, ix, y0, iw, c.purple, *t["fields"])
    yr = y0 + hf + gap + CHIP_RISE
    ye = zone(c, ix, yr, we, ent_h, c.blue, t["entities"])
    card(c, ix + PAD, ye, we - 2 * PAD, c.blue, *t["entity"])
    yo = ye + he + gap
    yoi = zone(c, ix + PAD, yo, we - 2 * PAD, ops_h, c.blue, t["ops"])
    card(c, ix + 2 * PAD, yoi, we - 4 * PAD, c.blue, *t["op"])
    xt = ix + we + gap
    yt = zone(c, xt, yr, wt, top_h, c.orange, t["top"])
    card(c, xt + PAD, yt, wt - 2 * PAD, c.orange, *t["topop"])
    # derived layers read the whole contract
    bottom = top + outer_h
    n = len(t["layers"])
    hl = max(card_h(RIGHT - xl, *l) for l in t["layers"])
    vg = (bottom - top - n * hl) / (n - 1)
    fg = c.t["fg_dim"]
    for i, (title, lines) in enumerate(t["layers"]):
        yy = top + i * (hl + vg)
        card(c, xl, yy, RIGHT - xl, c.green, title, lines, h=hl)
        arrow(c, X0 + wz, yy + hl / 2, xl, yy + hl / 2, fg)
    edge_label(c, (X0 + wz + xl) / 2, top + hl / 2 - 20, t["reads"], fg,
               pill=False)
    save(c, f"{fid}.{lang}")


@figure(plain=True)
def fig_cache_invalidation_key_hierarchy(lang):
    """Key tree under one entity, all inside the invalidated prefix."""
    fid = "concepts-cache-invalidation-key-hierarchy"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    w1, w2 = 290, 230
    g = 56
    x1 = X0 + PAD
    x2 = x1 + w1 + g
    x3 = x2 + w2 + g
    w3 = RIGHT - PAD - x3
    hleaf = max(card_h(w3, *l) for l in t["leaf"])
    hmid = max(card_h(w2, *m) for m in t["mid"])
    vg = 14
    top = 30
    groups = [[0, 1], [2], [3]]
    leaf_y = []
    y = top + CHIP
    for grp in groups:
        for k in grp:
            leaf_y.append(y)
            y += hleaf + vg
        y += 10
    zone_bottom = y - vg - 10 + PAD
    zone(c, X0, top, CONTENT_W, zone_bottom - top, c.blue, t["zone"])
    fg = c.t["fg_dim"]
    for k, (title, lines) in enumerate(t["leaf"]):
        card(c, x3, leaf_y[k], w3, c.blue, title, lines, h=hleaf)

    def fan(px, py, targets, tx):
        """One stub from the parent, one trunk, one arrow per child."""
        mx = px + g / 2
        ys = [py] + targets
        c.line(px, py, mx, py, color=fg, sw=STROKE, marker=None)
        if len(targets) > 1 or targets[0] != py:
            c.line(mx, min(ys), mx, max(ys), color=fg, sw=STROKE, marker=None)
        for ty in targets:
            arrow(c, mx, ty, tx, ty, fg)

    mids = []
    for gi, grp in enumerate(groups):
        ya = leaf_y[grp[0]]
        yb = leaf_y[grp[-1]] + hleaf
        ym = (ya + yb) / 2 - hmid / 2
        title, lines = t["mid"][gi]
        mids.append(card(c, x2, ym, w2, c.blue, title, lines, h=hmid))
        fan(x2 + w2, ym + hmid / 2, [leaf_y[k] + hleaf / 2 for k in grp], x3)
    hr = card_h(w1, *t["root"])
    yr = (mids[0][1] + mids[-1][1] + hmid) / 2 - hr / 2
    card(c, x1, yr, w1, c.blue, *t["root"], h=hr, sw=STROKE)
    fan(x1 + w1, yr + hr / 2, [b[1] + hmid / 2 for b in mids], x2)
    # the sibling entity stays outside the prefix
    ys = zone_bottom + 30
    hs = max(card_h(w1, *t["sib"]), card_h(RIGHT - PAD - x2, *t["sibkids"]))
    card(c, x1, ys, w1, fg, *t["sib"], h=hs, dash=DASH_OUTSIDE)
    card(c, x2, ys, RIGHT - PAD - x2, fg, *t["sibkids"], h=hs,
         dash=DASH_OUTSIDE)
    arrow(c, x1 + w1, ys + hs / 2, x2, ys + hs / 2, fg)
    save(c, f"{fid}.{lang}")


@figure(plain=True)
def fig_mock_data_layer_request_flow(lang):
    """Round trip through the worker; an unmatched request goes to the network."""
    fid = "concepts-mock-data-layer-request-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    row = 52
    cx, y, end = lifelines(c, t["heads"], [c.blue, c.orange, c.orange,
                                           c.orange, c.t["fg_dim"]],
                           body=40 + 6 * row + 48 + row)
    divider(c, y - 16, t["matched"])
    y += 40
    hops = [(0, 1), (1, 2), (2, 3), (3, 2), (2, 1), (1, 0)]
    for k, ((a, b), label) in enumerate(zip(hops, t["m"])):
        col = c.blue if b > a else c.green
        message(c, cx, a, b, y, label, col)
        y += row
    divider(c, y - 8, t["unmatched"])
    y += 48
    fg = c.t["fg_dim"]
    message(c, cx, 0, 1, y, t["u"][0], c.blue)
    y += row
    message(c, cx, 1, 4, y, t["u"][1], fg)
    save(c, f"{fid}.{lang}")


def fig_form_derivation_chain(lang):
    """Contract -> hooks -> form hooks, with the three hooks form hooks use."""
    fid = "concepts-form-derivation-chain"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    g = 70
    w1, w2 = 280, 330
    w3 = CONTENT_W - w1 - w2 - 2 * g
    x1, x2 = X0, X0 + w1 + g
    x3 = x2 + w2 + g
    top = 30
    iw2 = w2 - 2 * PAD
    ph = card_h(iw2, t["hooks"][0])
    hm = card_h(iw2, None, [t["more"]])
    vg = 12
    nh = len(t["hooks"])
    yin = top + CHIP
    zh = CHIP + nh * (ph + vg) + hm + PAD
    zone(c, x2, top, w2, zh, c.blue, t["z2"])
    used = {"useGet", "useCreate", "useUpdate"}
    pos = {}
    for i, name in enumerate(t["hooks"]):
        yy = yin + i * (ph + vg)
        acc = c.blue if name in used else c.t["fg_dim"]
        pos[name] = card(c, x2 + PAD, yy, iw2, acc, name, h=ph,
                         sw=STROKE if name in used else HAIRLINE)
    card(c, x2 + PAD, yin + nh * (ph + vg), iw2, c.t["fg_dim"], None,
         [t["more"]], dash=DASH_OUTSIDE)
    # the contract zone sits level with the middle of the hooks
    hc = card_h(w1 - 2 * PAD, *t["contract"])
    zc = CHIP + hc + PAD
    tc = top + zh / 2 - zc / 2
    yc = zone(c, x1, tc, w1, zc, c.purple, t["z1"])
    card(c, x1 + PAD, yc, w1 - 2 * PAD, c.purple, *t["contract"])
    fg = c.t["fg_dim"]
    arrow(c, x1 + w1, yc + hc / 2, x2, yc + hc / 2, fg)
    # form hooks sit level with the hooks they read
    cr, up, gt = pos["useCreate"], pos["useUpdate"], pos["useGet"]
    fx, fw = x3 + PAD, w3 - 2 * PAD
    zone(c, x3, cr[1] - CHIP, w3, up[1] + ph + PAD - cr[1] + CHIP, c.green,
         t["z3"])
    card(c, fx, cr[1], fw, c.green, t["forms"][0], h=ph, sw=STROKE)
    card(c, fx, up[1], fw, c.green, t["forms"][1], h=ph, sw=STROKE)
    ax = x2 + w2 - PAD
    arrow(c, ax, cr[1] + ph / 2, fx, cr[1] + ph / 2, c.green)
    arrow(c, ax, up[1] + ph / 2, fx, up[1] + ph / 2, c.green)
    # useGet joins the useUpdate route before the box
    mx = x2 + w2 + g / 2
    c.path(f"M{ax},{gt[1] + ph / 2} H{mx} V{up[1] + ph / 2}", color=c.green,
           sw=STROKE, marker=None)
    note(c, X0, top + zh + 26, CONTENT_W, t["verdict"], c.green)
    save(c, f"{fid}.{lang}")


def fig_authentication_fetch_flow(lang):
    """The wrapper's loop: headers, base fetch, 401 -> refresh -> retry."""
    fid = "concepts-authentication-fetch-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    n, g = 3, 80
    w = (CONTENT_W - (n - 1) * g) / n
    xs = [X0 + i * (w + g) for i in range(n)]
    cxs = [x + w / 2 for x in xs]
    fg = c.t["fg_dim"]
    top = 30
    keys = ("headers", "fetch", "resp")
    h1 = max(card_h(w, *t[k]) for k in keys)
    for i, k in enumerate(keys):
        card(c, xs[i], top, w, c.green if k == "resp" else c.blue, *t[k], h=h1)
    ym = top + h1 / 2
    arrow(c, xs[0] + w, ym, xs[1], ym, fg)
    arrow(c, xs[1] + w, ym, xs[2], ym, c.green)
    edge_label(c, xs[1] + w + g / 2, ym - 22, t["ok"], c.green, pill=False)
    # second row: refresh, decision, thrown error
    y2 = top + h1 + 90
    row2 = ("refresh", "is401", "throw")
    h2 = max(card_h(w, *t[k]) for k in row2)
    accs = (c.orange, c.orange, c.red)
    for i, k in enumerate(row2):
        card(c, xs[i], y2, w, accs[i], *t[k], h=h2,
             sw=STROKE if k == "is401" else HAIRLINE)
    arrow(c, cxs[1], top + h1, cxs[1], y2, c.orange)
    edge_label(c, cxs[1] + 40, top + h1 + 45, t["err"], c.orange, pill=False)
    yd = y2 + h2 / 2
    arrow(c, xs[1], yd, xs[0] + w, yd, c.orange)
    edge_label(c, xs[0] + w + g / 2, yd - 22, t["yes"], c.orange, pill=False)
    arrow(c, xs[1] + w, yd, xs[2], yd, c.red)
    edge_label(c, xs[1] + w + g / 2, yd - 22, t["no"], c.red, pill=False)
    # refresh succeeded: back to collecting headers
    arrow(c, cxs[0], y2, cxs[0], top + h1, c.blue)
    lw = tw(t["retry"], BODY) / 2 + 16
    edge_label(c, cxs[0] + lw, top + h1 + 45, t["retry"], c.blue, size=BODY,
               pill=False)
    # refresh failed
    y3 = y2 + h2 + 70
    h3 = card_h(w, *t["fail"])
    card(c, xs[0], y3, w, c.red, *t["fail"], h=h3)
    arrow(c, cxs[0], y2 + h2, cxs[0], y3, c.red)
    edge_label(c, cxs[0] + tw(t["refused"], BODY) / 2 + 16, y2 + h2 + 35,
               t["refused"], c.red, pill=False, size=BODY)
    save(c, f"{fid}.{lang}")


@figure(plain=True)
def fig_authentication_single_flight(lang):
    """Three 401s, one refresh call, three retries when it resolves."""
    fid = "concepts-authentication-single-flight"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    row = 52
    fg = c.t["fg_dim"]
    cx, y, end = lifelines(c, t["heads"], [c.blue, c.blue, c.blue, c.orange,
                                           fg], body=5 * row + 40)
    message(c, cx, 0, 3, y, t["m"][0], c.blue)
    y += row
    message(c, cx, 3, 4, y, t["m"][1], c.orange)
    y += row
    message(c, cx, 1, 3, y, t["m"][2], c.blue)
    y += row
    message(c, cx, 2, 3, y, t["m"][3], c.blue)
    y += row
    message(c, cx, 4, 3, y, t["m"][4], c.green)
    y += row
    for k in (0, 1, 2):
        arrow(c, cx[3], y + k * 20, cx[k], y + k * 20, c.green)
    edge_label(c, (cx[1] + cx[3]) / 2, y - 22, t["resume"], c.green,
               size=BODY)
    save(c, f"{fid}.{lang}")


def fig_extensions_provider_pattern(lang):
    """Application -> core interfaces <- extensions: two implement an interface, the CLI plugin registers with the CLI."""
    fid = "concepts-extensions-provider-pattern"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    wa, g = 170, 96
    wcol = (CONTENT_W - wa - 2 * g) / 2
    xa = X0
    xc = xa + wa + g
    xe = xc + wcol + g
    top = 30
    vg = 16
    iw = wcol - 2 * PAD
    hs = [max(card_h(iw, *core), card_h(iw, *ext)) for core, ext in t["rows"]]
    zh = CHIP + sum(hs) + vg * (len(hs) - 1) + PAD
    y = zone(c, xc, top, wcol, zh, c.blue, t["core"])
    zone(c, xe, top, wcol, zh, c.orange, t["ext"])
    # the application sees only the core column
    ha = card_h(wa, *t["app"])
    ya = top + zh / 2 - ha / 2
    card(c, xa, ya, wa, c.purple, *t["app"], sw=STROKE)
    fg = c.t["fg_dim"]
    arrow(c, xa + wa, top + zh / 2, xc, top + zh / 2, fg)
    edge_label(c, xa + wa + g / 2, top + zh / 2 - 22, t["uses"], fg, pill=False)
    for i, ((core, ext), h) in enumerate(zip(t["rows"], hs)):
        card(c, xc + PAD, y, iw, c.blue, *core, h=h)
        card(c, xe + PAD, y, iw, c.orange, *ext, h=h)
        ym = y + h / 2
        arrow(c, xe + PAD, ym, xc + wcol - PAD, ym, c.orange)
        edge_label(c, xc + wcol + g / 2, ym - 22, t["impls"][i], c.orange,
                   pill=False)
        y += h + vg
    save(c, f"{fid}.{lang}")

for _lang in LANGS:
    fig_api_contracts_structure(_lang)
    fig_cache_invalidation_key_hierarchy(_lang)
    fig_mock_data_layer_request_flow(_lang)
    fig_form_derivation_chain(_lang)
    fig_authentication_fetch_flow(_lang)
    fig_authentication_single_flight(_lang)
    fig_extensions_provider_pattern(_lang)
