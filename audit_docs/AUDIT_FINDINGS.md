# Catire Time Frontend — Audit Findings Log

> Companion to [`AUDIT_PLAN.md`](./AUDIT_PLAN.md) (v2). Severity/verdict definitions live in the plan (§2). As findings are actioned, migrate rows into this working schema:
>
> ```
> | ID | Milestone | Sev | Verdict | Location (file:line) | Finding | Standard it fails (source) | Fix applied | Status | Verified how |
> ```
>
> `Status` ∈ `Todo | In-progress | Done | Deferred(reason) | Rejected(reason) | Needs-decision`. Next free ID: **F052**.
>
> **2026-07-09 verification pass:** the key premises below were spot-checked against the repo and held (token collision, literal `@/` dir, F014 `undefined` return, counts of hooks/slices/pages/tests/specs). Decisions D1–D4 are now resolved — see the plan's Decision Log — and the affected rows below carry a `[D#]` note. Findings F034–F039 were added by that pass.

---

## ⚠️ Read this before you use this file

**This is a reference from a prior static-analysis pass — not a task list handed down to you, and not the source of truth.** It exists so a known issue isn't missed, *not* to tell you what to conclude. Anchoring on someone else's findings is exactly how a fresh audit inherits their blind spots and their mistakes.

**Do this in order:**

1. **Audit independently first.** Work `AUDIT_PLAN.md` phase by phase and form *your own* findings, severities, and verdicts from the code + `CLAUDE.md` + live context7/shadcn lookups — **before** you study the tables below in detail.
2. **Then cross-check against this file.** Three questions per row: *Did I also catch this? Did I miss anything here? Do I disagree with the verdict/severity?*
3. **Re-verify everything.** Every row is a **hypothesis**, not a fact:
   - **Counts are from static grep** and may be stale, double-counted, or wrong — reproduce them yourself.
   - **Line numbers** drift as files change — confirm before editing.
   - **Severities and verdicts are *proposed*** — re-derive your own. If you disagree, record your verdict and *why*; don't defer to this doc.
   - **Never copy a fix from here** without independently confirming the problem and benchmarking the fix against context7/shadcn (per the Standards mandate).
4. **Own the log.** As you work, migrate confirmed findings into the full §5 schema (add `Fix applied` / `Status` / `Verified how`), add everything *you* find that isn't here, and mark any row here you judge invalid as **Rejected (reason)**.

If your independent pass and this file disagree, **trust your pass** and note the discrepancy.

---

## Legend

- **Sev:** `P0` blocker · `P1` high · `P2` medium · `P3` low (proposed)
- **Verdict:** `Keep` · `Fix` (in-place to standard) · `REFACTOR` (design below standard) · `🧭` (needs human decision) — all *proposed*
- **Status:** all rows start `Todo (unverified)` — nothing below has been actioned.
- Verify method column omitted from the seed (empty for all) — add it in the working log as you verify.

---

## Executive summary (proposed — confirm independently)

A recent, **half-finished shadcn/ui install** is the dominant theme. It introduced a second design-token system that appears to collide with the app's existing semantic tokens (potential site-wide visual regression), wrote components to a wrong literal `@/` path, and added six dependencies that nothing in `src/` imports. Separately, the older application code shows the usual drift: duplicated mobile/desktop sections and an inlined dropdown, ~37 hardcoded colors and ~52 relative imports that violate `CLAUDE.md`, one inconsistent service error contract, and thin test coverage on hooks/slices/pages. Layering (api→service→mapper→store) and i18n key counts looked healthy. Biggest open judgment call: **is shadcn being adopted or reverted** — it gates Phases 1–2. Confirm all of this yourself.

Proposed tally: **~33 seed findings** — P0 ×2, P1 ×10, P2 ×13, P3 ×6, plus 3 🧭 modernization decisions.

**2026-07-09 addendum (verification pass):** six findings added — F034 (third token source: `@import "shadcn/tailwind.css"`), F035 (`shadcn` CLI as runtime dep), F036 (`gh-pages` as runtime dep), F037 (three deprecated `@types/*` stubs), F038 (**no CI pipeline exists**), F039 (dev-server host docs drift). Decisions D1–D4 resolved; work is now organized by milestone (M0–M8) per the v2 plan.

---

## Phase 1 — Design system (proposed P0)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source to benchmark |
|----|-----|---------|----------|---------|------------------------------------------|
| F001 | P0 | Fix | `src/index.css` ~L322 (`@theme inline`) vs ~L19 (`@theme`) | shadcn token block redefines the same Tailwind utility names the app uses (`primary, secondary, muted, accent, border, foreground, background, …`); later block wins → app tokens (esp. amber `accent`) appear hijacked to taupe. Partial override (app-unique tokens survive) → inconsistent palette. | Tailwind v4: a single `@theme` token source; no utility name defined twice (context7 → Tailwind v4) |
| F002 | P0 | Fix | `src/index.css` ~L365 (`@layer base`) | `body {@apply bg-background text-foreground}`, `html {@apply font-sans}`, `* {@apply border-border}`, global `--radius` override the app's `body` color/background, Tinos font, and borders app-wide. | same as F001 |
| F003 | P1 | 🧭 Fix | `src/index.css` L1, L5–6, L323–324 | Font drift: Noto Sans + Playfair Display added; Cormorant Garamond added to the Google Fonts import (its `@font-face` at L71–78 is commented out — the import is pure waste); `CLAUDE.md` says app = Tinos + Cardo. Competing `body`/`html` font declarations. **[O1 — resolve at M2 kickoff with side-by-side screenshots]** | decide one type system; one winning declaration |
| F034 | P0 | Fix | `src/index.css` L4 | **Third token source missed by the v1 plan:** `@import "shadcn/tailwind.css"` pulls additional shadcn base CSS on top of the two local `@theme` blocks. Audit what it injects; reconcile in M2 with the rest. | Tailwind v4 single token source |

