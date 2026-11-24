# Document figures

Every diagram in `docs/en`, `docs/ko` and the package READMEs is an SVG drawn by a
Python module in this folder with the svg-diagrams skill's document-figure library
(`<skill>/scripts/docfigures/`, from the `simplecore` plugin). The library is imported,
never copied. An SVG is a build output: never edit one by hand, edit its module and rebuild.

## Layout

| Path | Holds |
| --- | --- |
| `docs/figures/document-figures.json` | the settings: board, type ladder, strokes, theme, fonts |
| `docs/figures/<area>.py` | one module per documentation area or topic |
| `docs/assets/figures/<figure-id>.<lang>.svg` | generated figures, committed |

The settings file is outside `.claude/` (gitignored here), so every command passes it
with `--config`. Relative paths in it resolve against `docs/figures/`.

## Naming

A figure id is `<area>-<document-slug>-<what>`, lowercase with hyphens. Areas: `start`,
`concepts`, `guides`, `tutorials`, `pkg`. Example: `concepts-schema-derivation-pipeline`
writes `concepts-schema-derivation-pipeline.en.svg` and `.ko.svg`. A document references
its own language's file with a relative path, for example
`![Schema derivation](../../assets/figures/concepts-schema-derivation-pipeline.en.svg)`.

## Adding a figure

1. In the area's module, add an entry to `LABELS` keyed by the figure id, with an `en`
   and a `ko` table holding every label the figure prints. Korean labels follow
   `.claude/GLOSSARY.md`; code identifiers stay as written in both languages.
2. Write one function that takes `lang`, reads only `LABELS[fid][lang]`, draws on
   `canvas(1200, h)` and ends with `save(c, f"{fid}.{lang}")`.
3. Call it for each entry of `LANGS` at the bottom of the module.
4. Build, verify, render and read both PNGs.

## Commands

Run from the repository root, with `SVG_DIAGRAMS` set to the svg-diagrams skill directory
(`.../plugins/simplecore/skills/svg-diagrams`).

```bash
# build every module (or name one: ... build.py --config ... concepts)
python3 "$SVG_DIAGRAMS/scripts/docfigures/build.py" --config docs/figures/document-figures.json

# every check, plus PNGs to read
python3 "$SVG_DIAGRAMS/scripts/docfigures/verify.py" --config docs/figures/document-figures.json --render /tmp/figs
```

`verify.py` must end with `verdict: pass`.
