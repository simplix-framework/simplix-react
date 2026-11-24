"""Figures for the CLI usage and extensions guides (docs/en/guides, docs/ko/guides).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (CONTENT_W, STROKE, canvas, card, card_h, edge_label, row,
                    save, tw, CHIP, note)

LANGS = ("en", "ko")

LABELS = {
    "guides-cli-usage-domain-workflow": {
        "en": {
            "config": ("simplix.config.ts", ["openapi[].domains: the tags of "
                                             "each domain"]),
            "add": ("simplix add-domain", ["creates the package",
                                           "refuses an existing one"]),
            "pkg": ("Domain package", ["<prefix>-domain-<name>", "under packages/"]),
            "openapi": ("simplix openapi", ["generates code in it",
                                            "stops if it is missing"]),
            "install": ("pnpm install", ["links the package"]),
            "build": ("pnpm build", ["builds it"]),
            "validate": ("simplix validate", ["checks the project"]),
            "i18n": ("simplix i18n-codegen", ["optional typing"]),
            "reads": "reads",
        },
        "ko": {
            "config": ("simplix.config.ts", ["openapi[].domains: 도메인별 태그"]),
            "add": ("simplix add-domain", ["패키지 생성", "이미 있으면 거부"]),
            "pkg": ("도메인 패키지", ["<prefix>-domain-<name>", "packages/ 아래"]),
            "openapi": ("simplix openapi", ["패키지에 코드 생성",
                                            "패키지가 없으면 종료"]),
            "install": ("pnpm install", ["새 패키지 연결"]),
            "build": ("pnpm build", ["패키지 빌드"]),
            "validate": ("simplix validate", ["프로젝트 검사"]),
            "i18n": ("simplix i18n-codegen", ["선택: 타입 생성"]),
            "reads": "읽기",
        },
    },
    "guides-extensions-boot-auth-wiring": {
        "en": {
            "zone": "returned by createBootAuth()",
            "mutator": ("bootMutator", ["unwraps the envelope",
                                        "failure → ApiResponseError"]),
            "authfetch": ("auth.fetchFn", ["Bearer header",
                                           "401 → refresh, retry"]),
            "base": ("baseFetch", ["no auth", "Boot error → ApiResponseError"]),
            "store": ("TokenStore", ["localStorageStore", "both tokens"]),
            "raw": ("rawAuthFetch", ["no envelope handling"]),
            "rawauth": ("createAuthFetch", ["same bearerScheme",
                                            "rawFetchOptions only"]),
            "rawbase": ("createFetch", ["rawFetchOptions.baseUrl",
                                        "no Boot errors"]),
            "server": ("Boot server", []),
            "verdict": "Without rawFetchOptions, rawAuthFetch is baseFetch itself "
                       "and sends no auth header",
        },
        "ko": {
            "zone": "createBootAuth()가 반환",
            "mutator": ("bootMutator", ["봉투 풀기",
                                        "실패 → ApiResponseError"]),
            "authfetch": ("auth.fetchFn", ["Bearer 헤더",
                                           "401 → 갱신 후 재시도"]),
            "base": ("baseFetch", ["인증 없음", "Boot 오류 → ApiResponseError"]),
            "store": ("토큰 저장소", ["localStorageStore", "액세스 · 리프레시 토큰"]),
            "raw": ("rawAuthFetch", ["봉투 처리 없음"]),
            "rawauth": ("createAuthFetch", ["같은 bearerScheme",
                                            "rawFetchOptions 필요"]),
            "rawbase": ("createFetch", ["rawFetchOptions.baseUrl",
                                        "Boot 오류 변환 없음"]),
            "server": ("Boot 서버", []),
            "verdict": "rawFetchOptions가 없으면 rawAuthFetch는 baseFetch 그대로이며 "
                       "인증 헤더를 보내지 않음",
        },
    },
}


def fig_domain_workflow(lang):
    """Config feeds add-domain and openapi; openapi needs the package."""
    fid = "guides-cli-usage-domain-workflow"
    t = LABELS[fid][lang]
    c = canvas(1200, 700)
    fg = c.t["fg_dim"]
    x0, top, gap = 28, 28, 56
    xs3, w3 = row(3, gap, width=CONTENT_W, x0=x0)
    hc = card_h(CONTENT_W, *t["config"])
    card(c, x0, top, CONTENT_W, c.purple, *t["config"], h=hc)
    yb = top + hc + 56
    hb = max(card_h(w3, *t[k]) for k in ("add", "pkg", "openapi"))
    ba = card(c, xs3[0], yb, w3, c.blue, *t["add"], h=hb)
    bp = card(c, xs3[1], yb, w3, c.teal, *t["pkg"], h=hb)
    bo = card(c, xs3[2], yb, w3, c.blue, *t["openapi"], h=hb)
    for b in (ba, bo):
        cx = b[0] + b[2] / 2
        c.line(cx, top + hc, cx, yb, color=c.purple, sw=STROKE, marker=c.purple)
        edge_label(c, cx + 12 + tw(t["reads"], CHIP) / 2, top + hc + 28,
                   t["reads"], c.purple, pill=False)
    my = yb + hb / 2
    c.line(ba[0] + w3, my, bp[0], my, color=fg, sw=STROKE, marker=fg)
    c.line(bo[0], my, bp[0] + w3, my, color=fg, sw=STROKE, marker=fg)
    # then the usual chain, ending in the optional i18n types
    yc = yb + hb + 64
    xs4, w4 = row(4, 40, width=CONTENT_W, x0=x0)
    keys = ("install", "build", "validate", "i18n")
    hcx = max(card_h(w4, *t[k]) for k in keys)
    for k, (x, key) in enumerate(zip(xs4, keys)):
        card(c, x, yc, w4, c.green, *t[key], h=hcx,
             dash="4 4" if key == "i18n" else None)
        if k:
            c.line(xs4[k - 1] + w4, yc + hcx / 2, x, yc + hcx / 2, color=fg,
                   sw=STROKE, marker=fg)
    ox = bo[0] + w3 / 2
    ix = xs4[0] + w4 / 2
    mid = yb + hb + 32
    c.path(f"M{ox},{yb + hb} V{mid} H{ix} V{yc}", color=fg, sw=STROKE, marker=fg)
    save(c, f"{fid}.{lang}")


def fig_boot_auth_wiring(lang):
    """Two returned fetches wrap one store; only bootMutator unwraps."""
    fid = "guides-extensions-boot-auth-wiring"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    fg = c.t["fg_dim"]
    x0, top, gap, vgap = 28, 28, 44, 48
    ws = 170
    xs, w = row(3, gap, width=CONTENT_W - ws - gap, x0=x0)
    xs = list(xs) + [x0 + CONTENT_W - ws]
    h1 = max(card_h(w, *t[k]) for k in ("mutator", "authfetch", "base"))
    h2 = card_h(w, *t["store"])
    h3 = max(card_h(w, *t[k]) for k in ("raw", "rawauth", "rawbase"))
    y1 = top
    y2 = y1 + h1 + vgap
    y3 = y2 + h2 + vgap
    r1 = [card(c, xs[0], y1, w, c.blue, *t["mutator"], h=h1),
          card(c, xs[1], y1, w, c.purple, *t["authfetch"], h=h1),
          card(c, xs[2], y1, w, c.orange, *t["base"], h=h1)]
    bs = card(c, xs[1], y2, w, c.teal, *t["store"], h=h2)
    r3 = [card(c, xs[0], y3, w, c.blue, *t["raw"], h=h3),
          card(c, xs[1], y3, w, c.purple, *t["rawauth"], h=h3),
          card(c, xs[2], y3, w, c.orange, *t["rawbase"], h=h3)]
    hs = y3 + h3 - y1
    srv = card(c, xs[3], y1, ws, c.t["fg_dim"], *t["server"], h=hs,
               valign="middle", dash="5 4", align="middle")
    for boxes in (r1, r3):
        for a, b in zip(boxes, boxes[1:] + [srv]):
            my = a[1] + a[3] / 2
            c.line(a[0] + w, my, b[0], my, color=fg, sw=STROKE, marker=fg)
    cx = xs[1] + w / 2
    c.line(cx, y2, cx, y1 + h1, color=c.teal, sw=STROKE, marker=c.teal)
    c.line(cx, y2 + h2, cx, y3, color=c.teal, sw=STROKE, marker=c.teal)
    note(c, x0, y3 + h3 + 30, CONTENT_W, t["verdict"], c.red)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_domain_workflow(_lang)
    fig_boot_auth_wiring(_lang)
