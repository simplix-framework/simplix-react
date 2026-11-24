"""Figures for the auth, access, i18n and headless package READMEs.

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP, HAIRLINE, STROKE, THICK, PAD, SANS, canvas,
                    card, card_h, cards_row, centered_baseline, edge_label, note, pill,
                    pill_h, save, tw, zone, CHIP_RISE)

LANGS = ("en", "ko")

LABELS = {
    "pkg-auth-fetch-retry": {
        "en": {
            "actors": ["caller", "fetch wrapper", "single-flight refresh",
                       "schemes", "server"],
            "call": "authFetch(path, options)",
            "headers": "getHeaders() of every scheme",
            "request": "request with merged headers",
            "unauth": "401",
            "refresh": "refreshManager.refresh()",
            "concurrent": "a concurrent 401 awaits the same refresh",
            "srefresh": "scheme.refresh()",
            "ok_zone": "refresh succeeds",
            "headers2": "getHeaders() with the new token",
            "retry": "retry the request",
            "response": "response",
            "result": "result",
            "fail_zone": "refresh fails",
            "failure": "onRefreshFailure(error)",
            "thrown": "AuthError REFRESH_FAILED thrown",
            "limit": "maxRetries (default 1) bounds the retries; "
                     "a 401 after the last retry reaches the caller",
        },
        "ko": {
            "actors": ["호출자", "fetch 래퍼", "공유 토큰 갱신", "스킴", "서버"],
            "call": "authFetch(path, options)",
            "headers": "모든 스킴의 getHeaders()",
            "request": "병합한 헤더로 요청",
            "unauth": "401",
            "refresh": "refreshManager.refresh()",
            "concurrent": "동시에 받은 401은 같은 갱신을 기다림",
            "srefresh": "scheme.refresh()",
            "ok_zone": "갱신 성공",
            "headers2": "새 토큰으로 getHeaders()",
            "retry": "요청 재시도",
            "response": "응답",
            "result": "결과",
            "fail_zone": "갱신 실패",
            "failure": "onRefreshFailure(error)",
            "thrown": "AuthError REFRESH_FAILED 전달",
            "limit": "maxRetries(기본값 1)가 재시도 횟수를 제한하며, "
                     "마지막 재시도의 401은 호출자에게 전달",
        },
    },
    "pkg-headless-consumers": {
        "en": {
            "web": ("@simplix-react/ui", ["web UI kit", "list model: useCrudList"]),
            "native": ("@simplix-react-native/ui",
                       ["native UI kit", "list model: useEntityFeed"]),
            "zone": "@simplix-react/headless",
            "contract": ("List contract", ["ListHook", "ListHookResult"]),
            "shared": ("Shared serialization", ["buildSearchableParams",
                                                "resolveEmptyReason"]),
            "orval": ("Orval list shape", ["OrvalListHookLike"]),
            "reexport": "imports · re-exports",
        },
        "ko": {
            "web": ("@simplix-react/ui", ["웹 UI 키트", "목록 모델: useCrudList"]),
            "native": ("@simplix-react-native/ui",
                       ["네이티브 UI 키트", "목록 모델: useEntityFeed"]),
            "zone": "@simplix-react/headless",
            "contract": ("목록 계약", ["ListHook", "ListHookResult"]),
            "shared": ("공통 직렬화", ["buildSearchableParams",
                                      "resolveEmptyReason"]),
            "orval": ("Orval 목록 형태", ["OrvalListHookLike"]),
            "reexport": "가져옴 · 다시 내보냄",
        },
    },
    "pkg-i18n-loading": {
        "en": {
            "app": ("App translations", ["appTranslations", "passed in the options"]),
            "module": ("Module translations", ["buildModuleTranslations",
                                               "registerModuleTranslations"]),
            "domain": ("Domain translations", ["registerDomainTranslations",
                                               "read from the registry"]),
            "config": ("createI18nConfig", ["loads all sources",
                                            "late ones too"]),
            "adapter": ("Adapter", ["I18nextAdapter",
                                    "resolves i18nReady"]),
            "provider": ("I18nProvider", ["adapter as context"]),
            "hooks": ("React hooks", ["useTranslation", "useLocale"]),
        },
        "ko": {
            "app": ("앱 번역", ["appTranslations", "옵션으로 전달"]),
            "module": ("모듈 번역", ["buildModuleTranslations",
                                    "registerModuleTranslations"]),
            "domain": ("도메인 번역", ["registerDomainTranslations",
                                      "레지스트리에서 읽음"]),
            "config": ("createI18nConfig", ["모든 번역 적재",
                                            "늦은 등록분 포함"]),
            "adapter": ("어댑터", ["I18nextAdapter",
                                  "적재 후 i18nReady"]),
            "provider": ("I18nProvider", ["트리에 어댑터 제공"]),
            "hooks": ("React 훅", ["useTranslation", "useLocale"]),
        },
    },
    "pkg-access-auth-sync": {
        "en": {
            "mount": "mount",
            "rehydrated": ("Rehydrated policy", ["policy.rehydrate()",
                                                 "rules from the last session"]),
            "auth": ("Authenticated rules", ["policy.update(accessToken)"]),
            "public": ("Public rules", ["policy.clear()",
                                        "policy.loadPublicAccess()"]),
            "to_auth": "authenticated with a new token",
            "self": "token changed",
            "signout": "unauthenticated",
            "signin": "signed in again",
            "note": ["auth.subscribe calls sync on every auth change",
                     "unauthenticated at mount keeps the rehydrated rules"],
        },
        "ko": {
            "mount": "마운트",
            "rehydrated": ("복원한 정책", ["policy.rehydrate()",
                                          "직전 세션의 규칙"]),
            "auth": ("인증 사용자 규칙", ["policy.update(accessToken)"]),
            "public": ("공개 규칙", ["policy.clear()",
                                    "policy.loadPublicAccess()"]),
            "to_auth": "새 토큰으로 인증됨",
            "self": "토큰 변경",
            "signout": "인증 안 됨",
            "signin": "다시 로그인",
            "note": ["인증 상태가 바뀔 때마다 auth.subscribe가 sync 실행",
                     "마운트 시 인증 안 됨이면 복원한 규칙 유지"],
        },
    },
}


def fig_access_auth_sync(lang):
    """The policy follows the auth state: update on a new token, public rules on sign-out."""
    fid = "pkg-access-auth-sync"
    t = LABELS[fid][lang]
    c = canvas(1200, 700)
    left, right = 24, 1176
    fg = c.t["fg_dim"]
    blue, green, orange = c.t["blue"], c.t["green"], c.t["orange"]
    sw_ = 380
    top = 84
    xr = left + 70
    xa = right - sw_
    keys = ("rehydrated", "auth", "public")
    hs = max(card_h(sw_, *t[k]) for k in keys)
    br = card(c, xr, top, sw_, blue, *t["rehydrated"], h=hs, rx=22)
    ba = card(c, xa, top, sw_, green, *t["auth"], h=hs, rx=22, sw=STROKE)
    y2 = top + hs + 130
    bp = card(c, xa, y2, sw_, orange, *t["public"], h=hs, rx=22)

    # initial: mount dot into the rehydrated state
    my = top + hs / 2
    c.dot(left + 8, my, 8, fg)
    c.line(left + 16, my, xr, my, color=fg, sw=STROKE, marker=fg)
    c.text(left, top - 14, t["mount"], size=BODY, color=fg, family=SANS,
           weight=600)

    # rehydrated -> authenticated
    c.line(xr + sw_, my, xa, my, color=green, sw=THICK, marker=green)
    c.text((xr + sw_ + xa) / 2, my - 12, t["to_auth"], size=BODY,
           color=green, family=SANS, weight=600, anchor="middle")

    # self-loop on authenticated: a new token updates again
    sx1, sx2 = xa + sw_ * 0.3, xa + sw_ * 0.6
    c.path(f"M{sx1},{top} V{top - 50} H{sx2} V{top}", color=green,
           sw=STROKE, marker=green)
    c.text(sx2 + 12, top - 42, t["self"], size=BODY, color=green,
           family=SANS, weight=600)

    # authenticated <-> public
    dx, ux = xa + sw_ * 0.25, xa + sw_ * 0.75
    c.line(dx, top + hs, dx, y2, color=orange, sw=THICK, marker=orange)
    c.text(dx - 12, (top + hs + y2) / 2 + 7, t["signout"], size=BODY,
           color=orange, family=SANS, weight=600, anchor="end")
    c.line(ux, y2, ux, top + hs, color=green, sw=STROKE, marker=green)
    c.text(ux - 12, (top + hs + y2) / 2 + 7, t["signin"], size=BODY,
           color=green, family=SANS, weight=600, anchor="end", mask=True)

    nw = xa - 60 - left
    nh_top = y2
    note(c, left, nh_top, nw, t["note"], blue, align="start")
    save(c, f"{fid}.{lang}")


def fig_i18n_loading(lang):
    """Three translation sources converge on one adapter, which the provider hands to hooks."""
    fid = "pkg-i18n-loading"
    t = LABELS[fid][lang]
    c = canvas(1200, 700)
    left, right = 24, 1176
    gap = 36
    wa = 330
    wrest = (right - left - wa - 3 * gap) / 3
    xa = left
    xb = xa + wa + gap
    xc = xb + wrest + gap
    xd = xc + wrest + gap
    top = 20
    vgap = 22
    srcs = ("app", "module", "domain")
    hs = max(card_h(wa, *t[k]) for k in srcs)
    colors = (c.t["blue"], c.t["purple"], c.t["orange"])
    sboxes = [card(c, xa, top + i * (hs + vgap), wa, col, *t[k], h=hs)
              for i, (k, col) in enumerate(zip(srcs, colors))]
    total = 3 * hs + 2 * vgap
    hb = card_h(wrest, *t["config"])
    yb = top + (total - hb) / 2
    bb = card(c, xb, yb, wrest, c.t["green"], *t["config"], h=hb,
              sw=STROKE, wash=True)
    hcx = card_h(wrest, *t["adapter"])
    yc = top + (total - hcx) / 2
    bc = card(c, xc, yc, wrest, c.t["green"], *t["adapter"], h=hcx,
              sw=STROKE, wash=True)
    hp = card_h(wrest, *t["provider"])
    hh = card_h(wrest, *t["hooks"])
    ydp = top + (total - hp - hh - 48) / 2
    bp = card(c, xd, ydp, wrest, c.t["blue"], *t["provider"], h=hp)
    bh = card(c, xd, ydp + hp + 48, wrest, c.t["blue"], *t["hooks"], h=hh)

    fg = c.t["fg_dim"]
    mx = xa + wa + gap / 2
    ty = yb + hb / 2
    for k, (x, y, w, h) in enumerate(sboxes):
        sy = y + h / 2
        if k == 1:
            continue
        c.path(f"M{x + w},{sy} H{mx} V{ty}", color=fg, sw=STROKE,
               marker=None)
    c.line(xa + wa, ty, xb, ty, color=fg, sw=STROKE, marker=fg)
    cy = yc + hcx / 2
    c.line(xb + wrest, cy, xc, cy, color=fg, sw=STROKE, marker=fg)
    py = bp[1] + hp / 2
    c.path(f"M{xc + wrest * 0.75},{yc} V{py} H{xd}",
           color=fg, sw=STROKE, marker=fg)
    hx = xd + wrest / 2
    c.line(hx, bp[1] + hp, hx, bh[1], color=fg, sw=STROKE, marker=fg)
    save(c, f"{fid}.{lang}")


def fig_headless_consumers(lang):
    """Both UI kits build their list models on headless; both share its serialization."""
    fid = "pkg-headless-consumers"
    t = LABELS[fid][lang]
    c = canvas(1200, 700)
    left, right = 24, 1176
    gap = 52
    kw = (right - left - gap) / 2
    top = 20
    hk = max(card_h(kw, *t[k]) for k in ("web", "native"))
    bw = card(c, left, top, kw, c.t["blue"], *t["web"], h=hk)
    bn = card(c, left + kw + gap, top, kw, c.t["purple"], *t["native"], h=hk)

    ztop = top + hk + 84
    zpad = 18
    inner = right - left - 2 * zpad
    cgap = 40
    cw = (inner - 2 * cgap) / 3
    cy = ztop + CHIP_RISE + PAD
    keys = ("contract", "shared", "orval")
    hc = max(card_h(cw, *t[k]) for k in keys)
    zone(c, left, ztop, right - left, cy + hc + zpad - ztop, c.t["green"],
         t["zone"])
    xs = [left + zpad + i * (cw + cgap) for i in range(3)]
    boxes = cards_row(c, xs, cy, cw, [t[k] for k in keys], c.t["green"])

    fg = c.t["fg_dim"]
    by = top + hk
    routes = (
        (left + kw * 0.5, boxes[0], c.t["blue"]),
        (left + kw * 0.95, boxes[1], c.t["blue"]),
        (left + kw + gap + kw * 0.15, boxes[1], c.t["purple"]),
        (left + kw + gap + kw * 0.8, boxes[2], c.t["purple"]),
    )
    for k, (sx, (tx, ty, tw_, th), col) in enumerate(routes):
        ex = min(max(sx, tx + 30), tx + tw_ - 30)
        if k == 0:
            ex = tx + tw_ * 0.85
        if k == 1:
            ex = tx + tw_ * 0.3
        if k == 2:
            ex = tx + tw_ * 0.7
        mid = (by + ty) / 2
        c.path(f"M{sx},{by} V{mid} H{ex} V{ty}", color=col, sw=STROKE,
               marker=col)
    lx = left + kw * 0.5 + 12
    c.text(lx, by + 30, t["reexport"], size=BODY, color=c.t["blue"],
           family=SANS, weight=600)
    save(c, f"{fid}.{lang}")


def message(c, xs, a, b, y, text, color, sw=STROKE):
    """A message arrow between two lifelines with its label above it."""
    x1, x2 = xs[a], xs[b]
    c.line(x1, y, x2, y, color=color, sw=sw, marker=color)
    c.text((x1 + x2) / 2, y - 9, text, size=BODY, color=c.t["fg"],
           family=SANS, weight=600, anchor="middle", mask=True)


def fig_auth_fetch_retry(lang):
    """A 401 runs one shared refresh, then a retry; a failed refresh reports."""
    fid = "pkg-auth-fetch-retry"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    left, right = 24, 1176
    n = len(t["actors"])
    lane = (right - left) / n
    xs = [left + lane / 2 + i * lane for i in range(n)]
    hw = lane - 24
    heads = [dict(lines=[(s, c.t["fg"], 700)], bullet=False, align="middle",
                  valign="middle") for s in t["actors"]]
    head_h = max(card_h(hw, None, h["lines"], bullet=False) for h in heads)
    top = 20
    step = 42
    fg = c.t["fg_dim"]
    blue, green, red, orange = c.t["blue"], c.t["green"], c.t["red"], c.t["orange"]

    rows = {}
    y = top + head_h + 46
    order = ["call", "headers", "request", "unauth", "refresh", "srefresh",
             "Z_ok", "headers2", "retry", "response", "result", "Z_fail",
             "failure", "thrown"]
    for k in order:
        if k.startswith("Z_"):
            y += 14
        rows[k] = y
        y += step
    bottom = y - step + 24


    for x, name in zip(xs, t["actors"]):
        c.line(x, top + head_h, x, bottom, color=c.t["line"], sw=HAIRLINE,
               marker=None)
    cards_row(c, [x - hw / 2 for x in xs], top, hw, heads, blue)

    message(c, xs, 0, 1, rows["call"], t["call"], fg)
    message(c, xs, 1, 3, rows["headers"], t["headers"], fg)
    message(c, xs, 1, 4, rows["request"], t["request"], fg)
    message(c, xs, 4, 1, rows["unauth"], t["unauth"], red)
    message(c, xs, 1, 2, rows["refresh"], t["refresh"], orange, sw=THICK)
    message(c, xs, 2, 3, rows["srefresh"], t["srefresh"], orange, sw=THICK)
    c.text(xs[2] + 12, rows["srefresh"] + 30, t["concurrent"], size=BODY,
           color=orange, family=SANS, weight=600, mask=True)
    for key, col in (("ok_zone", green), ("fail_zone", red)):
        c.text(left, rows["Z_" + key[:-5]] - 4, t[key], size=BODY, color=col,
               family=SANS, weight=700, mask=True)
    message(c, xs, 1, 3, rows["headers2"], t["headers2"], fg)
    message(c, xs, 1, 4, rows["retry"], t["retry"], green, sw=THICK)
    message(c, xs, 4, 1, rows["response"], t["response"], green)
    message(c, xs, 1, 0, rows["result"], t["result"], green)
    message(c, xs, 1, 0, rows["failure"], t["failure"], red)
    message(c, xs, 1, 0, rows["thrown"], t["thrown"], red)

    note(c, left, bottom + 24, right - left, t["limit"], blue)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_auth_fetch_retry(_lang)
    fig_headless_consumers(_lang)
    fig_i18n_loading(_lang)
    fig_access_auth_sync(_lang)
