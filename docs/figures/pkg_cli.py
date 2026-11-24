"""Figures for the CLI package README (packages/cli/README.md, README.ko.md).

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (CHIP, CONTENT_W, STROKE, canvas, card, card_h, edge_label,
                    figure, note, row, save, tw)

LANGS = ("en", "ko")

LABELS = {
    "pkg-cli-readme-domain-splitting": {
        "en": {
            "entities": ("Entities with tags", ["from the OpenAPI spec",
                                                "--entities filter"]),
            "domains": [("pet", 'tags ["pet"]'), ("store", 'tags ["store"]'),
                        ("user", 'tags ["user"]')],
            "fallback": ("Fallback domain", "spec title"),
            "outs": ["packages/myapp-domain-pet/",
                     "packages/myapp-domain-store/",
                     "packages/myapp-domain-user/"],
            "skip": ("No package", "skipped with a notice"),
            "match": "first match",
            "next": "no match",
            "verdict": "A domain no entity matches forms no group and gets no package",
        },
        "ko": {
            "entities": ("태그가 지정된 엔티티", ["OpenAPI 명세에서 추출",
                                            "--entities 필터로 선택"]),
            "domains": [("pet", 'tags ["pet"]'), ("store", 'tags ["store"]'),
                        ("user", 'tags ["user"]')],
            "fallback": ("대체 도메인", "명세 제목"),
            "outs": ["packages/myapp-domain-pet/",
                     "packages/myapp-domain-store/",
                     "packages/myapp-domain-user/"],
            "skip": ("패키지 없음", "안내 후 생략"),
            "match": "처음 일치",
            "next": "불일치",
            "verdict": "일치하는 엔티티가 없는 도메인은 그룹도 패키지도 만들지 않음",
        },
    },
}


@figure(plain=True)
def fig_domain_splitting(lang):
    """Config order cascade: first match wins, the rest fall to the fallback."""
    fid = "pkg-cli-readme-domain-splitting"
    t = LABELS[fid][lang]
    c = canvas(1200, 900)
    fg = c.t["fg_dim"]
    x0, top, gap, vgap = 28, 28, 130, 44
    we, wd = 280, 230
    xd = x0 + we + gap
    xo = xd + wd + gap
    wo = x0 + CONTENT_W - xo
    rows = [(n, [s]) for n, s in t["domains"]] + [(t["fallback"][0],
                                                  [t["fallback"][1]])]
    outs = [(o, []) for o in t["outs"]] + [(t["skip"][0], [t["skip"][1]])]
    h = max(max(card_h(wd, n, l, bullet=False) for n, l in rows),
            max(card_h(wo, n, l, bullet=False) for n, l in outs))
    he = card_h(we, *t["entities"], bullet=False)
    y0 = top + max(0, (he - h) / 2)
    ys = [y0 + k * (h + vgap) for k in range(len(rows))]
    card(c, x0, y0 + h / 2 - he / 2, we, c.purple, *t["entities"], h=he,
         bullet=False)
    c.line(x0 + we, y0 + h / 2, xd, y0 + h / 2, color=fg, sw=STROKE, marker=fg)
    for k, ((name, lines), (oname, olines), y) in enumerate(zip(rows, outs, ys)):
        last = k == len(rows) - 1
        acc = c.orange if last else c.blue
        card(c, xd, y, wd, acc, name, lines, h=h, bullet=False,
             num=None if last else k + 1)
        card(c, xo, y, wo, c.t["fg_dim"] if last else c.green, oname, olines,
             h=h, bullet=False, valign="middle", dash="5 4" if last else None)
        my = y + h / 2
        c.line(xd + wd, my, xo, my, color=acc, sw=STROKE, marker=acc)
        if not last:
            edge_label(c, (xd + wd + xo) / 2, my - 16, t["match"], acc,
                       pill=False)
            cx = xd + wd / 2
            c.line(cx, y + h, cx, ys[k + 1], color=fg, sw=STROKE, marker=fg)
            edge_label(c, cx + 12 + tw(t["next"], CHIP) / 2, y + h + vgap / 2,
                       t["next"], fg, pill=False)
    note(c, x0, ys[-1] + h + 30, CONTENT_W, t["verdict"], c.blue)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_domain_splitting(_lang)
