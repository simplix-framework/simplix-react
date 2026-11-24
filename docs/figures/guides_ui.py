"""Figures for the UI guides (docs/en/guides, docs/ko/guides): designs, styling, CRUD pages.

Each figure function takes a language code and reads every label from LABELS,
so one drawing produces <figure-id>.en.svg and <figure-id>.ko.svg.
"""
from common import (BODY, CHIP_RISE, CONTENT_W, PAD, STROKE, canvas, card,
                    card_h, edge_label, note, save, zone, DASH_OUTSIDE)

LANGS = ("en", "ko")
X0 = 28
RIGHT = X0 + CONTENT_W
CHIP = CHIP_RISE + PAD

LABELS = {
    "guides-designs-layers": {
        "en": {
            "steps": [("UIProvider", ["design={CLARITY_DESIGN}",
                                      "the root provider"]),
                      ("Design.load()", ["load stylesheets",
                                         "<style> added to <head>"]),
                      ("data-design", ["written on <html>",
                                       "only after the load"])],
            "zone": '<html data-design="clarity">',
            "layers": [("classic rules", ["theme.css · when no design is set"]),
                       ("design stylesheet", ['[data-design="clarity"] rules']),
                       ("card fill", ["data-fill · theme/fills.css"]),
                       ("colour theme", ["data-color-theme · theme/presets/*.css"])],
            "portals": ("document.body portals", ["dialogs · popovers · toasts",
                                                  "rendered inside <html>",
                                                  "every layer applies"]),
            "app": "data-fill and data-color-theme: written by the app",
        },
        "ko": {
            "steps": [("UIProvider", ["design={CLARITY_DESIGN}",
                                      "루트 프로바이더"]),
                      ("Design.load()", ["스타일시트 불러오기",
                                         "<head>에 <style> 추가"]),
                      ("data-design", ["<html>에 기록",
                                       "불러오기가 끝난 뒤"])],
            "zone": '<html data-design="clarity">',
            "layers": [("classic 규칙", ["theme.css · 디자인 미지정 시 적용"]),
                       ("디자인 스타일시트", ['[data-design="clarity"] 규칙']),
                       ("카드 채우기", ["data-fill · theme/fills.css"]),
                       ("색상 테마", ["data-color-theme · theme/presets/*.css"])],
            "portals": ("document.body 포털", ["대화 상자 · 팝오버 · 토스트",
                                              "<html> 안에 렌더링",
                                              "모든 계층 적용"]),
            "app": "data-fill · data-color-theme: 앱이 기록",
        },
    },
    "guides-consumer-styling-setup-layers": {
        "en": {
            "zone": "index.css: app entry CSS",
            "tw": '@import "tailwindcss"',
            "theme": '@import "@simplix-react/ui/theme.css"',
            "parts": ["styles.css: content source + scroll rules",
                      "theme/base.css: base tokens",
                      "theme/designs/classic.css: classic design",
                      "theme/fills.css: card fills",
                      "theme/presets/*.css: colour presets"],
            "over": "app token overrides",
            "other": ("Other designs", ["UIProvider design → Design.load()",
                                        "loaded on demand",
                                        "not part of theme.css"]),
        },
        "ko": {
            "zone": "index.css: 앱 진입 CSS",
            "tw": '@import "tailwindcss"',
            "theme": '@import "@simplix-react/ui/theme.css"',
            "parts": ["styles.css: 콘텐츠 소스 등록 · 스크롤 규칙",
                      "theme/base.css: 기본 토큰",
                      "theme/designs/classic.css: classic 디자인",
                      "theme/fills.css: 카드 채우기",
                      "theme/presets/*.css: 색상 프리셋"],
            "over": "앱의 토큰 재정의",
            "other": ("그 밖의 디자인", ["UIProvider design → Design.load()",
                                         "필요할 때 불러옴",
                                         "theme.css에 포함 안 됨"]),
        },
    },
    "guides-consumer-design-customization-theme-flow": {
        "en": {
            "steps": [("state", ["useState", "colorTheme = 'blue'"]),
                      ("attribute on <html>", ["documentElement",
                                                   ".dataset.colorTheme"]),
                      ("preset selector", [":root", "[data-color-theme='blue']",
                                           "matches only on <html>"]),
                      ("tokens", ["--primary and the rest",
                                  "take the blue values"]),
                      ("Tailwind utilities", ["bg-primary · text-primary",
                                              "read var(--primary)"]),
                      ("screen", ["repainted",
                                  "component code unchanged"])],
            "effect": "useEffect",
            "miss": "a wrapper <div data-color-theme> matches no preset",
        },
        "ko": {
            "steps": [("상태", ["useState", "colorTheme = 'blue'"]),
                      ("<html>의 DOM 속성", ["documentElement",
                                             ".dataset.colorTheme"]),
                      ("프리셋 선택자", [":root", "[data-color-theme='blue']",
                                         "<html>에서만 일치"]),
                      ("토큰", ["--primary 등 변수",
                                "blue 값으로 교체"]),
                      ("Tailwind 유틸리티", ["bg-primary · text-primary",
                                             "var(--primary) 참조"]),
                      ("화면", ["다시 그림",
                                "컴포넌트 코드 변경 없음"])],
            "effect": "useEffect",
            "miss": "감싸는 <div data-color-theme>에는 어떤 프리셋도 일치하지 않음",
        },
    },
    "guides-ui-components-crud-pages": {
        "en": {
            "zone": "UIProvider",
            "hooks": ("derived hooks: deriveEntityHooks(contract)",
                      ["useList · useGet · useCreate · useUpdate · useDelete"]),
            "pages": [("list page: CrudList", ["useCrudList(useList)",
                                               "CrudList.Table · Pagination"]),
                      ("detail page: CrudDetail", ["DetailFields",
                                                   "useCrudDeleteDetail · CrudDelete"]),
                      ("form page: CrudForm", ["useCrudFormSubmit({ create, update })",
                                               "FormFields"])],
            "feeds": ["useList", "useGet · useDelete",
                      "useGet · useCreate · useUpdate"],
            "row": "row click", "edit": "edit", "saved": "saved",
        },
        "ko": {
            "zone": "UIProvider",
            "hooks": ("파생된 훅: deriveEntityHooks(contract)",
                      ["useList · useGet · useCreate · useUpdate · useDelete"]),
            "pages": [("목록 화면: CrudList", ["useCrudList(useList)",
                                               "CrudList.Table · Pagination"]),
                      ("상세 화면: CrudDetail", ["DetailFields",
                                                 "useCrudDeleteDetail · CrudDelete"]),
                      ("폼 화면: CrudForm", ["useCrudFormSubmit({ create, update })",
                                             "FormFields"])],
            "feeds": ["useList", "useGet · useDelete",
                      "useGet · useCreate · useUpdate"],
            "row": "행 클릭", "edit": "수정", "saved": "저장 완료",
        },
    },
}


