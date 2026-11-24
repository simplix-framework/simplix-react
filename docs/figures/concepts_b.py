"""Figures for the core-concepts documents, set B (docs/en/core-concepts, docs/ko/core-concepts).

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
    "concepts-authorization-policy-lifecycle": {
        "en": {
            "empty": ("Empty", ["no user · no roles · no rules",
                                "can() returns false"]),
            "active": ("Active", ["rules · user · roles set",
                                  "replaced on update"]),
            "update": ("update(authData)", ["adapter.extract(authData)",
                                            "applyRules(rules, user, roles)",
                                            "persist, then notify()"]),
            "set": ("setRules(rules)", ["applyRules() without the adapter",
                                        "persist, then notify()"]),
            "clear": ("clear()", ["user, roles and rules reset",
                                  "persisted state removed",
                                  "notify()"]),
            "storage": ("Storage (persist option)", ["applyRules() saves the state",
                                                      "clear() removes it"]),
            "rehydrate": "rehydrate()",
            "restore": "restore from storage",
            "verdict": "Every transition notifies the subscribers",
        },
        "ko": {
            "empty": ("빈 상태", ["사용자 · 역할 · 규칙 없음",
                                 "can()은 false 반환"]),
            "active": ("활성 상태", ["규칙 · 사용자 · 역할 설정",
                                    "갱신할 때마다 교체"]),
            "update": ("update(authData)", ["adapter.extract(authData)",
                                            "applyRules(rules, user, roles)",
                                            "저장 후 notify()"]),
            "set": ("setRules(rules)", ["어댑터 없이 applyRules()",
                                        "저장 후 notify()"]),
            "clear": ("clear()", ["사용자 · 역할 · 규칙 초기화",
                                  "저장된 상태 삭제",
                                  "notify()"]),
            "storage": ("저장소(persist 옵션)", ["applyRules()가 상태 저장",
                                                "clear()가 상태 삭제"]),
            "rehydrate": "rehydrate()",
            "restore": "저장소에서 복원",
            "verdict": "모든 전이에서 구독자에게 알림",
        },
    },
    "concepts-authorization-adapters": {
        "en": {
            "sources": [("JWT token", ["authData passed to update()"]),
                        ("API endpoint", ["/api/me/permissions",
                                          "called through fetchFn"]),
                        ("Fixed rules", ["AccessRule[] written in code"])],
            "zone": "AccessAdapter.extract(authData)",
            "adapters": [("createJwtAdapter()", ["decodes token claims",
                                                  "permissions · roles · scopes"]),
                         ("createApiAdapter()", ["ignores authData",
                                                  "fetches the endpoint"]),
                         ("createStaticAdapter(rules)", ["ignores authData",
                                                         "returns the same rules"])],
            "result": ("AccessExtractResult", ["rules: CASL rules", "user?",
                                               "roles?"]),
            "policy": ("AccessPolicy", ["one adapter per policy",
                                        "can(action, subject)",
                                        "hasRole(role)"]),
        },
        "ko": {
            "sources": [("JWT 토큰", ["update()에 전달한 authData"]),
                        ("API 엔드포인트", ["/api/me/permissions",
                                            "fetchFn으로 호출"]),
                        ("고정 규칙", ["코드에 작성한 AccessRule[]"])],
            "zone": "AccessAdapter.extract(authData)",
            "adapters": [("createJwtAdapter()", ["토큰 클레임 디코딩",
                                                  "permissions · roles · scopes"]),
                         ("createApiAdapter()", ["authData 사용 안 함",
                                                  "엔드포인트 조회"]),
                         ("createStaticAdapter(rules)", ["authData 사용 안 함",
                                                         "항상 같은 규칙 반환"])],
            "result": ("AccessExtractResult", ["rules: CASL 규칙", "user?",
                                               "roles?"]),
            "policy": ("AccessPolicy", ["정책당 어댑터 하나",
                                        "can(action, subject)",
                                        "hasRole(role)"]),
        },
    },
    "concepts-internationalization-sources": {
        "en": {
            "sources": [("App translations", ["import.meta.glob",
                                              "namespace {namespace}",
                                              "overrides module keys"]),
                        ("Module registry", ["registerModuleTranslations()",
                                             "namespace {namespace}/{componentPath}"]),
                        ("Domain registry", ["registerDomainTranslations()",
                                             "namespace entity/{key}", "namespace enums"])],
            "late": ("Registered later", ["lazy bundles after start",
                                          "loaded on arrival"]),
            "zone": "createI18nConfig()",
            "detect": ("Locale detection", ["localStorage · navigator", "sets the initial locale"]),
            "adapter": ("I18nextAdapter", ["addResources()",
                                           "i18nReady"]),
            "provider": "I18nProvider adapter",
            "hooks": [("useTranslation(namespace)", []),
                      ("useEntityTranslation(entity)", ["entity/{entity} · enums"]),
                      ("useLocalePicker()", [])],
        },
        "ko": {
            "sources": [("앱 번역", ["import.meta.glob",
                                     "네임스페이스 {namespace}",
                                     "모듈 번역 키보다 우선 적용"]),
                        ("모듈 레지스트리", ["registerModuleTranslations()",
                                             "네임스페이스 {namespace}/{componentPath}"]),
                        ("도메인 레지스트리", ["registerDomainTranslations()",
                                               "네임스페이스 entity/{key}", "네임스페이스 enums"])],
            "late": ("나중에 등록", ["시작 후 지연 로드된 번들",
                                     "등록 시 불러오기"]),
            "zone": "createI18nConfig()",
            "detect": ("로케일 감지", ["localStorage · navigator", "초기 로케일 결정"]),
            "adapter": ("I18nextAdapter", ["addResources()",
                                           "i18nReady"]),
            "provider": "I18nProvider adapter",
            "hooks": [("useTranslation(namespace)", []),
                      ("useEntityTranslation(entity)", ["entity/{entity} · enums"]),
                      ("useLocalePicker()", [])],
        },
    },
    "concepts-ui-components-layers": {
        "en": {
            "layers": [("CRUD", ["CrudList · CrudForm · CrudDetail · CrudTree"]),
                       ("Layout", ["EditorFooter · PageHeaderProvider · PanelHeader"]),
                       ("Base", ["Button · Input · Select · Dialog · Table"]),
                       ("Primitives", ["Stack · Flex · Grid · Card · Heading · Text",
                                       "Container · Section: not replaceable"])],
            "uses": "builds on",
            "provider": ("UIProvider", ["overrides prop",
                                        "replaces registered Base and Primitive components",
                                        "every layer above renders the replacement"]),
            "over": "overrides",
        },
        "ko": {
            "layers": [("CRUD", ["CrudList · CrudForm · CrudDetail · CrudTree"]),
                       ("레이아웃", ["EditorFooter · PageHeaderProvider · PanelHeader"]),
                       ("Base", ["Button · Input · Select · Dialog · Table"]),
                       ("프리미티브", ["Stack · Flex · Grid · Card · Heading · Text",
                                       "Container · Section: 교체 불가"])],
            "uses": "아래 계층 사용",
            "provider": ("UIProvider", ["overrides prop",
                                        "등록된 Base · 프리미티브 컴포넌트 교체",
                                        "모든 위 계층에 적용"]),
            "over": "재정의",
        },
    },
}


def arrow(c, x1, y1, x2, y2, color):
    c.line(x1, y1, x2, y2, color=color, sw=STROKE, marker=color)


def fig_policy_lifecycle(lang):
    """Two states; update and setRules enter active, clear returns to empty."""
    fid = "concepts-authorization-policy-lifecycle"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    ws, g = 250, 70
    xa = RIGHT - ws
    xm = X0 + ws + g
    wm = xa - g - xm
    top, vg = 30, 26
    rows = ("update", "set", "clear")
    hs = [card_h(wm, *t[k]) for k in rows]
    ys = [top]
    for h in hs[:-1]:
        ys.append(ys[-1] + h + vg)
    bottom = ys[-1] + hs[-1]
    fg = c.t["fg_dim"]
    card(c, X0, top, ws, fg, *t["empty"], h=bottom - top, valign="middle",
         sw=STROKE)
    ab = card(c, xa, top, ws, c.green, *t["active"], h=bottom - top,
              valign="middle", sw=STROKE)
    accs = (c.blue, c.blue, c.red)
    for k, (key, y, h) in enumerate(zip(rows, ys, hs)):
        card(c, xm, y, wm, accs[k], *t[key], h=h)
        ym = y + h / 2
        if key == "clear":
            arrow(c, xa, ym, xm + wm, ym, c.red)
            arrow(c, xm, ym, X0 + ws, ym, c.red)
        else:
            arrow(c, X0 + ws, ym, xm, ym, c.blue)
            arrow(c, xm + wm, ym, xa, ym, c.blue)
    # storage sits under the active state and restores it
    ysto = bottom + 60
    hst = card_h(wm, *t["storage"])
    sb = card(c, xm, ysto, wm, c.orange, *t["storage"], h=hst)
    cx = xa + ws / 2
    sy = ysto + hst / 2
    c.path(f"M{xm + wm},{sy} H{cx} V{bottom}", color=c.orange, sw=STROKE,
           marker=c.orange)
    edge_label(c, cx + 12 + 60, bottom + 26, t["rehydrate"], c.orange,
               size=BODY, pill=False)
    edge_label(c, (xm + wm + cx) / 2 + 10, sy + 24, t["restore"], c.orange,
               size=BODY, pill=False)
    note(c, X0, ysto + hst + 30, CONTENT_W, t["verdict"], c.purple)
    save(c, f"{fid}.{lang}")


def fig_adapters(lang):
    """Three sources, three adapters behind one interface, one result, one policy."""
    fid = "concepts-authorization-adapters"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    g = 76
    ws, wa = 240, 420
    wr = CONTENT_W - ws - wa - 2 * g
    xa = X0 + ws + g
    xr = xa + wa + g
    zp = 18
    top = 30
    vg = 22
    hrow = [max(card_h(ws, *s), card_h(wa - 2 * zp, *a))
            for s, a in zip(t["sources"], t["adapters"])]
    y0 = top + CHIP
    ys = [y0]
    for h in hrow[:-1]:
        ys.append(ys[-1] + h + vg)
    zb = ys[-1] + hrow[-1] + zp
    zone(c, xa, top, wa, zb - top, c.blue, t["zone"])
    fg = c.t["fg_dim"]
    ends = []
    for k, (src, ad) in enumerate(zip(t["sources"], t["adapters"])):
        h = hrow[k]
        card(c, X0, ys[k], ws, fg, *src, h=h)
        card(c, xa + zp, ys[k], wa - 2 * zp, c.blue, *ad, h=h)
        arrow(c, X0 + ws, ys[k] + h / 2, xa + zp, ys[k] + h / 2, fg)
        ends.append(ys[k] + h / 2)
    # result above policy in the last column, centred on the adapters
    hr = card_h(wr, *t["result"])
    hp = card_h(wr, *t["policy"])
    gap = 60
    yr = (y0 + zb - zp) / 2 - (hr + gap + hp) / 2
    card(c, xr, yr, wr, c.purple, *t["result"], h=hr, sw=STROKE)
    for k, ey in enumerate(ends):
        mx = xa + wa + g / 2 + (k - 1) * 14
        ty = yr + hr * (0.25 + 0.25 * k)
        c.path(f"M{xa + wa - zp},{ey} H{mx} V{ty} H{xr}", color=c.blue,
               sw=STROKE, marker=c.blue)
    yp = yr + hr + gap
    card(c, xr, yp, wr, c.green, *t["policy"], h=hp, sw=STROKE)
    arrow(c, xr + wr / 2, yr + hr, xr + wr / 2, yp, c.purple)
    save(c, f"{fid}.{lang}")


def fig_i18n_sources(lang):
    """Three sources and late registrations converge on one adapter the hooks read."""
    fid = "concepts-internationalization-sources"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    g = 52
    ws, wz = 350, 250
    wh = CONTENT_W - ws - wz - 2 * g
    xz = X0 + ws + g
    xh = xz + wz + g
    zp = 18
    top = 30
    vg = 18
    srcs = list(t["sources"]) + [t["late"]]
    hs = [card_h(ws, *s) for s in srcs]
    ys = [top + CHIP]
    for h in hs[:-1]:
        ys.append(ys[-1] + h + vg)
    bottom = ys[-1] + hs[-1]
    # the config zone holds the adapter, level with every source
    zone(c, xz, top, wz, bottom + zp - top, c.purple, t["zone"])
    iw = wz - 2 * zp
    ab = card(c, xz + zp, ys[0], iw, c.purple, *t["adapter"],
              h=bottom - ys[0], valign="middle", sw=STROKE)
    n = len(srcs)
    for k, (s, y, h) in enumerate(zip(srcs, ys, hs)):
        late = k == n - 1
        acc = c.orange if late else c.blue
        dash = DASH_OUTSIDE if late else None
        card(c, X0, y, ws, acc, *s, h=h, dash=dash)
        c.line(X0 + ws, y + h / 2, xz + zp, y + h / 2, color=acc, sw=STROKE,
               marker=acc, dash=dash)
    # right column: locale detection above the provider and its hooks
    hd = card_h(wh, *t["detect"])
    card(c, xh, top, wh, c.purple, *t["detect"], h=hd)
    hk = [card_h(wh - 2 * zp, *hh) for hh in t["hooks"]]
    zy = top + hd + 70
    zh = CHIP + sum(hk) + vg * (len(hk) - 1) + zp
    yy = zone(c, xh, zy, wh, zh, c.green, t["provider"])
    for (title, lines), h in zip(t["hooks"], hk):
        card(c, xh + zp, yy, wh - 2 * zp, c.green, title, lines, h=h)
        yy += h + vg
    ax = xz + wz - zp
    yd = top + hd / 2
    arrow(c, xh, yd, ax, yd, c.purple)
    ym = zy + zh / 2
    arrow(c, ax, ym, xh, ym, c.green)
    save(c, f"{fid}.{lang}")


def fig_ui_layers(lang):
    """Four stacked layers; UIProvider replaces components in the lower two."""
    fid = "concepts-ui-components-layers"
    t = LABELS[fid][lang]
    c = canvas(1200, 1000)
    wp, g = 310, 130
    wl = CONTENT_W - wp - g
    xp = X0 + wl + g
    top, vg = 30, 46
    hs = [card_h(wl, *l) for l in t["layers"]]
    ys = [top]
    for h in hs[:-1]:
        ys.append(ys[-1] + h + vg)
    accs = (c.purple, c.blue, c.green, c.orange)
    fg = c.t["fg_dim"]
    for k, (l, y, h) in enumerate(zip(t["layers"], ys, hs)):
        card(c, X0, y, wl, accs[k], *l, h=h, sw=STROKE if k >= 2 else None)
        if k:
            ax = X0 + wl / 2
            arrow(c, ax, ys[k - 1] + hs[k - 1], ax, y, fg)
    edge_label(c, X0 + wl / 2 + 20 + 60, ys[0] + hs[0] + vg / 2, t["uses"],
               fg, size=BODY, pill=False)
    # the provider spans the two layers it replaces
    yb = ys[2]
    ye = ys[3] + hs[3]
    card(c, xp, yb, wp, c.red, *t["provider"], h=ye - yb, valign="middle",
         sw=STROKE)
    for k in (2, 3):
        ym = ys[k] + hs[k] / 2
        arrow(c, xp, ym, X0 + wl, ym, c.red)
    edge_label(c, X0 + wl + g / 2, ys[2] + hs[2] / 2 - 22, t["over"], c.red,
               pill=False)
    save(c, f"{fid}.{lang}")


for _lang in LANGS:
    fig_policy_lifecycle(_lang)
    fig_adapters(_lang)
    fig_i18n_sources(_lang)
    fig_ui_layers(_lang)
