# Catire Time Frontend — Audit Findings Log

> Companion to [`AUDIT_PLAN.md`](./AUDIT_PLAN.md) (v2). Severity/verdict definitions live in the plan (§2). As findings are actioned, migrate rows into this working schema:
>
> ```
> | ID | Milestone | Sev | Verdict | Location (file:line) | Finding | Standard it fails (source) | Fix applied | Status | Verified how |
> ```
>
> `Status` ∈ `Todo | In-progress | Done | Deferred(reason) | Rejected(reason) | Needs-decision`. Next free ID: **F045**.
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
