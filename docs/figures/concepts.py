"""Figures for the core-concepts documents (docs/en/core-concepts, docs/ko/core-concepts).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (CARD, CONTENT_W, HAIRLINE, STROKE, canvas, card, card_h,
                    note, save, zone, CHIP_RISE, PAD)

LANGS = ("en", "ko")

LABELS = {
    "concepts-schema-derivation-pipeline": {
        "en": {
            "contract": ("Contract", ["defineApi(config)",
                                      "entities · operations · Zod schemas"]),
            "zone": "built inside defineApi()",
            "client": ("HTTP client", ["deriveClient", "@simplix-react/contract"]),
            "keys": ("Query keys", ["deriveQueryKeys", "@simplix-react/contract"]),
            "hooks": ("React Query hooks", ["deriveEntityHooks(contract)",
                                            "@simplix-react/react"]),
            "form": ("Form hooks", ["deriveEntityFormHooks(contract, hooks)",
                                    "@simplix-react/form"]),
            "mock": ("Mock handlers", ["deriveMockHandlers(contract.config)",
                                       "@simplix-react/mock"]),
            "verdict": "One contract change reaches the client, the query keys, "
                       "both hook sets and the mock handlers",
        },
        "ko": {
            "contract": ("계약", ["defineApi(config)",
                                 "엔티티 · 오퍼레이션 · Zod 스키마"]),
            "zone": "defineApi() 안에서 파생",
            "client": ("HTTP 클라이언트", ["deriveClient", "@simplix-react/contract"]),
            "keys": ("쿼리 키", ["deriveQueryKeys", "@simplix-react/contract"]),
            "hooks": ("React Query 훅", ["deriveEntityHooks(contract)",
                                         "@simplix-react/react"]),
            "form": ("폼 훅", ["deriveEntityFormHooks(contract, hooks)",
                              "@simplix-react/form"]),
            "mock": ("목 핸들러", ["deriveMockHandlers(contract.config)",
                                  "@simplix-react/mock"]),
            "verdict": "계약 한 곳의 수정을 클라이언트 · 쿼리 키 · 두 훅 · "
                       "목 핸들러에 모두 반영",
        },
    },
}


def fig_schema_derivation_pipeline(lang):
    """One contract fans out to every derived artifact; hooks also feed form hooks."""
    fid = "concepts-schema-derivation-pipeline"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    x0 = 38
    gap = 64
    wa, wb = 300, 345
    wc = CONTENT_W - wa - wb - 2 * gap
    xa, xb = x0, x0 + wa + gap
    xc = xb + wb + gap
    zpad = 18
    vgap = 30

    # cards level with each other share one height: their tallest content's
    def tallest(pairs):
        return max(card_h(w, *t[k]) for k, w in pairs)

    hcard = tallest((("client", wb - 2 * zpad), ("keys", wb - 2 * zpad),
                     ("hooks", wc)))
    hlow = tallest((("mock", wb), ("form", wc)))

    top = 40
    ztop = top
    inner_top = ztop + CHIP_RISE + PAD
    xbi, wbi = xb + zpad, wb - 2 * zpad
    y1 = inner_top
    y2 = y1 + hcard + vgap
    zbottom = y2 + hcard + zpad
    y3 = zbottom + vgap

    zone(c, xb, ztop, wb, zbottom - ztop, c.blue, t["zone"])
    title, lines = t["client"]
    b1 = card(c, xbi, y1, wbi, c.blue, title, lines, h=hcard)
    title, lines = t["keys"]
    b2 = card(c, xbi, y2, wbi, c.blue, title, lines, h=hcard)
    # hooks sit level with the two cards they read, centred between them
    yh = (y1 + y2 + hcard) / 2 - hcard / 2
    title, lines = t["hooks"]
    bh = card(c, xc, yh, wc, c.green, title, lines, h=hcard)
    title, lines = t["form"]
    bf = card(c, xc, y3, wc, c.green, title, lines, h=hlow)
    title, lines = t["mock"]
    bm = card(c, xb, y3, wb, c.orange, title, lines, h=hlow)

    # the contract spans every row it feeds
    title, lines = t["contract"]
    ba = card(c, xa, y1, wa, c.purple, title, lines, h=y3 + hlow - y1,
              valign="middle", sw=STROKE)

    fg = c.t["fg_dim"]
    ar = xa + wa
    for (bx, by, bw, bh_) in (b1, b2, bm):
        yy = by + bh_ / 2
        c.line(ar, yy, bx, yy, color=fg, sw=STROKE, marker=fg)
    # client and query keys converge on the hooks
    hx, hy = bh[0], bh[1]
    for k, (bx, by, bw, bh_) in enumerate((b1, b2)):
        sy = by + bh_ / 2
        ty = hy + bh[3] * (0.3 if k == 0 else 0.7)
        mx = xb + wb + gap / 2
        c.path(f"M{bx + bw},{sy} H{mx} V{ty} H{hx}", color=fg, sw=STROKE,
               marker=fg)
    # hooks feed the form hooks
    cx = xc + wc / 2
    c.line(cx, bh[1] + bh[3], cx, bf[1], color=fg, sw=STROKE, marker=fg)

    note(c, x0, y3 + hlow + 34, CONTENT_W, t["verdict"], c.purple)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_schema_derivation_pipeline(_lang)
