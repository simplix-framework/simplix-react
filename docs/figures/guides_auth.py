"""Figures for the authentication, authorization and internationalization guides
(docs/en/guides, docs/ko/guides).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP, CONTENT_W, HAIRLINE, STROKE, canvas, card, card_h,
                    edge_label, figure, note, row, save, tw)

LANGS = ("en", "ko")

LABELS = {
    "guides-authentication-refresh-retry": {
        "en": {
            "actors": ["Request A", "Request B", "RefreshManager",
                       "API server"],
            "subs": ["authFetch", "authFetch", "single-flight",
                     "issues tokens"],
            "req": "request",
            "r401": "401 response",
            "refresh": "refresh()",
            "wait": "awaits the same call",
            "exchange": "bearerScheme.refresh()",
            "pair": "new token pair",
            "done": "resolved",
            "retry": "retry with new token",
            "ok": "200 response",
            "fail": "Refresh fails: each waiting request calls onRefreshFailure "
                    "and throws the error",
        },
        "ko": {
            "actors": ["요청 A", "요청 B", "RefreshManager",
                       "API 서버"],
            "subs": ["authFetch", "authFetch", "한 번만 실행",
                     "토큰 발급"],
            "req": "요청",
            "r401": "401 응답",
            "refresh": "refresh()",
            "wait": "같은 호출을 대기",
            "exchange": "bearerScheme.refresh()",
            "pair": "새 토큰 쌍",
            "done": "완료",
            "retry": "새 토큰으로 재시도",
            "ok": "200 응답",
            "fail": "갱신 실패 시 대기 중인 요청마다 onRefreshFailure 호출 후 "
                    "오류 발생",
        },
    },
    "guides-authorization-auth-sync": {
        "en": {
            "mount": ("Mount", ["policy.rehydrate()",
                                'storage "simplix-access"']),
            "sync": "sync",
            "user": ("Signed in, new token", ["policy.update(accessToken)",
                                              "the user's rules"]),
            "public": ("Signed out", ["policy.clear()",
                                      "policy.loadPublicAccess()"]),
            "to_user": "signed in",
            "to_public": "signed out",
            "refresh": "token refreshed",
            "verdict": "auth.subscribe runs the same sync on every auth change",
        },
        "ko": {
            "mount": ("마운트", ["policy.rehydrate()",
                                '저장소 "simplix-access"']),
            "sync": "동기화",
            "user": ("로그인, 새 토큰", ["policy.update(accessToken)",
                                       "사용자 규칙"]),
            "public": ("로그아웃", ["policy.clear()",
                                  "policy.loadPublicAccess()"]),
            "to_user": "로그인",
            "to_public": "로그아웃",
            "refresh": "토큰 갱신",
            "verdict": "auth.subscribe가 인증 상태가 바뀔 때마다 같은 동기화를 실행",
        },
    },
    "guides-internationalization-resource-loading": {
        "en": {
            "app": ("appTranslations", ["import.meta.glob",
                                        "/locales/<ns>/<locale>.json"]),
            "mod": ("Module translations", ["buildModuleTranslations",
                                            "registerModuleTranslations"]),
            "dom": ("Domain translations", ["registerDomainTranslations"]),
            "ns_app": ("Namespace <ns>", ["one per JSON file"]),
            "ns_mod": ("<module>/<component>", ["one per component"]),
            "override": "same namespace: app keys win",
            "ns_dom": ("entity/<key> · enums", ["entity/<key> per entity"]),
            "adapter": ("I18nextAdapter", ["all namespaces, all locales"]),
            "ready": ("i18nReady", ["resolves after every load"]),
            "provider": ("I18nProvider", ["renders the app"]),
        },
        "ko": {
            "app": ("appTranslations", ["import.meta.glob",
                                        "/locales/<ns>/<locale>.json"]),
            "mod": ("모듈 번역", ["buildModuleTranslations",
                                 "registerModuleTranslations"]),
            "dom": ("도메인 번역 등록", ["registerDomainTranslations"]),
            "ns_app": ("네임스페이스 <ns>", ["JSON 파일마다 하나"]),
            "ns_mod": ("<module>/<component>", ["컴포넌트마다 하나"]),
            "override": "같은 네임스페이스: 앱 키 우선",
            "ns_dom": ("entity/<key> · enums", ["엔티티마다 entity/<key>"]),
            "adapter": ("I18nextAdapter", ["모든 로케일 · 네임스페이스"]),
            "ready": ("i18nReady", ["모든 로드가 끝나면 완료"]),
            "provider": ("I18nProvider", ["앱 렌더링"]),
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


@figure(plain=True)
def fig_refresh_retry(lang):
    """Two requests get 401, one refresh runs, both retry once."""
    fid = "guides-authentication-refresh-retry"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    blue, red, green, purple = c.blue, c.red, c.green, c.purple
    A, B, M, API = range(4)
    msgs = [
        (A, API, t["req"], blue), (API, A, t["r401"], red),
        (B, API, t["req"], blue), (API, B, t["r401"], red),
        (A, M, t["refresh"], purple), (B, M, t["wait"], purple),
        (M, API, t["exchange"], purple),
        (API, M, t["pair"], green), (M, A, t["done"], green),
        (M, B, t["done"], green),
        (A, API, t["retry"], blue), (API, A, t["ok"], green),
        (B, API, t["retry"], blue), (API, B, t["ok"], green),
    ]
    accents = [blue, blue, purple, c.t["line"]]
    bottom = sequence_board(c, 28, 30, t["actors"], t["subs"], accents, msgs)
    note(c, 28, bottom + 20, CONTENT_W, t["fail"], red)
    save(c, f"{fid}.{lang}")


def fig_auth_sync(lang):
    """The policy follows the auth instance: mount, then signed in or out."""
    fid = "guides-authorization-auth-sync"
    t = LABELS[fid][lang]
    c = canvas(1200, 600)
    fg = c.t["fg_dim"]
    x0, top = 28, 70
    wm, ws = 330, 400
    xs = x0 + CONTENT_W - ws
    hm = card_h(wm, *t["mount"])
    hs = max(card_h(ws, *t["user"]), card_h(ws, *t["public"]))
    gap_v = 110
    yu, yp = top, top + hs + gap_v
    bu = card(c, xs, yu, ws, c.green, *t["user"], h=hs)
    bp = card(c, xs, yp, ws, c.orange, *t["public"], h=hs)
    ym = (yu + yp + hs) / 2 - hm / 2
    bm = card(c, x0, ym, wm, c.blue, *t["mount"], h=hm)
    # sync fans out from mount to whichever state auth is in
    mx = x0 + wm
    jx = mx + (xs - mx) / 2
    my = ym + hm / 2
    for k, by in enumerate((yu + hs / 2, yp + hs / 2)):
        sy = ym + hm * (0.3 if k == 0 else 0.7)
        lane = jx + (-24 if k == 0 else 24)
        c.path(f"M{mx},{sy} H{lane} V{by} H{xs}", color=fg, sw=STROKE,
               marker=fg)
    edge_label(c, (mx + jx - 24) / 2, ym + hm * 0.3 - 18, t["sync"], fg,
               size=BODY, pill=False)
    # transitions between the two states, driven by auth.subscribe
    ax1, ax2 = xs + ws * 0.3, xs + ws * 0.7
    c.line(ax1, yu + hs, ax1, yp, color=c.orange, sw=STROKE, marker=c.orange)
    c.line(ax2, yp, ax2, yu + hs, color=c.green, sw=STROKE, marker=c.green)
    mid = yu + hs + gap_v / 2
    edge_label(c, ax1, mid, t["to_public"], c.orange, size=BODY)
    edge_label(c, ax2, mid, t["to_user"], c.green, size=BODY)
    # a refreshed token loops back into update
    lx = xs + ws * 0.5
    c.path(f"M{lx - 50},{yu} V{yu - 50} H{lx + 50} V{yu}", color=c.green,
           sw=STROKE, marker=c.green)
    tw_ = tw(t["refresh"], BODY)
    edge_label(c, lx - 50 - 12 - tw_ / 2, yu - 50, t["refresh"], c.green,
               size=BODY, pill=False)
    note(c, x0, yp + hs + 30, CONTENT_W, t["verdict"], c.blue)
    save(c, f"{fid}.{lang}")


def fig_resource_loading(lang):
    """Three sources, the namespace each yields, one adapter, then ready."""
    fid = "guides-internationalization-resource-loading"
    t = LABELS[fid][lang]
    c = canvas(1200, 700)
    fg = c.t["fg_dim"]
    x0, top, gap = 28, 28, 56
    xs, w = row(3, gap, width=CONTENT_W, x0=x0)
    xa, xn, xd = xs
    rows = (("app", "ns_app", c.blue), ("mod", "ns_mod", c.purple),
            ("dom", "ns_dom", c.orange))
    hs = [max(card_h(w, *t[k]) for k in ks) for ks in
          (("app", "ns_app"), ("mod", "ns_mod", "adapter"), ("dom", "ns_dom"))]
    vgaps = (48, 48)
    y = top
    mids = []
    boxes = []
    for k, (src, ns, acc) in enumerate(rows):
        h = hs[k]
        card(c, xa, y, w, acc, *t[src], h=h)
        boxes.append(card(c, xn, y, w, acc, *t[ns], h=h))
        c.line(xa + w, y + h / 2, xn, y + h / 2, color=fg, sw=STROKE, marker=fg)
        mids.append(y + h / 2)
        y += h + (vgaps[k] if k < 2 else 0)
    # the app JSON of a module's namespace overrides its keys
    ox = xn + w * 0.5
    y0 = boxes[0][1] + boxes[0][3]
    c.line(ox, y0, ox, boxes[1][1], color=c.blue, sw=STROKE, marker=c.blue)
    edge_label(c, ox - 14 - tw(t["override"], CHIP) / 2, y0 + 24,
               t["override"], c.blue, pill=False)
    # the three namespaces join before the adapter
    h = hs[1]
    ya = mids[1] - h / 2
    card(c, xd, ya, w, c.teal, *t["adapter"], h=h)
    jx = xn + w + gap / 2
    c.line(xn + w, mids[1], xd, mids[1], color=fg, sw=STROKE, marker=fg)
    for my in (mids[0], mids[2]):
        c.path(f"M{xn + w},{my} H{jx} V{mids[1]}", color=fg, sw=STROKE,
               marker=None)
    # ready waits on every load, then the provider renders
    yr = y + 40
    hr = max(card_h(w, *t["ready"]), card_h(w, *t["provider"]))
    card(c, xd, yr, w, c.green, *t["ready"], h=hr)
    card(c, xn, yr, w, c.green, *t["provider"], h=hr)
    cx = xd + w / 2
    c.line(cx, ya + h, cx, yr, color=fg, sw=STROKE, marker=fg)
    c.line(xd, yr + hr / 2, xn + w, yr + hr / 2, color=fg, sw=STROKE, marker=fg)
    save(c, f"{fid}.{lang}")

for _lang in LANGS:
    fig_refresh_retry(_lang)
    fig_resource_loading(_lang)
    fig_auth_sync(_lang)
