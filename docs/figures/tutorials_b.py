"""Figures for the tutorials, set B (docs/en/tutorials, docs/ko/tutorials).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP_RISE, CONTENT_W, HAIRLINE, PAD, STROKE,
                    canvas, card, card_h, edge_label, figure, save, zone)

LANGS = ("en", "ko")
X0 = 28
RIGHT = X0 + CONTENT_W
CHIP = CHIP_RISE + PAD

LABELS = {
    "tutorials-auth-protected-app-flow": {
        "en": {
            "heads": [("LoginPage", ["Navbar", "useAuth()"]),
                      ("auth instance", ["createAuth()",
                                         "localStorageStore"]),
                      ("ProtectedRoute", ["route guard"]),
                      ("projectApi", ["auth.fetchFn"]),
                      ("API server", ["login · refresh", "project data"])],
            "signin": "sign-in",
            "s": ["POST /login with plain fetch", "tokens",
                  "login(tokens) → setTokens", "notify subscribers"],
            "request": "authenticated request",
            "r": ["Authorization: Bearer header", "401",
                  "refreshFn(): refresh endpoint", "setTokens(new tokens)",
                  "retry once with the new token"],
            "signout": "sign-out",
            "o": ["logout() → clear()", "notify subscribers",
                  "redirect to /login"],
        },
        "ko": {
            "heads": [("LoginPage", ["Navbar", "useAuth()"]),
                      ("인증 인스턴스", ["createAuth()",
                                         "localStorageStore"]),
                      ("ProtectedRoute", ["라우트 가드"]),
                      ("projectApi", ["auth.fetchFn"]),
                      ("API 서버", ["로그인 · 갱신", "프로젝트 데이터"])],
            "signin": "로그인",
            "s": ["일반 fetch로 POST /login", "토큰",
                  "login(tokens) → setTokens", "구독자에게 알림"],
            "request": "인증된 요청",
            "r": ["Authorization: Bearer 헤더", "401",
                  "refreshFn(): 갱신 엔드포인트", "setTokens(새 토큰)",
                  "새 토큰으로 한 번 재시도"],
            "signout": "로그아웃",
            "o": ["logout() → clear()", "구독자에게 알림",
                  "/login으로 이동"],
        },
    },
    "tutorials-petstore-openapi-domains-modules": {
        "en": {
            "mods": "modules/ (FSD layer)",
            "doms": "packages/ (domain layer)",
            "m": [("sample-petstore-store", ["features/ · widgets/"]),
                  ("sample-petstore-user", ["features/ · widgets/"])],
            "d": [("sample-petstore-domain-pet", ["hooks · models · mock handlers"]),
                  ("sample-petstore-domain-store", ["hooks · models · mock handlers"]),
                  ("sample-petstore-domain-user", ["hooks · models · mock handlers"])],
            "dep": "workspace:* dependency",
        },
        "ko": {
            "mods": "modules/(FSD 계층)",
            "doms": "packages/(도메인 계층)",
            "m": [("sample-petstore-store", ["features/ · widgets/"]),
                  ("sample-petstore-user", ["features/ · widgets/"])],
            "d": [("sample-petstore-domain-pet", ["훅 · 모델 · 목 핸들러"]),
                  ("sample-petstore-domain-store", ["훅 · 모델 · 목 핸들러"]),
                  ("sample-petstore-domain-user", ["훅 · 모델 · 목 핸들러"])],
            "dep": "workspace:* 의존성",
        },
    },
    "tutorials-petstore-openapi-pipeline": {
        "en": {
            "steps": [("petstore.json", ["OpenAPI spec"]),
                      ("simplix.config.ts", ["openapi[].domains",
                                             "tags per domain"]),
                      ("simplix add-domain", ["package skeleton"]),
                      ("simplix openapi", ["Orval per domain package"])],
            "zone": "domain package",
            "files": [("src/mutator.ts", ["calls getMutator()"]),
                      ("src/generated/model", ["models"]),
                      ("src/generated/endpoints", ["React Query hooks"]),
                      ("src/hooks/<entity>.ts", ["re-exported hooks"]),
                      ("src/generated/mock/handlers.ts", ["src/mock/index.ts",
                                                          "mock handlers"])],
            "mod": ("FSD module features/", ["simplix add-module",
                                             "imports the hooks"]),
            "app": ("app main.tsx", ["configureMutator()",
                                     "@simplix-react/api"]),
            "writes": "writes",
        },
        "ko": {
            "steps": [("petstore.json", ["OpenAPI 명세"]),
                      ("simplix.config.ts", ["openapi[].domains",
                                             "도메인별 태그"]),
                      ("simplix add-domain", ["패키지 기본 구조"]),
                      ("simplix openapi", ["도메인별 Orval 실행"])],
            "zone": "도메인 패키지",
            "files": [("src/mutator.ts", ["getMutator() 호출"]),
                      ("src/generated/model", ["모델"]),
                      ("src/generated/endpoints", ["React Query 훅"]),
                      ("src/hooks/<entity>.ts", ["훅 다시 내보내기"]),
                      ("src/generated/mock/handlers.ts", ["src/mock/index.ts",
                                                          "목 핸들러"])],
            "mod": ("FSD 모듈 features/", ["simplix add-module",
                                           "훅 가져오기"]),
            "app": ("앱 main.tsx", ["configureMutator()",
                                    "@simplix-react/api"]),
            "writes": "생성",
        },
    },
}


def arrow(c, x1, y1, x2, y2, color):
    c.line(x1, y1, x2, y2, color=color, sw=STROKE, marker=color)


def fig_auth_flow(lang):
    """Sign-in, a request with one refresh and retry, sign-out."""
    fid = "tutorials-auth-protected-app-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 1400)
    heads = t["heads"]
    n = len(heads)
    gap = 14
    w = (CONTENT_W - (n - 1) * gap) / n
    xs = [X0 + i * (w + gap) for i in range(n)]
    cx = [x + w / 2 for x in xs]
    top = 30
    h = max(card_h(w, *hd) for hd in heads)
    row = 50
    plan = [("d", t["signin"]), ("m", 0, 4, t["s"][0], c.blue),
            ("m", 4, 0, t["s"][1], c.green), ("m", 0, 1, t["s"][2], c.blue),
            ("m", 1, 2, t["s"][3], c.purple),
            ("d", t["request"]), ("m", 3, 4, t["r"][0], c.blue),
            ("m", 4, 3, t["r"][1], c.red), ("m", 3, 4, t["r"][2], c.orange),
            ("m", 3, 1, t["r"][3], c.orange), ("m", 3, 4, t["r"][4], c.blue),
            ("d", t["signout"]), ("m", 0, 1, t["o"][0], c.blue),
            ("m", 1, 2, t["o"][1], c.purple), ("m", 2, 0, t["o"][2], c.red)]
    y = top + h + 20
    rows = []
    for step in plan:
        if step[0] == "d":
            y += 34
            rows.append((y, step))
            y += 4
        else:
            y += row
            rows.append((y, step))
    end = y + 24
    for x in cx:
        c.line(x, top + h, x, end, color=c.t["line"], sw=HAIRLINE, marker=None)
    for i, (title, lines) in enumerate(heads):
        card(c, xs[i], top, w, c.t["fg_dim"], title, lines, h=h,
             align="middle")
    for yy, step in rows:
        if step[0] == "d":
            c.line(X0, yy, RIGHT, yy, color=c.t["line"], sw=HAIRLINE,
                   marker=None)
            edge_label(c, X0 + CONTENT_W / 2, yy, step[1], c.t["fg_dim"],
                       size=BODY)
        else:
            _, a, b, label, col = step
            arrow(c, cx[a], yy, cx[b], yy, col)
            lx = (cx[a] + cx[b]) / 2
            edge_label(c, lx, yy - 19, label, col, size=BODY)
    save(c, f"{fid}.{lang}")


@figure(plain=True)
def fig_domains_modules(lang):
    """Two layers; each module depends on the domain packages it uses."""
    fid = "tutorials-petstore-openapi-domains-modules"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    zp = 20
    g = 24
    top = 30
    iw = CONTENT_W - 2 * zp
    w = (iw - 2 * g) / 3
    xs = [X0 + zp + k * (w + g) for k in range(3)]
    hm = max(card_h(w, *m) for m in t["m"])
    hd = max(card_h(w, *d) for d in t["d"])
    zh1 = CHIP + hm + zp
    # the store module sits between the two packages it uses
    xm = [(xs[0] + xs[1]) / 2, xs[2]]
    y = zone(c, xm[0] - zp, top, RIGHT - xm[0] + zp, zh1, c.green, t["mods"])
    for k, m in enumerate(t["m"]):
        card(c, xm[k], y, w, c.green, *m, h=hm)
    yd0 = top + zh1 + 110
    yd = zone(c, X0, yd0, CONTENT_W, CHIP + hd + zp, c.blue, t["doms"])
    for k, d in enumerate(t["d"]):
        card(c, xs[k], yd, w, c.blue, *d, h=hd)
    fg = c.t["fg_dim"]
    yb = y + hm
    # each target sits under its module card, so every link drops straight
    links = [xs[0] + w * 0.85, xs[1] + w * 0.3, xs[2] + w / 2]
    mid = (yb + yd) / 2
    for tx in links:
        arrow(c, tx, yb, tx, yd, fg)
    edge_label(c, xs[2] + w / 2, mid - 2, t["dep"], fg, size=BODY)
    save(c, f"{fid}.{lang}")


def fig_pipeline(lang):
    """CLI steps on the left write the domain package; consumers on the right."""
    fid = "tutorials-petstore-openapi-pipeline"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    g = 64
    wl, wr = 300, 290
    wz = CONTENT_W - wl - wr - 2 * g
    xz = X0 + wl + g
    xr = xz + wz + g
    zp = 18
    top = 30
    vg = 14
    hf = [card_h(wz - 2 * zp, *f) for f in t["files"]]
    fy = [top + CHIP]
    for hh in hf[:-1]:
        fy.append(fy[-1] + hh + vg)
    zb = fy[-1] + hf[-1] + zp
    zone(c, xz, top, wz, zb - top, c.blue, t["zone"])
    fb = []
    for f, yy, hh in zip(t["files"], fy, hf):
        fb.append(card(c, xz + zp, yy, wz - 2 * zp, c.blue, *f, h=hh))
    # steps down the left column, spread over the zone's height
    hs = [card_h(wl, *s) for s in t["steps"]]
    sg = (zb - top - sum(hs)) / (len(hs) - 1)
    sy = [top]
    for hh in hs[:-1]:
        sy.append(sy[-1] + hh + sg)
    for k, (s, yy, hh) in enumerate(zip(t["steps"], sy, hs)):
        card(c, X0, yy, wl, c.purple, *s, h=hh, num=k + 1)
        if k:
            arrow(c, X0 + wl / 2, sy[k - 1] + hs[k - 1], X0 + wl / 2, yy,
                  c.purple)
    # add-domain writes the mutator; openapi writes the generated files
    ad = sy[2] + hs[2] / 2
    c.path(f"M{X0 + wl},{ad} H{xz - g / 2} V{fb[0][1] + fb[0][3] / 2} "
           f"H{xz + zp}", color=c.purple, sw=STROKE, marker=c.purple)
    op = sy[3] + hs[3] / 2
    arrow(c, X0 + wl, op, xz, op, c.purple)
    edge_label(c, X0 + wl + g / 2, op - 22, t["writes"], c.purple, pill=False)
    # consumers on the right
    hk = fb[3]
    hm = card_h(wr, *t["mod"])
    ym = hk[1] + hk[3] / 2 - hm / 2
    card(c, xr, ym, wr, c.green, *t["mod"], h=hm)
    arrow(c, xr, hk[1] + hk[3] / 2, xz + wz - zp, hk[1] + hk[3] / 2, c.green)
    mu = fb[0]
    ha = card_h(wr, *t["app"])
    ya = mu[1]
    card(c, xr, ya, wr, c.orange, *t["app"], h=ha)
    arrow(c, xr, mu[1] + mu[3] / 2, xz + wz - zp, mu[1] + mu[3] / 2, c.orange)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_auth_flow(_lang)
    fig_domains_modules(_lang)
    fig_pipeline(_lang)