def arrow(c, x1, y1, x2, y2, color):
    c.line(x1, y1, x2, y2, color=color, sw=STROKE, marker=color)


def fig_designs_layers(lang):
    """Load, then write the attribute; under it the layers stack on <html>."""
    fid = "guides-designs-layers"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    g = 64
    n = len(t["steps"])
    w = (CONTENT_W - (n - 1) * g) / n
    top = 30
    h1 = max(card_h(w, *s) for s in t["steps"])
    for k, s in enumerate(t["steps"]):
        x = X0 + k * (w + g)
        card(c, x, top, w, c.purple, *s, h=h1, num=k + 1)
        if k:
            arrow(c, x - g, top + h1 / 2, x, top + h1 / 2, c.purple)
    # the document element holds the layers and the portals
    zy = top + h1 + 70
    zp = 20
    wp = 330
    wl = CONTENT_W - 2 * zp - wp - 40
    hl = [card_h(wl, *l) for l in t["layers"]]
    vg = 14
    inner = sum(hl) + vg * (len(hl) - 1)
    zh = CHIP + inner + zp
    yy = zone(c, X0, zy, CONTENT_W, zh, c.blue, t["zone"])
    lx = X0 + zp
    accs = (c.t["fg_dim"], c.blue, c.orange, c.green)
    y0 = yy
    for k, (l, h) in enumerate(zip(t["layers"], hl)):
        card(c, lx, yy, wl, accs[k], *l, h=h, num=k + 1)
        yy += h + vg
    xp = RIGHT - zp - wp
    card(c, xp, y0, wp, c.blue, *t["portals"], h=inner, valign="middle")
    xa = X0 + 2 * (w + g) + w / 2
    arrow(c, xa, top + h1, xa, zy, c.purple)
    note(c, X0, zy + zh + 26, CONTENT_W, t["app"], c.orange)
    save(c, f"{fid}.{lang}")


