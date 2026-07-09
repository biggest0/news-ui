# M0 Gate Baseline — 2026-07-09

Branch: `audit/m0-baseline` (off `development` @ `423682e`) · Node **v22.19.0** · npm **11.6.0** · `npm ci` clean.

| Gate | Command | Result | Detail |
|---|---|---|---|
| Install | `npm ci` | ✅ | clean install; audit warnings (below) |
| Lint | `npm run lint` | 🔴 **FAIL** | **3 errors + 8 warnings** (details below) |
| Typecheck + build | `npm run build` | ✅ | 4.6s; but see bundle notes |
| Unit tests | `npm run test` | ✅ | **223/223** passing, 19 files, 10.1s |

## Lint failures (finding F040)

**Errors (3)** — all in Cypress files, which D4 removes in M7; until then the gate is red:
- `cypress/e2e/auth.cy.ts:145,146` — `no-unused-expressions`
- `cypress/support/commands.ts:114` — `no-namespace`

**Warnings (8)** — a custom `no-restricted-syntax` rule already enforces the i18n no-hardcoded-strings policy (good — the rule exists; the code violates it). These are concrete F026 targets:
- `UnderMaintenance.tsx:11`, `AppTitle.tsx:20`, `ContactPage.tsx:26,34`, `SubCategoryPage.tsx:33,57`
- plus 2 unused-var warnings in `cypress.config.ts`

## Build/bundle observations (seed for M8, and O1)

- **~530 kB of woff2 font files** shipped: 13 subsets of Noto Sans + Playfair Display (`@fontsource-variable`), spanning Vietnamese/Greek/Cyrillic/Devanagari — almost certainly unused weight for an EN/FR site, and entirely dead if O1 picks Tinos/Cardo.
- **Single JS bundle: 452 kB** (141 kB gzip) — no route-level code-splitting (M8).
- CSS 51.6 kB.

## npm audit (F041)

**21 vulnerabilities (1 low, 8 moderate, 12 high)** — all in the `vite` dev-server chain (fs.deny bypasses, path traversal, WebSocket file read) + `launch-editor`. Dev-time exposure only (Vite doesn't serve production), but `npm audit fix` reportedly resolves them — apply in M1 and re-run gates.
