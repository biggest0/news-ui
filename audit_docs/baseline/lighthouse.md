# M0 Lighthouse & Performance Baseline — 2026-07-09

Run against the **production preview build** (`npm run preview`, port 4173) with the *collided* palette (current `development` state), desktop emulation, chrome-devtools MCP. Note: this Lighthouse bundle excludes the Performance category — a raw trace stands in for it (below). Full reports in `lighthouse/{home,article,search}/report.{json,html}`.

## Category scores

| Page | Accessibility | Best Practices | SEO |
|---|---|---|---|
| Home `/` | **93** | 96 | 82 |
| Article `/article/:id` | **82** | 96 | 83 |
| Search `/search?q=cat` | **79** | 96 | 83 |

## Failed audits (deduped across pages → owning milestone)

| Audit | Pages | Milestone |
|---|---|---|
| `color-contrast` — insufficient contrast | article, search | **M2** (direct symptom of the token collision) |
| `button-name` — buttons without accessible name | article, search | M3/M6 (F016/F023) |
| `link-name` — links without discernible name | article, search | M6 |
| `select-name` — selects without label | search | M6 (F023) |
| `heading-order` — non-sequential headings | article | M6 |
| `landmark-one-main` — no `<main>` landmark | home | M6 |
| `errors-in-console` — the 401 (see report.md) | all | M4/M5 |
| `meta-description` missing | all | M8 (SEO) |
| `robots-txt` invalid | all | M8 (SEO) |
| `llms-txt` recommendations | all | M8 (optional; log only) |

## Performance trace (home, preview build, no throttling)

- **LCP 252 ms** (TTFB 14 / load delay 147 / load 4 / render delay 88) · **CLS 0.00**
- Localhost + no throttling → treat as a *relative* baseline only; re-trace with the same setup in M8.
- Raw trace: `lighthouse/home-trace.json.gz`.
