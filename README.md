# UIs-Icons

A hand-maintained SVG icon library plus a static "cheat sheet" page to browse it.
It's a design-asset repo, not an app: no framework, no build step beyond two npm
scripts, no tests.

The icon names (`action-break-glass`, `object-vault`, `object-ssh-key`,
`object-session-recording`, `status-user-privileged-enabled-locked`,
`action-ctrl-alt-del`) target a Privileged Access Management / identity admin UI.

## Layout

| Path | Role |
| --- | --- |
| `svg/raw/` | Source icons, 112 files — as exported from the design tool (Illustrator-style, with `id="icon"` / `id="element"`, XML prolog) |
| `svg/opt/` | SVGO-minified versions, 1:1 with `raw/` (112 files) |
| `sprite.svg` | Generated symbol sprite (~40 KB) — one `<symbol id="icon-name">` per icon, `xlink`-referenced |
| `svgo.config.mjs` | SVGO plugin config — keeps `mergePaths` and `convertPathData` off |
| `scripts/build-sprite.mjs` | Builds `sprite.svg` from `svg/opt` |
| `index.html` | The cheat sheet — 112 `<li>` entries in five `<ul>`s, each `<use xlink:href="sprite.svg#name">` |
| `style.css` / `script.js` | Page styling; `script.js` counts the `<svg>`s and prints the total in the header |
| `IMPORTANT` | One-line reminder: replace fills with `currentColor` before optimizing |

## Naming convention

Five prefixed families, all 24×24, all `fill: currentColor` so they inherit text colour:

- `action-` (51) — toolbar/menu verbs
- `object-` (36) — entities (server, vault, group, token, tool-ssh/rdp/sftp)
- `status-` (14) — composite states, e.g. `status-user-super-disabled-locked`
- `notification-` (6) — success / failed / warning / info / missing / upcoming
- `window-` (5) — close, float, help, maximise, minimise

## Adding an icon

1. Drop the new icon into `svg/raw/`, then manually swap hardcoded fills to
   `currentColor` (see `IMPORTANT`).
2. `npm run build` — runs the two steps below in order:
   - `npm run optimize` — svgo `svg/raw` → `svg/opt`, configured by
     `svgo.config.mjs`, which turns off `mergePaths` and `convertPathData` so the
     exported path geometry is preserved exactly as drawn.
   - `npm run generate` — rebuilds `sprite.svg` from `svg/opt`. Every icon must
     carry a `viewBox`; the script fails loudly if one doesn't.
3. Add an `<li>` to `index.html`. Optionally give its `<svg>` a colour class
   (`orange`, `light-blue`, `green`, `red`, `off`) to preview tinting.

## Notes

- Keep the three counts in sync: `svg/raw`, `svg/opt`, and the `<li>` entries in
  `index.html` should all match (currently 112 each).
- The sprite used to be built by `spritesh`, which was abandoned in 2022 and
  pulled in a vulnerable `cheerio@0.20` tree. `scripts/build-sprite.mjs`
  reproduces its output byte for byte, so the only remaining dependency is svgo
  and the repo audits clean.
- Some `svg/raw` files still carry leftover Illustrator artboard rectangles
  (`<path fill="none" stroke="#000" d="M-444-12H36V468H-444z"/>` and similar).
  They're invisible at 24×24 but do add bytes to the sprite — worth stripping
  next time those icons are re-exported.
