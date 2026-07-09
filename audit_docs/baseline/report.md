# M0 Baseline Report — 2026-07-09

Branch `audit/m0-baseline` (off `development` @ `423682e`). Companion files: [`gates.md`](./gates.md) (lint/build/test detail), [`lighthouse.md`](./lighthouse.md) (scores + failed audits + perf trace). Backend: local Express API on `localhost:3001` (live data). Node v22.19.0 / npm 11.6.0.

## Gate status (summary)

| Gate | Result |
|---|---|
| `npm ci` | ✅ |
| `npm run lint` | 🔴 3 errors (Cypress files) + 8 warnings (hardcoded-string i18n rule) → **F040** |
| `npm run build` | ✅ (4.6s; 452 kB JS bundle, ~530 kB fonts → F042) |
| `npm run test` | ✅ 223/223 (19 files) |
| `npm audit` | 21 vulns (1 low / 8 mod / 12 high), all vite dev-server chain → **F041** |

## Visual baseline artifacts

- `current/` — 12 shots: {home, article, search} × {light, dark} × {390, 1280} of the **collided** state on `development`.
- `intended-local/` — 12 shots: same grid from a worktree at `39d7353` (pre-shadcn), same backend/data.
- `intended-live/` — 4 shots: home × {light, dark} × {390, 1280} from production `www.catiretime.com`.

**What the collision looks like:** on both themes, all body/secondary/muted text and interactive text renders the *same* dark taupe — washed out to near-invisible on light backgrounds, invisible on dark. Headings (`text-primary`) survive as near-white/black. Dark mode's background is shadcn's dark navy-taupe, not the app's slate-900… actually `body` itself keeps slate-900 (see nuance below) while component surfaces shift.

## Hard evidence of the token hijack (M2's starting point)

Probe on the running dev app (dark mode), comparing generated utility classes against the app's CSS variables:

| Utility class | Renders as | App variable says |
|---|---|---|
| `text-accent` | `oklch(0.268 0.011 36.5)` (dark taupe) | `--color-accent: #fbbf24` (amber-400) |
| `text-secondary` | `oklch(0.268 0.011 36.5)` | `--color-secondary: #cbd5e1` (slate-300) |
| `text-muted` | `oklch(0.268 0.011 36.5)` | `--color-muted: #94a3b8` (slate-400) |
| `text-primary` | `oklch(0.922 0.005 34.3)` | `--color-primary: #f1f5f9` |

Three utilities collapse to one identical taupe value — the `@theme inline` block makes Tailwind's generated utilities reference shadcn's `var(--accent)`/`var(--secondary)`/`var(--muted)` directly, **bypassing the app's `--color-*` variables entirely** (which still hold correct values — and are ignored). This also explains the dark-mode breakage: `html.dark { --color-* }` overrides are dead code for the hijacked names.

**Nuance:** the app's plain-CSS `body { color; background; font-family }` rule *beats* shadcn's `@layer base` body rule (unlayered CSS wins over `@layer`), so body font (Tinos) and page background survive. The damage is specifically in **utility classes**, i.e. nearly every component.

**Reference target (from production, dark mode):** `text-accent` = `rgb(251,191,36)` amber-400 · `text-primary` = slate-100 · `text-secondary` = slate-300 · `text-muted` = slate-400 · body = Tinos on slate-900. Matches `CLAUDE.md` exactly.

## Console / runtime observations (per page: home, article, search)

- **One 401 on every page load** — `AuthProvider`'s silent token refresh fires for anonymous visitors and the browser logs the failed request. Expected mechanics, but it's a guaranteed console error for every logged-out user and fails Lighthouse `errors-in-console` → **F043** (revisit in M5's `baseQueryWithReauth` design: e.g. a session-hint flag before attempting refresh).
- **DevTools issue:** "form field element should have an id or name attribute" ×7 (home) / ×3 (article) — folds into F022/F023 (M6).
- No other runtime errors or warnings. `RecommendedSection` correctly gates its authed fetch behind `isAuthenticated`.

## Lighthouse (see lighthouse.md)

A11y: home **93** / article **82** / search **79**. Concrete failures map to M2 (`color-contrast`), M3/M6 (`button-name`, `link-name`, `select-name`, `heading-order`, `landmark-one-main`), M8 (`meta-description`, `robots-txt`). Perf trace (unthrottled localhost): LCP 252 ms, CLS 0.00.

## Incidental observation to verify later

- Keyword search for `cat` returned a page of seemingly unrelated articles (France/cows, EU/Musk, Bitcoin…). Possibly backend relevance behavior or a fallback-to-all — verify in M4 → **F044**.

## M0 exit criteria — met

Both screenshot sets saved ✅ · Lighthouse + trace recorded ✅ · gates recorded (lint red = F040) ✅ · findings log updated ✅.
