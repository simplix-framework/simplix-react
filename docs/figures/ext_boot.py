"""Figures for the simplix-boot extension READMEs (extensions/README.md and
extensions/simplix-boot/**/README.md).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP_RISE, HAIRLINE, PAD, SANS, STROKE, THICK,
                    canvas, card, card_h, cards_row, edge_label, note, pill,
                    save, stack_behind, zone)

LANGS = ("en", "ko")

LABELS = {
    "pkg-extensions-architecture": {
        "en": {
            "app": ("Application code", ["imports the interfaces of the core packages"]),
            "core": "Core packages (packages/)",
            "access": ("AccessAdapter", ["@simplix-react/access"]),
            "auth": ("TokenPair · AuthScheme", ["@simplix-react/auth"]),
            "ext": "Extensions (extensions/)",
            "boot": ("simplix-boot", ["Spring Boot backend",
                                      "createSpringAccessAdapter · createBootAuth"]),
            "native": ("native", ["React Native, Expo",
                                  "mobile UI kit and runtime on the core packages"]),
            "depends": "depends on",
            "implements": "implements",
            "builds": "builds on",
        },
        "ko": {
            "app": ("애플리케이션 코드", ["핵심 패키지의 인터페이스만 가져옴"]),
            "core": "핵심 패키지(packages/)",
            "access": ("AccessAdapter", ["@simplix-react/access"]),
            "auth": ("TokenPair · AuthScheme", ["@simplix-react/auth"]),
            "ext": "확장(extensions/)",
            "boot": ("simplix-boot", ["Spring Boot 백엔드",
                                      "createSpringAccessAdapter · createBootAuth"]),
            "native": ("native", ["React Native, Expo",
                                  "핵심 패키지 위의 모바일 UI 키트와 런타임"]),
            "depends": "의존",
            "implements": "구현",
            "builds": "기반으로 사용",
        },
    },
    "pkg-simplix-boot-endpoint-mapping": {
        "en": {
            "cols": ["Spring Security API", "@simplix-react-ext/",
                     "simplix-react"],
            "auth_eps": ["POST /auth/token/issue", "POST /auth/token/refresh",
                         "POST /auth/token/revoke", "GET /user/me"],
            "access_eps": ["GET /user/me/permissions",
                           "GET /public/user/permissions"],
            "auth_pkg": ("simplix-boot-auth",
                         ["createBootAuth"]),
            "access_pkg": ("simplix-boot-access",
                           ["createSpringAccessAdapter",
                            "createBootAccessPolicy"]),
            "auth_if": ("AuthInstance", ["@simplix-react/auth"]),
            "access_if": ("AccessAdapter · AccessPolicy",
                          ["@simplix-react/access"]),
        },
        "ko": {
            "cols": ["Spring Security API", "@simplix-react-ext/",
                     "simplix-react"],
            "auth_eps": ["POST /auth/token/issue", "POST /auth/token/refresh",
                         "POST /auth/token/revoke", "GET /user/me"],
            "access_eps": ["GET /user/me/permissions",
                           "GET /public/user/permissions"],
            "auth_pkg": ("simplix-boot-auth",
                         ["createBootAuth"]),
            "access_pkg": ("simplix-boot-access",
                           ["createSpringAccessAdapter",
                            "createBootAccessPolicy"]),
            "auth_if": ("AuthInstance", ["@simplix-react/auth"]),
            "access_if": ("AccessAdapter · AccessPolicy",
                          ["@simplix-react/access"]),
        },
    },
    "pkg-simplix-boot-auth-fetch-layers": {
        "en": {
            "mutator": "bootMutator: unwrapEnvelope → body",
            "auth": "auth.fetchFn: bearer token, 401 retry, proactive refresh",
            "base": ("baseFetch", ["createBootHttpFetch",
                                   "Boot error → ApiResponseError"]),
            "raw": ("rawAuthFetch", ["createFetch(rawFetchOptions)",
                                     "bearer token, 401 retry",
                                     "no Boot error handling"]),
            "refresh": ("refreshFn", ["POST /auth/token/refresh",
                                       "calls baseFetch directly"]),
            "server": "Spring Boot server",
        },
        "ko": {
            "mutator": "bootMutator: unwrapEnvelope → body",
            "auth": "auth.fetchFn: Bearer 토큰, 401 재시도, 만료 전 갱신",
            "base": ("baseFetch", ["createBootHttpFetch",
                                   "Boot 오류 → ApiResponseError"]),
            "raw": ("rawAuthFetch", ["createFetch(rawFetchOptions)",
                                     "Bearer 토큰, 401 재시도",
                                     "Boot 오류 처리 없음"]),
            "refresh": ("refreshFn", ["POST /auth/token/refresh",
                                       "baseFetch 직접 호출"]),
            "server": "Spring Boot 서버",
        },
    },
    "pkg-simplix-boot-cli-plugin-loading": {
        "en": {
            "steps": [
                ("simplix.config.ts", ["plugins", "openapi[].profile"]),
                ("simplix openapi", ["imports every package in plugins"]),
                ("@simplix-react-ext/simplix-boot-cli-plugin",
                 ["import runs registerPlugin and registerSchemaAdapter"]),
                ("getSpecProfile(\"simplix-boot\")", ["profile lookup"]),
                ("Generate domain package", ["boot response adapter"]),
            ],
            "reg": ["registerPlugin: profile simplix-boot, response adapter boot",
                    "registerSchemaAdapter(bootSchemaAdapter)"],
            "error": "profile not loaded → error, exit 1",
        },
        "ko": {
            "steps": [
                ("simplix.config.ts", ["plugins", "openapi[].profile"]),
                ("simplix openapi", ["plugins의 패키지를 하나씩 가져옴"]),
                ("@simplix-react-ext/simplix-boot-cli-plugin",
                 ["가져오는 순간 registerPlugin과 registerSchemaAdapter 실행"]),
                ("getSpecProfile(\"simplix-boot\")", ["프로필 조회"]),
                ("도메인 패키지 생성", ["boot 응답 어댑터 적용"]),
            ],
            "reg": ["registerPlugin: 프로필 simplix-boot",
                    "registerPlugin: 응답 어댑터 boot",
                    "registerSchemaAdapter(bootSchemaAdapter)"],
            "error": "프로필 없음 → 오류 종료",
        },
    },
    "pkg-simplix-boot-stream-connection": {
        "en": {
            "actors": ["useStreamSubscription", "StreamProvider",
                       "Spring Boot server"],
            "subscribe": "register resource subscriptions",
            "connect": "GET /api/stream/connect (EventSource, optional ticket)",
            "connected": "connected event {sessionId}",
            "sync": "PUT /api/stream/sessions/:id/subscriptions {subscriptions}",
            "data": "data event {resource, payload}",
            "dispatch": "to the hooks of that resource",
            "heartbeat": "heartbeat → lastHeartbeat",
            "reconnect": "reconnect with backoff 1s → 10s",
            "verdict": "One EventSource and one sync request serve every subscribed hook",
        },
        "ko": {
            "actors": ["useStreamSubscription", "StreamProvider",
                       "Spring Boot 서버"],
            "subscribe": "리소스 구독 등록",
            "connect": "GET /api/stream/connect(EventSource, 선택적 티켓)",
            "connected": "connected 이벤트 {sessionId}",
            "sync": "PUT /api/stream/sessions/:id/subscriptions {subscriptions}",
            "data": "data 이벤트 {resource, payload}",
            "dispatch": "해당 리소스를 구독한 훅에 전달",
            "heartbeat": "하트비트 → lastHeartbeat",
            "reconnect": "백오프 재연결 1초 → 10초",
            "verdict": "EventSource 하나와 동기화 요청 하나를 구독한 모든 훅이 공유",
        },
    },
}


def fig_extensions_architecture(lang):
    """App code depends on core interfaces; extensions implement or build on them."""
    fid = "pkg-extensions-architecture"
    t = LABELS[fid][lang]
    c = canvas(1200, 800)
    left, right = 24, 1176
    W = right - left
    fg = c.t["fg_dim"]
    blue, green, purple = c.t["blue"], c.t["green"], c.t["purple"]
    top = 20
    ha = card_h(W, *t["app"])
    card(c, left, top, W, blue, *t["app"], h=ha)

    zgap = 80
    ztop = top + ha + zgap
    zpad = 18
    iw = (W - 2 * zpad - 40) / 2
    hi = max(card_h(iw, *t[k]) for k in ("access", "auth"))
    iy = ztop + CHIP_RISE + PAD
    zone(c, left, ztop, W, iy + hi + zpad - ztop, green, t["core"])
    ba = card(c, left + zpad, iy, iw, green, *t["access"], h=hi, sw=STROKE)
    bt = card(c, left + zpad + iw + 40, iy, iw, green, *t["auth"], h=hi,
              sw=STROKE)
    zbot = iy + hi + zpad

    etop = zbot + zgap
    ey = etop + CHIP_RISE + PAD
    he = max(card_h(iw, *t[k]) for k in ("boot", "native"))
    zone(c, left, etop, W, ey + he + zpad - etop, purple, t["ext"])
    bb = card(c, left + zpad, ey, iw, purple, *t["boot"], h=he)
    bn = card(c, left + zpad + iw + 40, ey, iw, purple, *t["native"], h=he)

    # app -> interfaces
    for (x, y, w, h) in (ba, bt):
        cx = x + w * 0.7
        c.line(cx, top + ha, cx, y, color=fg, sw=STROKE, marker=fg)
        edge_label(c, cx, (top + ha + ztop) / 2, t["depends"], fg)
    # simplix-boot implements both interfaces
    bx = bb[0] + bb[2] * 0.7
    c.line(bx, ey, bx, ba[1] + ba[3], color=purple, sw=THICK, marker=purple)
    edge_label(c, bx, (zbot + etop) / 2, t["implements"], purple)
    c.path(f"M{bb[0] + bb[2] * 0.92},{ey} V{(zbot + etop) / 2} "
           f"H{bt[0] + bt[2] * 0.2} V{bt[1] + bt[3]}", color=purple,
           sw=THICK, marker=purple)
    nx = bn[0] + bn[2] * 0.7
    c.line(nx, ey, nx, bt[1] + bt[3], color=fg, sw=STROKE, marker=fg)
    edge_label(c, nx, (zbot + etop) / 2, t["builds"], fg)
    save(c, f"{fid}.{lang}")


def fig_endpoint_mapping(lang):
    """Each Boot endpoint group is read by one package into one core interface."""
    fid = "pkg-simplix-boot-endpoint-mapping"
    t = LABELS[fid][lang]
    c = canvas(1200, 800)
    left, right = 24, 1176
    fg = c.t["fg_dim"]
    blue, green, orange = c.t["blue"], c.t["green"], c.t["orange"]
    gap = 56
    w1 = 330
    w2 = w3 = (right - left - w1 - 2 * gap) / 2
    x1, x2 = left, left + w1 + gap
    x3 = x2 + w2 + gap
    for x, w, s in zip((x1, x2, x3), (w1, w2, w3), t["cols"]):
        c.text(x, 36, s, size=BODY, color=c.t["fg"], family=SANS, weight=700)
    ph, pg = 40, 12
    y = 60
    rows = []
    groups = (("auth_eps", "auth_pkg", "auth_if", blue),
              ("access_eps", "access_pkg", "access_if", green))
    for gi, (ek, pk, ik, col) in enumerate(groups):
        ys = []
        for ep in t[ek]:
            pill(c, x1, y, w1, ph, ep, col, rx=8, size=BODY)
            ys.append(y + ph / 2)
            y += ph + pg
        gtop, gbot = ys[0] - ph / 2, ys[-1] + ph / 2
        hp = card_h(w2, *t[pk])
        hi = card_h(w3, *t[ik])
        hh = max(hp, hi)
        cy = (gtop + gbot) / 2 - hh / 2
        bp = card(c, x2, cy, w2, col, *t[pk], h=hh, sw=STROKE)
        bi = card(c, x3, cy, w3, col, *t[ik], h=hh)
        mx = x1 + w1 + gap / 2
        for yy in ys:
            c.path(f"M{x1 + w1},{yy} H{mx}", color=col, sw=STROKE, marker=None)
        c.line(mx, ys[0], mx, ys[-1], color=col, sw=STROKE, marker=None)
        c.line(mx, cy + hh / 2, x2, cy + hh / 2, color=col, sw=STROKE,
               marker=col)
        c.line(x2 + w2, cy + hh / 2, x3, cy + hh / 2, color=col, sw=THICK,
               marker=col)
        y = max(y, cy + hh) + 28
    save(c, f"{fid}.{lang}")


def fig_auth_fetch_layers(lang):
    """bootMutator wraps auth.fetchFn wraps baseFetch; refresh skips the auth layer."""
    fid = "pkg-simplix-boot-auth-fetch-layers"
    t = LABELS[fid][lang]
    c = canvas(1200, 800)
    left, right = 24, 1176
    fg = c.t["fg_dim"]
    blue, orange, purple = c.t["blue"], c.t["orange"], c.t["purple"]
    zw = 740
    zp = 22
    top = 20
    y2 = top + CHIP_RISE + zp + CHIP_RISE
    y3 = y2 + CHIP_RISE + zp
    bw = zw - 4 * zp
    hb = card_h(bw, *t["base"])
    inner_bot = y3 + hb + zp
    outer_bot = inner_bot + zp
    zone(c, left, top, zw, outer_bot - top, purple, t["mutator"])
    zone(c, left + zp, y2, zw - 2 * zp, inner_bot - y2, blue, t["auth"])
    bb = card(c, left + 2 * zp, y3, bw, orange, *t["base"], h=hb, sw=STROKE)

    sx = left + zw + 64
    sw_ = right - sx
    hs = card_h(sw_, *t["refresh"])
    ry = bb[1] + bb[3] / 2
    br = card(c, sx, ry - hs / 2, sw_, orange, *t["refresh"], h=hs)
    # refreshFn goes straight to baseFetch, past the auth layer
    c.line(sx, ry, bb[0] + bb[2], ry, color=orange, sw=THICK, marker=orange)

    hr = card_h(sw_, *t["raw"])
    sy = br[1] + br[3] + 40
    card(c, sx, sy, sw_, blue, *t["raw"], h=hr)
    # both reach the server
    py = max(outer_bot, sy + hr) + 40
    pill(c, left, py, right - left, 44, t["server"], fg, rx=8)
    c.line(left + zw / 2, outer_bot, left + zw / 2, py, color=fg, sw=STROKE,
           marker=fg)
    c.line(sx + sw_ / 2, sy + hr, sx + sw_ / 2, py, color=fg, sw=STROKE,
           marker=fg)
    save(c, f"{fid}.{lang}")


def fig_cli_plugin_loading(lang):
    """Plugins load and register their profile before the profile is looked up."""
    fid = "pkg-simplix-boot-cli-plugin-loading"
    t = LABELS[fid][lang]
    c = canvas(1200, 800)
    left, right = 24, 1176
    fg = c.t["fg_dim"]
    blue, green, red, purple = c.t["blue"], c.t["green"], c.t["red"], c.t["purple"]
    steps = t["steps"]
    gap = 48
    ws = [270, 290]
    ws.append(right - left - sum(ws) - 2 * gap)
    xs = [left, left + ws[0] + gap, left + ws[0] + ws[1] + 2 * gap]
    top = 20
    cols = (blue, blue, purple)
    h1 = max(card_h(ws[i], *steps[i]) for i in range(3))
    boxes = []
    for i in range(3):
        boxes.append(card(c, xs[i], top, ws[i], cols[i], *steps[i],
                          h=h1, sw=STROKE if i == 2 else HAIRLINE))
    w = ws[2]
    for i in range(2):
        x, y, bw, bh = boxes[i]
        c.line(x + bw, y + bh / 2, boxes[i + 1][0], y + bh / 2, color=fg,
               sw=STROKE, marker=fg)
    # what the import registers, under the plugin card
    x, y, bw, bh = boxes[2]
    ny = y + bh + 40
    nb = card(c, x, ny, bw, purple, None, t["reg"])
    c.line(x + bw / 2, y + bh, x + bw / 2, ny, color=purple, sw=STROKE,
           marker=purple)
    # lookup and generation on the second row, right to left
    y2 = ny + nb[3] + 40
    h2 = max(card_h(w, *steps[3]), card_h(ws[1], *steps[4]),
             card_h(ws[0], None, [t["error"]], align="middle"))
    bl = card(c, x, y2, w, green, *steps[3], h=h2, sw=STROKE)
    bg = card(c, xs[1], y2, ws[1], green, *steps[4], h=h2)
    c.line(x + bw / 2, ny + nb[3], x + bw / 2, y2, color=fg, sw=STROKE,
           marker=fg)
    c.line(x, y2 + h2 / 2, bg[0] + bg[2], y2 + h2 / 2, color=green, sw=THICK,
           marker=green)
    # error branch
    ex = left
    ew = ws[0]
    eb = card(c, ex, y2, ew, red, None, [t["error"]], h=h2, align="middle",
              valign="middle")
    c.path(f"M{x + bw / 2},{y2 + h2} V{y2 + h2 + 34} H{ex + ew / 2} "
           f"V{y2 + h2}", color=red, sw=STROKE, marker=red)
    save(c, f"{fid}.{lang}")


def message(c, xs, a, b, y, text, color, sw=STROKE):
    """A message arrow between two lifelines with its label above it."""
    x1, x2 = xs[a], xs[b]
    c.line(x1, y, x2, y, color=color, sw=sw, marker=color)
    c.text((x1 + x2) / 2, y - 9, text, size=BODY, color=c.t["fg"],
           family=SANS, weight=600, anchor="middle", mask=True)


def fig_stream_connection(lang):
    """One connection, one session, one sync request; events fan out to hooks."""
    fid = "pkg-simplix-boot-stream-connection"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    left, right = 24, 1176
    blue, green, orange, purple = (c.t["blue"], c.t["green"], c.t["orange"],
                                   c.t["purple"])
    fg = c.t["fg_dim"]
    xs = [left + 160, 600, right - 160]
    hw = 300
    heads = [dict(lines=[(s, c.t["fg"], 700)], bullet=False, align="middle",
                  valign="middle") for s in t["actors"]]
    head_h = max(card_h(hw, None, h["lines"], bullet=False) for h in heads)
    top = 20
    # several hooks: stacked sheets behind the first head
    stack_behind(c, xs[0] - hw / 2, top, hw, head_h, blue)
    cards_row(c, [x - hw / 2 for x in xs], top, hw, heads, blue)
    step = 50
    order = ["subscribe", "connect", "connected", "sync", "data", "dispatch",
             "heartbeat", "reconnect"]
    rows = {}
    y = top + head_h + 50
    for k in order:
        rows[k] = y
        y += step
    bottom = y - step + 22
    for x in xs:
        c.line(x, top + head_h, x, bottom, color=c.t["line"], sw=HAIRLINE,
               marker=None)
    message(c, xs, 0, 1, rows["subscribe"], t["subscribe"], fg)
    message(c, xs, 1, 2, rows["connect"], t["connect"], blue, sw=THICK)
    message(c, xs, 2, 1, rows["connected"], t["connected"], blue)
    message(c, xs, 1, 2, rows["sync"], t["sync"], green, sw=THICK)
    message(c, xs, 2, 1, rows["data"], t["data"], purple)
    message(c, xs, 1, 0, rows["dispatch"], t["dispatch"], purple, sw=THICK)
    message(c, xs, 2, 1, rows["heartbeat"], t["heartbeat"], fg)
    message(c, xs, 1, 2, rows["reconnect"], t["reconnect"], orange)
    note(c, left, bottom + 20, right - left, t["verdict"], blue)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_extensions_architecture(_lang)
    fig_endpoint_mapping(_lang)
    fig_auth_fetch_layers(_lang)
    fig_cli_plugin_loading(_lang)
    fig_stream_connection(_lang)