## Phase 2 — Dependencies & shadcn setup (proposed P0/P1)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F004 | P0/P1 | Fix | repo root `@/` (untracked): `@/lib/utils.ts`, `@/components/ui/button.tsx` | shadcn CLI wrote a **literal `@` folder** because it couldn't resolve `@/`→`src/`. Files belong at `src/lib/` and `src/components/ui/` (or be deleted). | shadcn install layout (shadcn MCP `get_audit_checklist`) |
| F005 | P1 | Fix | `components.json` | Aliases (`@/components/ui`, `@/lib/utils`) resolve to paths not present under `src/` → future `shadcn add` keeps misfiring. Verify `@/`→`src/` alias in `vite.config`/`tsconfig`. | shadcn MCP |
| F006 | P1 | Fix | `package.json` | 6 deps with **0 `src/` imports**: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@base-ui/react`, `tw-animate-css` (only the stray `@/` files reference some). **[D1: adopting shadcn → keep and integrate; anything still unimported after M3 gets removed]** | no unused runtime deps |
| F007 | P1 | Fix | codebase-wide | Two icon libraries: `react-icons` (23 files) + `lucide-react` (0 files). **[O2 default: standardize on lucide (shadcn's default, per `components.json`); migrate in M3, then remove `react-icons`]** | single icon library |
| F035 | P2 | Fix | `package.json` | `shadcn` (the CLI, `^4.13.0`) is a **runtime dependency**. Move to `devDependencies` or drop in favor of `npx shadcn`. | dep placement |
| F036 | P3 | Fix | `package.json` | `gh-pages` (deploy tooling) is a runtime dependency. Move to `devDependencies`. | dep placement |
| F037 | P2 | Fix | `package.json` devDependencies | Deprecated type stubs: `@types/i18next` (v12 stubs vs i18next 25), `@types/react-redux` (v7 vs 9), `@types/react-router-dom` (v5 vs 7). All three libs ship their own types — stubs can shadow real types. Remove all three. | libraries ship own types |

## Phase 3 — Architecture / layering & modernization (proposed P1–P2)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F031 | P2 | REFACTOR | `src/api/*`, `src/service/*`, `src/store/*Slice.ts` | Hand-rolled `api`+`service`+thunk data layer. **Not a defect** — clean & tested — but RTK Query is the modern default for this REST/caching use case. **[D2 resolved: migrate → plan M5]** | context7 → Redux Toolkit / RTK Query |
| F032 | P2 | REFACTOR-**Deferred** | `LoginPage`, `RegisterPage`, `ResetPasswordPage`, `NewPasswordPage`, `SubscribeForm`, `AccountInfoForm` | Manual form state vs React 19 **Actions** (`useActionState`/`useFormStatus`). **[D3 resolved: defer post-ship — do not migrate this pass]** | context7 → React 19 |
| F033 | P2 | Fix/REFACTOR | all `useEffect` / `forwardRef` sites | Audit for `forwardRef` (ref is a prop in 19), fetch-in-`useEffect` races (rapid lang/category switch), and effects that only derive state. | context7 → React ("You Might Not Need an Effect") |
| — | — | Keep (verify) | api/service/mapper boundary | Prior pass saw layering clean and `?lang=` on every article call — **confirm still true** after any edits. | — |

## Phase 4 — Redundancy / shared code (proposed P1–P2)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F008 | P1 | REFACTOR | `SectionHeaderExpandable.tsx` L60–102 ≡ `SectionDropDown.tsx` L38–83 | `SectionHeaderExpandable` inlines the entire `SectionDropDown` body verbatim (same click-outside effect, chevron, panel). Should compose it. | React composition; shadcn `dropdown-menu` (shadcn MCP) |
| F009 | P1 | Fix | `SectionHeaderExpandable.tsx` L12–18 + `useSectionDropdown.ts` | `DropDownOption` type declared twice. Single-source it. | DRY types |
| F010 | P1 | REFACTOR | `EditorsSection`/`MobileEditorsSection` (+ CatFacts, StaffPicks pairs) | Mobile/desktop section pairs ~90% identical (imports, hooks, structure; differ in card orientation + wrapper classes). | composition / responsive single-source |
| F011 | P1 | REFACTOR | 10 files matching `isVisible ? "" : "hidden"` | Section-wrapper pattern (`border-b … py-6` + visibility/collapse) copy-pasted. Extract `<SectionShell>`. | composition |
| F012 | P2 | Fix | `useArticleHooks.ts:97`, `useSearchPage.ts:117` | Two `useInfiniteScroll` hooks, different signatures. Merge or rename unambiguously. | one API or clear naming |
| F013 | P2 | REFACTOR | `ExpandableSection.tsx` (+ F008 files) | Chevron/dropdown markup also duplicated here. Fold into the shared dropdown. | composition |

## Phase 5 — Consistency & conventions (proposed P2–P3)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F017 | P2 | Fix | ~37 usages across `components/`, `pages/` (excl. `NewsCard` exception) | Hardcoded color pairs (`border-gray-400`, `text-gray-500`, `text-gray-800`, `bg-white`, `hover:text-amber-600`) instead of semantic tokens. Do **after** F001. | `CLAUDE.md` semantic tokens |
| F018 | P2 | Fix | ~52 same-dir `./` imports (non-test) | Relative imports instead of `@/` (e.g. `EditorsSection` uses `./CollapsibleSection` while `MobileEditorsSection` uses `@/…`). | `CLAUDE.md` "always `@/`" |
| F019 | P3 | Fix | `SectionDropDown.tsx` L12–14 | Mixed tabs/spaces indentation. | project formatting |
| F020 | P3 | Fix | `AppLogo.tsx:20`, `CategoryNewsSection.tsx:30`, Editors sections | Informal uncatalogued TODOs ("To DO: replace logo", "maybe find a better way", "instead pass in an enum maybe"). | tracked or resolved |
| F021 | P3 | Keep/Fix (decide) | 23 × `console.error` (0 `log`/`warn`) | All in service catch blocks — legit logging, not stray debug. Decide: keep vs logger abstraction. | consistent logging policy |

## Phase 6 — Correctness / bugs (proposed P1)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F014 | P1 | Fix | `articleService.ts` L137–144 | `getTopTenArticles` returns `undefined` on error (empty catch, no return) while every sibling returns a safe default → callers can crash on `.map`. Add typed `[]` fallback + explicit return type. | uniform service error contract |
| F015 | P1 | Fix | `articleApi.ts` L56–68, L118–130 | `fetchArticlesByCategory`/`BySubCategory` build URLs via raw interpolation (no `encodeURIComponent`/`URLSearchParams`) unlike other endpoints → breaks on special chars. | `URLSearchParams` everywhere |

## Phase 7 — Accessibility (proposed P1–P2)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F016 | P1 | REFACTOR | `SectionDropDown.tsx` L41–49, `SectionHeaderExpandable.tsx` L62–70 | Dropdown chevrons are `onClick` on an `<svg>` — not keyboard focusable/operable. | WCAG 2.1 AA; accessible `<button>`/primitive (shadcn MCP) |
| F022 | P2 | Fix | 8 of 10 `<img>` | Missing `alt` (use `alt=""` only if decorative). | WCAG 2.1 AA |
| F023 | P2 | REFACTOR | hand-rolled dropdowns/menus/toggles (17 aria/role usages app-wide) | Missing `aria-expanded`/`aria-haspopup`/roles/focus management. | WCAG 2.1 AA; base-ui/shadcn primitives |

## Phase 8 — i18n (proposed P2)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F026 | P2 | Fix/verify | `src/i18n/en/common.json`, `fr/common.json` | Counts match (200 keys / 277 lines each) but **structural key-path parity** and hardcoded-string sweep not yet verified. | context7 → react-i18next; typed keys |

## Phase 9 — Testing (proposed P2)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F024 | P2 | Fix | `src/hooks/*`, `src/store/*Slice.ts`, `src/pages/*` | 0 tests on hooks (0/8), slices (0/4), pages (0/18). 19 tests / 139 source files. | context7 → Testing Library (behavior-focused) |
| F025 | P2 | Fix | `cypress/e2e/*.cy.ts` (8 specs: article, auth, home, navigation, search, static-pages, subscribe, theme) | Undocumented in `CLAUDE.md`, not in `test` script/CI, last touched months ago. **[D4 resolved: port the 8 flows to Playwright in M7, then remove Cypress entirely]** | one e2e framework, in CI |
| F038 | P2 | Fix | repo root | **No CI pipeline exists at all** (no `.github/workflows`) — the v1 plan assumed one to "wire Cypress into". Stand up GitHub Actions in M7: `lint` → `build` → `vitest` → Playwright. | CI on PR + push |
| F039 | P3 | Fix | `vite.config.ts` vs `CLAUDE.md` | Dev server host drift: config says `host: 'localhost'`; `CLAUDE.md` says "LAN accessible (host: 0.0.0.0)". Align docs (or config) in M8. | docs match reality |

## Phase 11 — Security (proposed P2)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F030 | P2 | Verify | `GoogleCallbackPage`, reset-password flow, `authFetch.ts` | Review OAuth code exchange + reset-token handling for token-in-URL/open-redirect; confirm no infinite-refresh loop; tokens stay HttpOnly-only. | OWASP; provider docs |
| — | — | Keep (verify) | codebase | 0 `dangerouslySetInnerHTML` — low XSS surface. Confirm blog `.tsx` rendering stays safe. | — |

## Phase 12 — Docs & hygiene (proposed P3)

| ID | Sev | Verdict | Location | Finding | Proposed standard / source |
|----|-----|---------|----------|---------|-----------------------------|
| F027 | P3 | Fix | `package.json` L5 vs `src/config/config.ts:5` | Version drift: `"0.0.0"` vs `APP_VERSION "v1.11.1"`. One source of truth. | — |
| F028 | P3 | Fix | repo root | No `.env.example` documenting `VITE_API_URL` (+ other `VITE_` vars). | — |
| F029 | P3 | Fix | `CLAUDE.md` | Drift: no mention of shadcn, `@base-ui/react`, lucide, Cypress, or new fonts. Its own maintenance rule requires an update. | `CLAUDE.md` maintenance rule |

---

## M1 results (2026-07-09 — done pending owner commit, branch `audit/m1-shadcn-wiring`)

| ID | Resolution | Verified how |
|----|-----------|--------------|
| F004 | **Done** — `@/lib/utils.ts` → `src/lib/utils.ts`, `@/components/ui/button.tsx` → `src/components/ui/button.tsx`, literal `@` folder deleted | files exist in `src/`; `@` gone; build green |
| F005 | **Done** — root cause: shadcn CLI needs `baseUrl`+`paths` in the **root** `tsconfig.json` (this repo's solution-style root had none). Added per official shadcn Vite docs (context7: shadcn installation/vite — "Add the `baseUrl` and `paths` … to `tsconfig.json` **and** `tsconfig.app.json`") | throwaway `npx shadcn add badge` landed in `src/components/ui/` (then removed) |
| F035 | **Done** — `shadcn` → devDependencies | package.json diff |
| F036 | **Done** — `gh-pages` → devDependencies | package.json diff |
| F037 | **Done** — `@types/i18next`, `@types/react-redux`, `@types/react-router-dom` removed | build + tests green without them |
| F040 | **Done** — lint 0 errors (was 3): chai `.to.equal(null)`, scoped `no-namespace` disable with justification, dropped empty `setupNodeEvents`. 6 remaining warnings = F026 (M6) | `npm run lint` |
| F041 | **Done** — `npm audit` **21 → 0** vulns (vite 7.3.6 + transitive dev-tooling bumps, all semver-compatible). Caveat: first `npm audit fix` failed on Cypress's binary postinstall (sandbox EACCES) and rolled back — reran with `CYPRESS_INSTALL_BINARY=0`; Cypress stays 15.13.0 | `npm audit`; gates green; dev-server smoke test on vite 7.3.6 |
| F006 | **Partially resolved** — `clsx`/`tailwind-merge` (used by `cn`) and `cva`/`@base-ui/react` (used by button.tsx) now have in-src consumers; `lucide-react` + `tw-animate-css` still unused → re-check at end of M3 | grep |

M1 exit criteria met (see COMMIT_PLAN.md for the pending commits + merge).

## M5 results (2026-07-10 — done pending owner commit, branch `audit/m5-rtk-query`)

**D2 executed: the hand-rolled api/service/thunk data layer is replaced by RTK Query** (design doc: [`rtkq-design.md`](./rtkq-design.md); patterns verified via context7 → redux-toolkit customizing-queries + infinite-queries).

| Item | Resolution | Verified how |
|------|-----------|--------------|
| Architecture | One `createApi` (`store/api/apiSlice.ts`) + `baseQueryWithReauth` (401 → `authStore.refresh()` → retry; reuses authStore's single-flight dedupe instead of adding async-mutex). Endpoints injected per domain: articles (native **infinite queries** for lists/search — RTK ≥2.6), recommendations, userContent (tag invalidation; like-toggle writes its response into the status cache, no refetch round-trip), catFacts. `transformResponse` → mappers; DTOs never reach components. Types acyclic (F049 lesson applied). | tsc; 182/182; boundary grep: components import no data services/apis except sanctioned fire-and-forget + auth/forms |
| **Remount hack retired** (owner decision) | `<main key={lang}>` + `languageChanged` slice resets deleted. `lang` lives in every query arg via new `useApiLang()`. | **browser-verified:** `<main>` DOM node survives EN↔FR toggle (marker property intact), `<html lang>` flips, exactly 4 refetches all `?lang=fr` |
| **F043 fixed** (owner decision: session hint) | Silent refresh gated on the persisted `AUTH_USER` entry (already a natural session hint — no new flag needed). Anonymous loads fire **zero** `/auth/refresh`. | network tab: no refresh request, no 401 console error |
| **Error UX** (owner decision: inline) | `<SectionErrorMessage onRetry>` (localized EN/FR) replaces silent-empty on every migrated surface. | component tests + code |
| Dedupe upgrade | Co-mounted sections share cache entries: ONE `/api/articles/featured` for three consumers; RTKQ also absorbed the StrictMode double-fetch (M4 had 2× detail GETs; now 1×). | network tab |
| Deletions | `articlesSlice`, `recommendationsSlice`, `userContentSlice`, `catFactsSlice`, `articleService`, `catFactService`/`catFactApi`, `useSubCategoryPage`, dead `useArticleFilters`; `articleApi`/`userArticleApi`/`userArticleService` trimmed to fire-and-forget calls; `CategoryBar` is pure navigation now; `NavBar` no longer pre-dispatches search. | grep; gates |
| Hooks reworked | `useListInfiniteScroll`/`useSearchInfiniteScroll` are now thin scroll drivers calling `fetchNextPage`; `usePagination` runs on the page-mode query (adds isError/refetchPage). | tests; browser scroll |
| Tests | Suites tied to deleted thunk internals removed/rewritten (BaseNewsSection, NewsCard mock RTKQ hooks; wrapper tests pin prop contracts). Count 225→182; endpoint-level coverage is M7's mandate. F015's URL-encoding regression coverage note: RTKQ `params` uses URLSearchParams internally — the failure mode can't recur; M7 adds an endpoint URL test anyway. | 182/182 green |
| Bundle | +35 kB raw / +13 kB gzip (RTKQ runtime) → 650 kB/210 kB total. Perf milestone owns splitting/deferral (F046). | build output |
| CLAUDE.md | State Management + Data Flow sections updated to the RTKQ reality (full docs pass remains M8). | — |

Console after M5: only the form-field naming issue (M6). Gates: build ✅ · 182/182 ✅ · lint 0 errors, 4 warnings (was 6 — SubCategoryPage strings now use new `PAGES.SUBCATEGORY.*` keys, en+fr).

## M7 results (2026-07-12 — done pending owner commit, branch `audit/m7-testing`)

Implements D4 (Playwright e2e, Cypress removed) + F038 (CI stood up). Owner decisions: **GitHub Actions** (advisory to Azure PRs), **chromium-only**, **stubbed API** via `page.route`.

| ID | Resolution | Verified how |
|----|-----------|--------------|
| F025 | **Done** — all 8 Cypress flows ported to Playwright (`e2e/*.spec.ts`), plus **2 new flows** the Cypress suite never covered: language switch (EN↔FR in-place, verifies no page remount via a `<main>` DOM marker + `lang=fr` refetch) and news-list view-mode toggle (pagination↔scroll, collapse). Cypress fully removed: `cypress/`, `cypress.config.ts`, `tsconfig.cypress.json`, `cy:*` scripts, and the `cypress` devDependency all gone. | **42/42 e2e pass** (~10s) against the prod build with stubbed API |
| F024 | **Done (rescoped by M5)** — the slices/thunks the seed wanted tested were deleted in M5; coverage now targets the RTKQ layer + surviving hooks. Added: `store/apiEndpoints.test.ts` (URL construction incl. **F015 special-char regression**, DTO→domain mapping, `isError` surface), `hooks/useListInfiniteScroll.test.ts`, `hooks/useSectionDropdown.test.ts`, `hooks/usePagination.test.ts`. **Unit suite 181 → 201.** Page-level rendering is covered end-to-end by the Playwright suite (stronger than vitest smoke tests: real build, real routing, stubbed network). | 201/201 unit pass |
| F038 | **Done** — `.github/workflows/ci.yml`: two jobs (**unit**: lint→build→vitest; **e2e**: build→Playwright w/ chromium), on every PR + push to `main`/`development`/`refactor/ui-audit`. Concurrency-cancels superseded runs; uploads the Playwright report artifact. No secrets needed (API is stubbed). Advisory to Azure PR merges (documented in `CLAUDE.md`). | workflow validates locally; jobs mirror the local gate sequence |
| — | **Regression coverage confirmed:** F015 (URL encoding) has both an endpoint unit test and lives through RTKQ's `URLSearchParams`; F014 (getTopTen safe default) retained; F047/F050 (history/auth) exercised by the auth e2e flow. | tests green |
| — | **New `.gitignore`:** Playwright artifacts (`test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`). `CLAUDE.md` Build & Deploy + new CI section updated to the Playwright/CI reality. | — |

Gates: build ✅ · **201/201** unit ✅ · **42/42** e2e ✅ · lint 0 errors 0 warnings ✅.

## M6 results (2026-07-11 — done pending owner commit, branch `audit/m6-consistency`)

**Headline: Lighthouse accessibility 100/100/100** on home/article/search with real data (M0 baseline: 93/82/79); Best Practices 100. **Lint fully clean: 0 errors, 0 warnings** (first time). Remaining Lighthouse failures are only M8 SEO items (meta-description, robots-txt, llms-txt).

| ID | Resolution | Verified how |
|----|-----------|--------------|
| F017 | **Done** — remaining 19 hardcoded colors → tokens (was 37 pre-M3/M5 deletions). Includes a real bug: `LoadingOverlay` was hardcoded `bg-white` → white flash in dark mode. Two deliberate exceptions documented in-code: LikeButton's red-300 heart; NewsCard categories (see below). | grep ≈ 0; gates |
| F018 | **Done** — 51 same-dir `./` imports → `@/` (cross-directory ones were already 0). | grep = 0; tsc |
| F020 | **Done** — TODO catalogue: only `AppLogo` "replace logo" survives → recorded as **owner backlog: real logo asset wanted** (F051). "enum" TODOs died with M3/M5 rewrites. | grep |
| F021 (O3) | **Resolved: Keep `console.error`** — surviving uses are legit catch-logging; RTKQ middleware can centralize later if ever needed. | — |
| F022 | **Done** — every `<img>` has an alt (most fixed en route in M2–M5.5; `EditorCardHorizontal` aligned with its Vertical twin; maintenance image localized). | script scan = 0 missing |
| F023 (remainder) | **Done** — 11 inputs/selects got `id`/`name`/localized `aria-label` (search bars ×3, filters ×5, subscribe email + autocomplete, pagination controls); icon-only controls labelled (LikeButton + aria-pressed, ShareButton, social links, account icon, search submits, home logo link). DevTools "form field without id/name" issue (×7) gone. | Lighthouse 100s; console clean |
| F026 | **Closed** — structural key-path parity **perfect: 220/220, zero asymmetry**; all 14 identical EN/FR values are legitimately identical (proper nouns / same-word French). Last 4 hardcoded-string warnings fixed: `UnderMaintenance` translated (purr-pun preserved: "purr-oduction"/"d'arrache-patte"); AppTitle + Contact handles converted to literal expressions with why-comments (brand wordmark / proper nouns — not translatable copy). | parity script; lint 0 warnings |
| F033 | **Closed** — zero `forwardRef` anywhere; remaining setState-in-effect uses are legitimate (localStorage sync, page-reset). | grep |
| Heading order | `SectionHeader` h3→h2, `SubscribeForm` h4→h2, `CatFactsCard` h4→h3 — Tailwind preflight makes these zero-visual-change. | Lighthouse heading-order passes |
| JSDoc | 18 undocumented exported functions across hooks/services/utils/context documented — coverage now 100% of exports. | script scan |
| **F051 (new, owner decisions)** | **Two deliberate color changes for WCAG AA** (per D1 "colors can be refactored"): (1) light-mode `--brand` amber-600 → **amber-700** (3.3:1 → 4.9:1) — light-mode links/active states one step darker, dark mode untouched; (2) NewsCard light-mode category colors: semi-transparent rgba → solid 700-shades, same hues (e.g. technology cyan now readable). **Easy to revert if the look bothers you** — say so and I'll restore + document as known AA failures. Plus: owner backlog item — replace placeholder house-icon logo. | Lighthouse color-contrast passes; screenshot `m6-after/home-light-final.png` (local) |
| Verification note | First Lighthouse round accidentally ran against CORS-blocked pages (preview port not allowed by backend) — which incidentally proved the inline error UX renders everywhere. Final scores are from the dev server with real data. | — |

Gates: build ✅ · 181/181 ✅ · **lint 0 errors 0 warnings** ✅.

## M5.5 results (2026-07-11 — done pending owner commit, branch `audit/m5.5-interactive-sweep`)

Interactive component sweep per the locked scope rule (base-ui only where the platform lacks a primitive; native stays native). Per-component verdicts:

| Component | Verdict | What changed | Verified how |
|---|---|---|---|
| `MobileMenu` (drawer) | **Adopt** — new `ui/Sheet.tsx` (shadcn registry base on @base-ui Dialog; adapted: react-icons, PascalCase, i18n close label, fixed lowercase Button import that would break Linux CI) | Gets focus trap, Escape close, `role="dialog"`, scroll lock, backdrop, and **focus return to the hamburger** (finalFocus ref plumbed NavBar → MobileMenu, React 19 ref-as-prop on HamburgerButton — no forwardRef). Swipe-right-to-close + live drag offset preserved on top. Manual body-scroll-lock effect deleted. | browser: full-width dialog, Escape closes, focus lands back on hamburger; 181/181 |
| `LanguageSwitcherDesktop` | **Adopt** — rebuilt on `ui/DropdownMenu` | Hand-rolled click-outside/escape listeners deleted; arrow keys + aria-haspopup/expanded free; checkmark on active language kept. | browser: aria attrs + focused menuitem on open |
| `LanguageSwitcherMobile` | **Keep-with-fix** — in-flow disclosure, not a popup | Trigger div → real `<button aria-expanded>`. | code |
| `ThemeSelector` | **Keep** — segmented control of real buttons with aria-pressed is already accessible | Labels + aria-labels localized (new `THEME.*` keys en/fr; typed-i18n `as const satisfies` pattern). | code; gates |
| `ThemeToggle` | **Keep** | Labels localized. | code |
| `HamburgerButton` | **Keep-with-fix** | ref-as-prop added; "Toggle menu" localized (`NAVIGATION.TOGGLE_MENU`). | browser |
| FilterBar + search `<select>`s, pagination controls, all form inputs, buttons | **Keep-native (recorded)** — native elements are the battle-tested primitive; replace only if a real design need emerges. | none | — |

Also: `COMMON.CLOSE`, `NAVIGATION.MENU_LABEL` keys added (en/fr). Console clean. Gates: build ✅ · 181/181 ✅ · lint 0 errors (4 known M6 warnings).

## M5 addendum — F050 (2026-07-10, owner-reported during M5 review)

**Two related getHistory bugs, both fixed on `audit/m5-rtk-query`:**

1. **Stale history within 60s:** `recordArticleRead` was a bare fetch outside RTK Query, so reading an article never invalidated the `History` tag — returning to the account page within `keepUnusedDataFor` (60s) served the cached, stale list. **Fix:** `recordArticleRead` is now a mutation with `invalidatesTags: ["History"]` (still triggered without awaiting — the fire-and-forget contract holds). The empty `userArticleService`/`userArticleApi` files are deleted; all 7 call sites use the hook.
2. **Fast logout→login left history empty:** a race — the `main.tsx` logout listener subscribes to authStore *before* React, so its `invalidateTags` triggered a refetch while the account hook was still subscribed for one tick → the request ran as anonymous → 401 → the cache entry was error-poisoned and retained 60s → RTKQ does not auto-retry errored entries on resubscribe. **Fix:** `getHistory` now has `keepUnusedDataFor: 0` — per-user data never outlives its subscriber, so a poisoned entry dies on unsubscribe and re-login always fetches fresh.

Residual (documented): like-status entries can theoretically hit the same logout race, but LikeButton degrades gracefully (falls back to the card's baked-in count) and self-heals in ≤60s — left as-is; revisit if observed. Verification: gates green (181/181); anonymous flows browser-verified; **the two authed repros need owner re-testing** (no test credentials available to Claude).

## M4 results (2026-07-09 — done pending owner commit, branch `audit/m4-correctness`)

| ID | Resolution | Verified how |
|----|-----------|--------------|
| F014 | **Done** — `getTopTenArticles(): Promise<ArticleInfo[]>` returns `[]` in catch. Note: a test literally asserted the buggy undefined return — updated to assert the safe contract. | regression test |
| F015 | **Done** — `fetchArticlesByCategory`/`BySubCategory` → `URLSearchParams`. This was live-broken: real sub-categories like "Food & drink industry" truncated at the `&`. | new `__tests__/api/articleApi.test.ts` proves encoding + no bogus params |
| F044 | **Resolved — not a frontend bug.** Frontend params correct. Probed the API: every "unrelated" result matches the query as a **substring** ("va**cat**ion", "**cat**tle", "communi**cat**ion"). Owner's stated contract is *word* matching → **backend ticket recommended**: switch keyword search to word-boundary matching. | curl probe of `/api/articles/search/keyword?q=cat` |
| F048 | **New + Fixed** — `eslint-plugin-react-hooks` was registered but its **rules were never enabled**; the hooks safety net was silently off. Enabled `rules-of-hooks` (error) + `exhaustive-deps` (warn). Result: 0 rules-of-hooks errors, 7 exhaustive-deps warnings — all triaged and resolved (below). | lint |
| F047 | **New + Fixed (user-visible)** — `ArticlePage`'s single effect keyed on `[id]` ran before the silent token refresh resolved, so **logged-in users landing directly on an article never got a reading-history entry**. Split into two effects: view-count once per id (deliberately not auth-keyed — would double-count), history-record keyed on `[id, isAuthenticated]`. | code + runtime network check |
| F033 (partial) | `useFilteredArticles` converted from setState-in-effect to `useMemo` (derived data; double-render + momentary stale results eliminated). Remaining effect-audit items stay with M6. | code; tests |
| — | Mechanical dep fixes: `PopularSection` (+dispatch), `useLocalStorage` (+key), `useSectionDropdown` (+sectionKey/context fns — latent stale-memo), `MobileSearchBar` (+onQueryChange). `MobileMenu` got a **justified** disable (location-only is intentional: adding `menuOpen` would close the menu the moment it opens). | lint clean |
| — | **Error-contract sweep verdict (Keep, documented):** reads → typed safe default + console.error (silent-empty; error UX deferred to M5 per owner); actions (auth/subscribe/like/record) → throw user-friendly messages that forms display. Uniform after F014. | read all service catches |
| — | **Deferred to M5 (structural, per owner):** in-flight old-language thunk landing after slice reset (RTKQ request keying/abort solves); silent-empty error surfaces (RTKQ `isError`); deep pagination-edge audit (RTKQ reworks pagination fetching). | — |
| — | **Documented, not bugs:** StrictMode double-fires effects in dev → dev view-counts inflate 2× (prod fires once; verified via network tab). `audit_docs/schemas/README.md` route names (`/article-info`, `/article-top-ten`) don't match the live routes the frontend uses (`/api/articles`, `/api/articles/top`) — backend docs drift, informational. | network tab; curl |

| F049 | **New + Fixed (owner-reported)** — IDE showed `state.article: unknown` in selectors: **circular type dependency** (store.ts imports slice reducers; 3 slices imported `RootState` back from store.ts; `RootState = ReturnType<typeof store.getState>` closes the cycle). `tsc -b` resolved the cycle by luck of ordering, but the IDE's tsserver collapsed to `unknown` — killing editor type safety/autocomplete. Fix: slices no longer import RootState; thunk `condition`s type `getState()` structurally against only the slice they read (e.g. `getState() as { catFacts: CatFactsState }`). Type-only change, zero runtime impact. | tsc clean; 225/225; IDE diagnostics clear after TS-server restart |

Gates: build ✅ · **225/225** tests (2 new) ✅ · lint 0 errors (6 known i18n warnings) ✅.

## M3 results (2026-07-09 — done pending owner commit, branch `audit/m3-components`)

**D1 scope clarified by owner:** shadcn is the *base/standard* — registry components are pulled for their accessible structure, then **adapted into our own** (react-icons, app tokens, app styling), never verbatim copies. **O2 resolved: react-icons stays the icon standard**; `lucide-react` removed (named react-icons imports are tree-shaken to ~0.5–2 kB/icon — efficiency-equivalent to inline SVG at this scale).

| ID | Resolution | Verified how |
|----|-----------|--------------|
| F008 | **Done** — `SectionDropDown` rebuilt on `@base-ui/react` Menu (via adapted shadcn `dropdown-menu`); `SectionHeaderExpandable` now composes it (the verbatim inlined copy is deleted). | keyboard walkthrough (below); gates |
| F009 | **Done** — duplicate `DropDownOption` interface removed; single source in `useSectionDropdown.ts`. | grep |
| F010 | **Done** — `EditorsSection` + `CatFactsSection` consolidated with `variant="sidebar"|"mobile"` prop; `MobileEditorsSection`/`MobileCatFactsSection` deleted. **StaffPicks kept split by design** (mobile bundles a hero + card carousel vs. desktop text links — ~60% different) but now shares data loading via new `useFeaturedArticles()` hook. | mobile screenshot matches baseline structure; gates |
| F011 | **Done** — `SectionShell` extracted (visible/bordered/mobileOnly/className); migrated Popular, Recommended, EmptyState, BaseNewsSection + the consolidated sections. | build; screenshots |
| F012 | **Done** — renamed `useListInfiniteScroll` (article lists) / `useSearchInfiniteScroll` (search); all call sites + test mocks updated. | grep; 223/223 tests |
| F013 | **Done** — `ExpandableSection` chevron is now a real `<button aria-expanded aria-label>`; its dropdown-lookalike markup replaced. | code + keyboard |
| F016/F023 (dropdown portion) | **Done** — triggers are real buttons with `aria-haspopup="menu"`/`aria-expanded`/localized `aria-label`; menu has `role="menu"`, items `role="menuitem"`. **Verified in-browser:** Enter opens + focuses first item → ArrowDown navigates → Escape closes + focus returns to trigger. Remaining a11y items (imgs, form labels) stay with M6. | chrome-devtools scripted walkthrough |
| — | **Bonus fix:** the old dropdown panel was hardcoded `bg-white text-gray-700` — unreadable in dark mode. New panel uses popover tokens: verified dark = slate-800 bg / slate-100 text. | computed styles |
| F046 | **New (M8/M9 perf)** — `@base-ui/react` menu machinery grew the bundle 456→615 kB raw (142→197 kB gzip). One-time base shared by all future primitives (M5.5), but must be revisited in the perf milestone (code-splitting / manualChunks). | build output |
| — | New i18n key `DROPDOWN.SECTION_OPTIONS` added to en+fr. Files touched during M3 were tokenized in passing (`border-gray-400`→`border-border`, `hover:text-amber-600`→`hover:text-brand`, `text-gray-800`→`text-foreground`). Three "instead pass in an enum maybe" TODOs resolved by the consolidation (F020 partial). | lint i18n rule; grep |

Console after M3: only the known F043 401. Gates: build ✅ · 223/223 ✅ · lint 0 errors ✅.

## M2 results (2026-07-09 — done pending owner commit, branch `audit/m2-tokens`)

| ID | Resolution | Verified how |
|----|-----------|--------------|
| F001 | **Done** — the P0. One unified token system: brand values in `:root`/`.dark`, `@theme inline` mapping (the documented Tailwind v4 pattern, context7 → tailwindcss.com colors.mdx). Legacy app `@theme` + `html.dark` block deleted; shadcn taupe values replaced with brand palette. ~300 utility usages renamed across 51 files per [`token-mapping.md`](./token-mapping.md). | utility probe: light `text-brand`=#d97706 amber-600, ramp gray-800/600/500; dark amber-400 + slate ramp — **identical to production reference**; screenshot grid in `m2-after/` matches `baseline/intended-local`; gates green (223/223, lint 0 errors) |
| F002 | **Done** — `@layer base` reconciled: body keeps brand font/colors/transition via tokens; `* { border-border }` kept (shadcn-canonical) with `--border` = brand gray-400; shadcn `--radius` remap **dropped** (it had silently inflated all existing `rounded-*`); `html { font-sans }` gone. | screenshots; gates |
| F003 | **Done** — **O1 resolved: Tinos + Cardo** (owner choice from side-by-side renders `m2-after/fonts-*.png`). Noto Sans + Playfair Display removed; Cormorant Garamond dropped from the Google Fonts import. | build output; screenshots |
| F034 | **Done (Keep)** — `@import "shadcn/tailwind.css"` audited: only data-state variants + scroll-fade/shimmer utilities, **zero color tokens**. Kept; shadcn components need it. | read `node_modules/shadcn/dist/tailwind.css` |
| F042 | **Done** — `@fontsource-variable/noto-sans` + `playfair-display` uninstalled; all 13 woff2 subsets (~530 kB) gone from the build; CSS 51→47.5 kB. Remaining: Google Fonts `@import` is still render-blocking → self-host Tinos/Cardo in M8. | build output has no woff2 entries |
| F045 | **New (documented, deferred)** — pre-existing drift: app files used both `bg-accent` (amber-600) and `bg-accent-bg` (amber-500) for fills — two amber fill shades in production. M2 preserved both exactly (`bg-brand` vs `bg-primary`); consolidation is a deliberate one-line palette decision for the owner, flagged in `token-mapping.md`. | grep + mapping table |

Notes: `NewsCard` categoryColor and `AppTitle` `dark:invert` exceptions untouched. F017's raw-gray hardcoded colors (e.g. `border-gray-400`) remain — that sweep is M6, now against a trustworthy token system. Console after M2: only the known F043 401 — nothing new.

## M0 baseline findings (added 2026-07-09 — verified live, not proposals)

Full evidence in [`baseline/report.md`](./baseline/report.md), [`baseline/gates.md`](./baseline/gates.md), [`baseline/lighthouse.md`](./baseline/lighthouse.md).

| ID | Sev | Verdict | Location | Finding | Milestone | Status |
|----|-----|---------|----------|---------|-----------|--------|
| F040 | P1 | Fix | `cypress/e2e/auth.cy.ts:145-146`, `cypress/support/commands.ts:114`, `cypress.config.ts:9` | **Lint gate is red**: 3 errors + 2 warnings in Cypress files (plus 6 hardcoded-string warnings belonging to F026). Cypress dies in M7 (D4), but the gate must be green long before — fix the 3 trivial errors in M1. | M1 | Todo |
| F041 | P2 | Fix | `package-lock.json` (vite chain) | `npm audit`: **21 vulns (12 high)**, all vite dev-server / launch-editor. Dev-time exposure only; `npm audit fix` claims to resolve. Apply + re-run gates. | M1 | Todo |
| F042 | P2 | Fix | build output / `@fontsource-variable/*` | **~530 kB of woff2** shipped: 13 Noto Sans + Playfair subsets (Devanagari, Cyrillic-ext, Vietnamese…) for an EN/FR site. Dead weight even if O1 picks Noto/Playfair (subset properly); fully dead if Tinos/Cardo wins. | M2 (O1) / M8 | Todo |
| F043 | P3 | REFACTOR-eval | `AuthContext` silent refresh (`/auth/refresh`) | Every anonymous page load logs a **401 console error** (silent-refresh attempt with no session); fails Lighthouse `errors-in-console`. Consider a session-hint check before refreshing, in the M5 `baseQueryWithReauth` design. | M5 | Todo |
| F044 | P2 | Verify | keyword search backend behavior | `/search?q=cat` (keyword mode) returned a page of seemingly unrelated articles — relevance or fallback-to-all suspect. Verify against backend contract. | M4 | Todo |

**M0 verifications of seeded rows:**
- **F001/F034 CONFIRMED with hard evidence:** `text-accent`, `text-secondary`, `text-muted` utilities all render identical taupe `oklch(0.268 0.011 36.5)` while the app's `--color-*` vars still hold correct amber/slate values — `@theme inline` bypasses them. Nuance: the app's unlayered `body` rule *beats* shadcn's `@layer base` body rule, so body font/background survive; damage is utility-level. F002's severity is therefore slightly lower than seeded (body not overridden) but the `* { border-border }`/`--radius` parts stand.
- **F014 CONFIRMED** by code read (`getTopTenArticles` catch has no return).
- Counts verified: 8 hooks, 4 slices, 18 pages, 19 test files (223 tests), 8 Cypress specs.
- Reference identity captured from production: amber-400 accent / slate ramp / Tinos + Cardo body/headings (matches `CLAUDE.md`).
- Lighthouse a11y baselines: home 93 / article 82 / search 79 — failed audits pre-routed to M2/M3/M6/M8 in `baseline/lighthouse.md`.

## Decisions

**Resolved 2026-07-09 (see `AUDIT_PLAN.md` Decision Log — do not re-litigate):**

1. ✅ **D1 — shadcn/ui: adopt fully.** Owner accepts delayed ship for better UI consistency; open to palette refactoring. Gates M1–M3 (F001–F007, F034).
2. ✅ **D2 — RTK Query: migrate** (M5) — F031.
3. ✅ **D3 — React 19 form Actions: defer post-ship** — F032.
4. ✅ **D4 — e2e: Playwright**, Cypress removed after parity; plus new CI — F025, F038.

**Still open (🧭 — resolve at milestone kickoff):**

1. **O1 — Typography:** Tinos/Cardo (current brand) vs Noto Sans/Playfair Display (shadcn) — F003. Resolve at M2 start with side-by-side screenshots.
2. **O2 — Icons:** default is lucide-react (per D1/`components.json`); confirm at M3 start — F007.
3. **O3 — `console.error` policy:** keep vs logger abstraction — F021. Revisit in M5/M6 (RTKQ middleware may centralize error logging).

## Things the prior pass believed were fine (still confirm)

Layering api→service→mapper is clean · `?lang=` on every article endpoint · all 9 `dark:` usages are the documented `NewsCard`/`AppTitle` exceptions · all 23 `console.*` are legit `console.error` · en/fr key **counts** match · 0 `dangerouslySetInnerHTML` · TS strict holds (0 explicit `any` found). **Re-verify each — "believed fine" is not "verified fine."**

---

_Seed authored by a prior static pass. Treat as a checklist of "did you also see these?", overwrite freely, and trust your own independent evaluation over anything written here._