def fig_styling_layers(lang):
    """index.css imports in order; theme.css contains five files."""
    fid = "guides-consumer-styling-setup-layers"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    wo, g = 300, 50
    wz = CONTENT_W - wo - g
    zp = 20
    top = 30
    iw = wz - 2 * zp
    vg = 16
    # measure first, then draw the frames around what they hold
    htw = card_h(iw, t["tw"])
    hparts = [card_h(iw - 2 * zp, p) for p in t["parts"]]
    hin = sum(hparts) + 10 * (len(hparts) - 1)
    htheme = CHIP + hin + zp
    hov = card_h(iw, t["over"])
    zh = CHIP + htw + vg + CHIP_RISE + htheme + vg + hov + zp
    y = zone(c, X0, top, wz, zh, c.blue, t["zone"])
    ix = X0 + zp
    card(c, ix, y, iw, c.t["fg_dim"], t["tw"], h=htw)
    y += htw + vg + CHIP_RISE
    yi = zone(c, ix, y, iw, htheme, c.purple, t["theme"])
    for p, h in zip(t["parts"], hparts):
        card(c, ix + zp, yi, iw - 2 * zp, c.purple, p, h=h)
        yi += h + 10
    y += htheme + vg
    card(c, ix, y, iw, c.green, t["over"], h=hov)
    xo = X0 + wz + g
    ho = card_h(wo, *t["other"])
    card(c, xo, top + (zh - ho) / 2, wo, c.t["fg_dim"], *t["other"], h=ho,
         dash=DASH_OUTSIDE)
    save(c, f"{fid}.{lang}")


def fig_theme_flow(lang):
    """state -> attribute on <html> -> preset -> tokens -> utilities -> screen."""
    fid = "guides-consumer-design-customization-theme-flow"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    g = 96
    w = (CONTENT_W - 2 * g) / 3
    top = 30
    st = t["steps"]
    h1 = max(card_h(w, *s) for s in st[:3])
    h2 = max(card_h(w, *s) for s in st[3:])
    y2 = top + h1 + 70
    boxes = []
    for k, s in enumerate(st):
        row, col = divmod(k, 3)
        x = X0 + col * (w + g)
        y = top if row == 0 else y2
        h = h1 if row == 0 else h2
        acc = c.green if k == 5 else c.blue
        boxes.append(card(c, x, y, w, acc, *s, h=h, num=k + 1,
                          sw=STROKE if k == 1 else None))
    fg = c.t["fg_dim"]
    for k in (0, 1, 3, 4):
        x, y, bw, bh = boxes[k]
        arrow(c, x + bw, y + bh / 2, x + bw + g, y + bh / 2, c.blue)
    edge_label(c, boxes[0][0] + w + g / 2, top + h1 / 2 - 22, t["effect"],
               c.blue, pill=False)
    # the preset row turns down into the tokens row
    px, py, pw, ph = boxes[2]
    tx, ty, tw_, th = boxes[3]
    my = py + ph + 35
    c.path(f"M{px + pw / 2},{py + ph} V{my} H{tx + tw_ / 2} V{ty}",
           color=c.blue, sw=STROKE, marker=c.blue)
    note(c, X0, y2 + h2 + 26, CONTENT_W, t["miss"], c.red)
    save(c, f"{fid}.{lang}")


def fig_crud_pages(lang):
    """Hooks feed three pages; the pages link list -> detail -> form -> list."""
    fid = "guides-ui-components-crud-pages"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    zp = 20
    top = 30
    iw = CONTENT_W - 2 * zp
    ix = X0 + zp
    hh = card_h(iw, *t["hooks"])
    g = 70
    w = (iw - 2 * g) / 3
    hp = max(card_h(w, *p) for p in t["pages"])
    gap = 90
    zh = CHIP + hh + gap + hp + 40 + 16 + zp
    y = zone(c, X0, top, CONTENT_W, zh, c.purple, t["zone"])
    card(c, ix, y, iw, c.blue, *t["hooks"], h=hh, sw=STROKE)
    yp = y + hh + gap
    xs = [ix + k * (w + g) for k in range(3)]
    for k, p in enumerate(t["pages"]):
        card(c, xs[k], yp, w, c.green, *p, h=hp)
        cx = xs[k] + w / 2
        arrow(c, cx, y + hh, cx, yp, c.blue)
        edge_label(c, cx, y + hh + gap / 2, t["feeds"][k], c.blue)
    ym = yp + hp / 2
    arrow(c, xs[0] + w, ym, xs[1], ym, c.orange)
    edge_label(c, xs[0] + w + g / 2, ym - 22, t["row"], c.orange, pill=False)
    arrow(c, xs[1] + w, ym, xs[2], ym, c.orange)
    edge_label(c, xs[1] + w + g / 2, ym - 22, t["edit"], c.orange, pill=False)
    yb = yp + hp + 40
    c.path(f"M{xs[2] + w / 2},{yp + hp} V{yb} H{xs[0] + w / 2} V{yp + hp}",
           color=c.orange, sw=STROKE, marker=c.orange)
    edge_label(c, (xs[0] + xs[2] + w) / 2, yb, t["saved"], c.orange,
               size=BODY)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_designs_layers(_lang)
    fig_styling_layers(_lang)
    fig_theme_flow(_lang)
    fig_crud_pages(_lang)
