# Catire Time Frontend — Maintenance & Modernization Plan (v2)

> **Repo:** `news-ui` · **Branch:** `development` · **Plan revised:** 2026-07-09
> **Scope:** React 19 + TS + Redux Toolkit + Tailwind v4 satirical-news frontend (~166 TS/TSX files, ~12.5k LOC).
> **Prime directive:** Make the codebase *consistent, correctly layered, non-redundant, bug-free, modern, and documented*. There is **no hard ship deadline** — quality over speed. Behavior/visual changes are allowed where a milestone explicitly calls for them (design-system unification, component migration); everywhere else, preserve behavior and prove it.

This is v2 of the audit plan. v1 was written around unresolved decisions; those are now **resolved** (see Decision Log). The flat phase list is replaced by **milestones** with entry/exit criteria and an explicit dependency order. The findings log lives in [`AUDIT_FINDINGS.md`](./AUDIT_FINDINGS.md) — this plan references findings by ID and never duplicates their content.

---

## 0. Decision Log

Resolved with the owner on 2026-07-09. These are settled — do not re-litigate them; do flag new information that would genuinely invalidate one.

| # | Decision | Resolution | Consequence |
|---|---|---|---|
| D1 | shadcn/ui: adopt or revert? | **Adopt fully.** Owner accepts a delayed ship for better UI consistency, and is open to refactoring brand colors where they conflict. | M1–M3 wire shadcn correctly, unify to **one** token system themed to the brand, and migrate hand-rolled primitives to shadcn components. |
| D2 | Data layer: keep hand-rolled api/service/thunks or RTK Query? | **Migrate to RTK Query.** | M5 replaces the thunk data layer. Don't invest in the old layer beyond hotfixes (F014/F015). |
| D3 | React 19 form Actions for auth/subscribe/account forms? | **Defer post-ship.** | Log as REFACTOR-Deferred (F032); do not migrate forms this pass. |
| D4 | e2e framework of record? | **Playwright.** Rewrite the 8 Cypress specs, then remove Cypress. | M7. Also stand up CI (none exists today — see F038). |

**Still open (🧭 — resolve at milestone kickoff, not mid-edit):**

| # | Decision | Options | Default recommendation | Resolve by |
|---|---|---|---|---|
| O1 | Typography | Keep **Tinos/Cardo** (current brand, newspaper serif) vs adopt shadcn's **Noto Sans + Playfair Display** (Playfair is also a classic newspaper display face) | Present both as screenshots during M2; pick one, delete the other's imports (incl. the unused Cormorant Garamond Google-Fonts import) | Start of M2 |
| O2 | Icon library | `react-icons` (used in ~23 files today) vs `lucide-react` (shadcn default, `components.json` already says lucide) | **lucide-react** — migrating ~23 files is mechanical and shadcn components will pull it in anyway; one icon system | Start of M3 |
| O3 | `console.error` policy | Keep the 23 service-catch `console.error`s vs a small logger abstraction | Keep `console.error` (RTK Query middleware can centralize error logging later); revisit in M5 | M5 |

---

## 1. How to work this plan

**Read `CLAUDE.md` first and treat it as law** — except where this plan's decisions (D1–D4) supersede it; `CLAUDE.md` gets updated in M8 to match. When plan and `CLAUDE.md` disagree outside D1–D4, flag it instead of guessing.

**Workflow**

1. **Branch model (owner decision, 2026-07-09):** `refactor/ui-audit` is the **integration branch** for the whole program. Each milestone gets its own branch off `refactor/ui-audit` (`audit/m1-shadcn-wiring`, `audit/m2-tokens`, …) and merges back into `refactor/ui-audit` when its exit criteria pass (owner executes the merge). **`development` is not touched until every milestone is complete and verified** — only then is `refactor/ui-audit` → `development` considered. Never commit straight to `development` or `main`.
2. **One milestone = one focused set of commits — but Claude never commits.** Claude maintains [`COMMIT_PLAN.md`](./COMMIT_PLAN.md) (files to stage together + proposed lowercase-imperative message + rationale, per commit); **the owner reviews, commits, and pushes manually.** Claude runs git write operations only when explicitly asked.
3. **Keep the tree green.** After every work session, and always before merging a milestone:
   ```bash
   npm run lint && npm run build && npm run test
   ```
4. **Verify behavior, not just compilation.** Anything with a runtime surface gets checked in the running app (`npm run dev` → port 5174) with the browser MCP tools. Design-system work must be validated with screenshots in **both** light and dark mode, mobile + desktop.
5. **Log every finding** in `AUDIT_FINDINGS.md` (schema in §4 there). Update `Status` as you go. New discoveries get new IDs (next free: F040).
6. **Surface decisions, don't silently choose.** Anything 🧭 that isn't in the Decision Log stops for a human answer before mass edits.

**Guardrails — do NOT:**

- Introduce `tailwind.config.js` (Tailwind v4 is CSS-first).
- Change the public API contract or route paths without flagging it.
- Delete the blog system or any page because it "looks unused" — verify first. (Cypress removal is sanctioned by D4, but only **after** the Playwright suite covers the same flows.)
- Await `incrementArticleViewed()` — intentionally fire-and-forget; preserve this through the RTK Query migration.
- Strip existing inline comments unless the code they describe changed.
- Re-theme the per-category colors in `NewsCard` without a deliberate decision — they are a documented exception; during M2 map them onto the new system consciously, don't let them get hijacked.

---

## 2. Standards mandate (condensed)

The bar is **current industry standard**, not just internal consistency. Verify the standard against an authority, not memory:

- **context7 gate:** before labeling any finding **REFACTOR**, or asserting "the modern pattern is X" for React 19 / Redux Toolkit 2 / RTK Query / Tailwind v4 / react-router 7 / react-i18next 16, pull the current docs via context7 and cite them in the finding row. These versions are newer than training data. (Routine `Fix` items that just restore `CLAUDE.md` conventions don't need a lookup.)
- **shadcn MCP gate:** the registry is the reference implementation for component structure and a11y. Run `mcp__shadcn__get_audit_checklist` in M1; use `view_items_in_registries` before customizing any generated component.

**Verdicts:** `Keep` (already standard) · `Fix` (small in-place correction) · `REFACTOR` (design below standard — cite the source) · `🧭` (needs a human). Distinguish **defects** (broken) from **modernizations** (works, but the ecosystem moved on) — label honestly so nobody thinks working code was broken.

**Severity:** `P0` blocker (broken in production) · `P1` high (bug / architectural violation / shipping dead weight) · `P2` medium (drift, missing tests, a11y/i18n gaps) · `P3` low (hygiene, docs). Always P0/P1 before cosmetics.

---

## 3. Tooling playbook

Four MCP servers are wired in (`.mcp.json`). Use each for what it's uniquely good at:

- **`context7`** — live library docs; the standards gate above. Key lookups this plan needs: Tailwind v4 `@theme` / `@theme inline` cascade semantics (M2), RTK Query `createApi` / `fetchBaseQuery` re-auth wrapper / `transformResponse` (M5), React "You Might Not Need an Effect" (M6), react-i18next typed keys (M6).
- **`shadcn`** — registry + audit tooling. `get_audit_checklist` (M1), `search/view_items_in_registries` + `get_add_command_for_items` (M3 component selection).
- **`chrome-devtools`** — visual + performance truth. Screenshots (both themes), `list_console_messages`, `lighthouse_audit` (M0 baseline, M6, M8), `list_network_requests` (confirm `?lang=`, spot duplicate fetches — especially after RTK Query), performance traces (M8).
- **`playwright`** — user-flow verification during every milestone, **and** (per D4) the e2e framework of record: the M7 suite is written with `@playwright/test`.

**Running the app:** `npm run dev` → `http://localhost:5174`. (Note: `vite.config.ts` currently sets `host: 'localhost'`, while `CLAUDE.md` claims `0.0.0.0` — docs drift, F039.) Backend is external via `VITE_API_URL` (falls back to `http://localhost:3001`); if no backend is running, empty/error states are themselves worth auditing, but visual baselines need real data — start the backend if available.

---

## 4. Milestones

Dependency order (each row unlocks the next; M6 items can interleave with M5 where independent):

```
M0 baseline ─→ M1 shadcn wiring ─→ M2 token unification ─→ M3 component migration ─┐
                                                                                    ├─→ M6 consistency/a11y/i18n ─→ M7 tests+CI ─→ M8 perf/security/docs/ship
M4 correctness hotfixes (anytime after M0) ─→ M5 RTK Query ────────────────────────┘
```

Rationale for the order:
- **Tokens before components** (M2 → M3): shadcn components render through the token system; installing them onto a colliding palette makes every screenshot unreviewable.
- **Component consolidation before the consistency sweep** (M3 → M6): no point converting hardcoded colors in files that M3 deletes or merges.
- **Hotfixes independent of, and before, RTK Query** (M4 → M5): F014/F015 are 10-minute crash/correctness fixes; don't let them wait on a large migration that will eventually subsume them.
- **Tests after the data layer stabilizes** (M5 → M7): writing slice/thunk tests and then rewriting them for RTK Query is double work. Bug fixes in M4 still get regression tests immediately.

Sizes: **S** ≈ a session · **M** ≈ a day-ish · **L** ≈ multi-day.

---

### M0 — Baseline & safety net · **S** · _do this before touching anything_

**Objective:** a known-good, reproducible starting point and a visual record of both the *broken current state* and the *intended identity*.

- [ ] `npm ci` succeeds; record Node/npm versions.
- [ ] Run `lint` / `build` / `test` — record pass/fail. If already red, stabilize first (that's finding #1).
- [ ] Screenshot set A (current, collided state): {home, article, search} × {light, dark} × {390px, 1280px} → `audit_docs/baseline/current/`.
- [ ] Screenshot set B (intended identity), two sources: (a) check out commit `39d7353` (pre-shadcn) in a worktree, run it, capture the same grid → `audit_docs/baseline/intended-local/`; (b) capture the deployed production site (`https://www.catiretime.com`, built from `main`) → `audit_docs/baseline/intended-live/`. Together these are the reference for "the brand" during M2, since `development` currently renders the hijacked palette.
- [ ] `lighthouse_audit` on home + article + search (Performance / A11y / SEO / Best-Practices) — M6/M8 baselines.
- [ ] `list_console_messages` per page — log pre-existing runtime errors.

**Exit criteria:** both screenshot sets + Lighthouse scores saved; gate status recorded; `AUDIT_FINDINGS.md` statuses being maintained.

---

### M1 — shadcn install repair & dependency hygiene · **S–M** · fixes F004–F007, F034–F037

**Objective:** shadcn is *correctly* installed (per D1) and `package.json` tells the truth.

- [ ] Run `mcp__shadcn__get_audit_checklist`; satisfy or explicitly waive each item.
- [ ] **Literal `@/` directory (F004):** move `@/lib/utils.ts` → `src/lib/utils.ts` and `@/components/ui/button.tsx` → `src/components/ui/button.tsx`; delete the stray `@` folder. Root-cause why the CLI misfired (both `vite.config.ts` and `tsconfig.app.json` resolve `@/` → `src/` correctly — suspect CLI cwd or `components.json` handling) so future `shadcn add` lands in `src/` (F005). Verify with a throwaway `shadcn add badge` → confirm it lands in `src/components/ui/`, then keep or remove it deliberately.
- [ ] **Dependency placement (F035, F036):** `shadcn` (the CLI) and `gh-pages` are runtime `dependencies` — move to `devDependencies` (or invoke shadcn via `npx` and drop it).
- [ ] **Deprecated type stubs (F037):** remove `@types/i18next`, `@types/react-redux`, `@types/react-router-dom` — all three libraries ship their own types; the stubs are stale (v12/v7/v5 typings against v25/v9/v7 libs) and can shadow real types.
- [ ] **Formerly-dead deps (F006, re-scoped by D1):** `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@base-ui/react`, `tw-animate-css` are now *intended* — keep, and confirm each is actually consumed by the end of M3; anything still unimported then gets removed.
- [ ] **Icons (F007 / O2):** confirm lucide as the standard (default recommendation); the actual 23-file migration happens in M3 alongside component work.
- [ ] `npm audit` — triage anything actionable.

**Exit criteria:** no literal `@/` dir; `shadcn add` provably lands in `src/`; deps correctly placed; stale `@types` gone; `lint`/`build`/`test` green.

---

### M2 — Design-token unification · **M–L** · **the P0** · fixes F001–F003, F034 · 🧭 O1 (fonts)

**Objective:** exactly **one** design-token system, themed to the brand, deterministic in both themes. This is the site-wide visual regression fix.

**Current state (verified):** *three* competing token sources in `src/index.css` —
1. App `@theme` block (line ~19) + `html.dark` runtime overrides — the documented amber/gray system.
2. shadcn `@theme inline` block (line ~322) fed by oklch taupe values in `:root`/`.dark`, plus `@layer base` globals (`bg-background text-foreground`, `font-sans`, `* { border-border }`, `--radius`).
3. `@import "shadcn/tailwind.css"` (line 4) — **missed by the v1 plan**; audit what it injects before assuming the collision is only the local blocks.

Later `@theme` blocks win for duplicate keys, and `@theme inline` bypasses the app's `html.dark` overrides — so overlapping names (`primary, secondary, muted, accent, border, background, foreground, ring, input, card, popover, destructive`) render shadcn taupe while app-unique names (`surface, elevated, accent-bg, hover-bg, …`) still render amber/gray: a half-hijacked palette.

**Target architecture (per D1 — adopt):** converge on **shadcn's token vocabulary as the single system**, themed to the brand:

- [ ] context7 → Tailwind v4: confirm `@theme` merge and `@theme inline` semantics before restructuring.
- [ ] Re-theme shadcn's `:root` / `.dark` variables to the brand palette (amber accent family, warm gray/slate neutrals) using screenshot set B (`audit_docs/baseline/intended-local/`) as the reference. Owner is open to palette refinement — propose deltas with screenshots, don't sneak them in.
- [ ] Map every app-unique token (`surface`→`background`, `elevated`→`card`, `accent-bg`→`primary`?, `hover-bg`, `control-active`, `success/warning/error`, `border-subtle`, `placeholder`, `disabled`…) into the shadcn vocabulary, **extending** the shadcn block with genuinely app-specific tokens where no equivalent exists. Produce a written old→new token mapping table (drives the M3/M6 component sweeps).
- [ ] Delete the app's legacy `@theme` block and `html.dark` overrides once nothing references the old names; dark mode runs through shadcn's `.dark` class (same `html.dark` mechanism `AppSettingContext` already toggles — verify).
- [ ] **Fonts (O1):** render both options, get the owner's pick, keep exactly one heading + one body declaration; delete the loser's `@import`s/`@fontsource` packages and the unused Cormorant Garamond Google-Fonts import (its `@font-face` is already commented out).
- [ ] Reconcile `@layer base` globals (`* { border-border }`, `body`, `--radius`) so they express the brand deliberately rather than accidentally.
- [ ] Decide `NewsCard` category colors' place in the new system (documented exception — keep behavior, re-verify appearance).
- [ ] Remove the large commented-out Vite-boilerplate CSS blocks in `index.css` while in there (F020-adjacent hygiene).

**Exit criteria:**
- No Tailwind utility name is defined by two token sources; computed styles confirm accent = brand amber (or the owner-approved refined palette) in **both** modes.
- Screenshot grid matches `audit_docs/baseline/intended-local/` except for owner-approved deltas; no unexplained shifts.
- Console clean; gates green. Token mapping table saved (append to `AUDIT_FINDINGS.md` or `audit_docs/`).

---

### M3 — Component migration & redundancy elimination · **L** · fixes F008–F013, F016, F023, O2

**Objective:** hand-rolled interactive primitives become shadcn components (accessibility for free), duplicated sections collapse into shared building blocks, one icon library. This intentionally merges v1's "redundancy" and "a11y-structure" work — migrating to primitives *is* the fix for both.

- [ ] **Dropdowns first (F008/F009/F013/F016/F023):** replace `SectionDropDown`, the verbatim copy inlined in `SectionHeaderExpandable`, and the chevron block in `ExpandableSection` with shadcn `dropdown-menu` (pull registry source via shadcn MCP; check its examples). This kills: the duplicated click-outside effect, the duplicated `DropDownOption` type (keep the `useSectionDropdown.ts` export), the non-focusable `<svg onClick>` chevrons, and the missing `aria-expanded`/`aria-haspopup` in one move.
- [ ] **`<SectionShell>` (F011):** extract the copy-pasted `border-b py-6` + `isVisible`/collapse wrapper used by ~10 section components; migrate them.
- [ ] **Mobile/desktop pairs (F010):** collapse each ~90%-identical pair (`EditorsSection`/`MobileEditorsSection`, CatFacts, StaffPicks) into one responsive component or a shared core + thin orientation wrappers. Where mobile genuinely differs, keep the split but share the inner logic. Prove with playwright screenshots at 390px + 1280px that nothing shifted.
- [ ] **`useInfiniteScroll` ×2 (F012):** merge behind one signature or rename unambiguously (`useListInfiniteScroll` vs `useSearchInfiniteScroll`); update the `CLAUDE.md` note in M8.
- [ ] **Icons (O2):** migrate the ~23 `react-icons` files to lucide; remove `react-icons`.
- [ ] Audit any further shadcn components worth adopting for existing UI (dialog? select? toggle-group for the view-mode chips?) — adopt only where it *replaces* hand-rolled complexity; log the rest as REFACTOR-Deferred.
- [ ] JSDoc on everything extracted/new (per `CLAUDE.md`).

**Exit criteria:** no byte-identical component bodies; dropdowns keyboard-operable with correct ARIA (manual keyboard walkthrough + snapshot); one icon library in `package.json`; screenshots unchanged at both breakpoints except approved deltas; gates green.

---

### M4 — Correctness hotfixes & bug hunt · **S–M** · fixes F014, F015 · _can start any time after M0_

**Objective:** kill known crash/correctness bugs now, cheaply — even though M5 later replaces this layer. Each fix gets a regression test immediately.

- [ ] **F014:** `getTopTenArticles` (`articleService.ts:137`) returns `undefined` on error — add typed `: Promise<ArticleInfo[]>` return + `return []` in the catch; check call sites.
- [ ] **F015:** `fetchArticlesByCategory`/`BySubCategory` build URLs by raw interpolation — route through `URLSearchParams` like the other endpoints; test with a special-char category.
- [ ] Sweep every `service/` catch for swallowed errors masking outages (silent `[]` needs an intended empty-state UI — verify each).
- [ ] Hunt latent async bugs: missing effect deps, rapid language/category-switch races (in-flight old-lang fetch overwriting new), unguarded `.map`/`.length` on nullable API data, pagination edge cases (last page, empty results, count mismatch).
- [ ] Verify the i18next `languageChanged` → slice-reset → `<main key>` remount chain has no stale-data window (playwright: toggle rapidly). Note findings — M5's RTK Query design should solve this class structurally (lang in the query key).

**Exit criteria:** F014/F015 fixed **with regression tests**; async-race findings logged (fixed here if small, routed to M5 if the RTK Query design absorbs them); gates green.

---

### M5 — RTK Query migration · **L** · implements D2 · supersedes F031

**Objective:** replace the hand-rolled `api/` + `service/` + thunk layer with RTK Query, keeping the domain-type boundary and the documented behaviors.

**Design first, then migrate (context7 → RTK Query docs throughout):**

- [ ] **Design doc (short, in `audit_docs/`):** one `createApi` (or one per backend concern) with `fetchBaseQuery`; a `baseQueryWithReauth` wrapper reproducing `authFetch`'s 401 → silent refresh → retry; `transformResponse` calling the existing `mappers/` so **components still never see DTOs**; tag-based invalidation for likes/history; error contract (what components receive on failure — RTKQ's `isError` replaces the silent-`[]` convention, which is *better*: decide per-surface whether to show error UI or empty state, and record it).
- [ ] **Language:** include `lang` in every article-endpoint query arg (from `getApiLang()`), so EN↔FR switches refetch via cache-key change. Evaluate retiring the `<main key={lang}>` remount hack + manual slice resets — that's the modernization payoff; keep the hack only if something still needs it, and say why.
- [ ] **Migrate slice-by-slice**, gates green after each: `catFactsSlice` (smallest) → `recommendationsSlice` → `userContentSlice` (mutations + invalidation) → `articlesSlice` (largest: home/category/search/detail/topTen; detail caching by id and thunk-`condition` dedupe both come free from RTKQ caching).
- [ ] Preserve documented behaviors: `incrementArticleViewed` stays fire-and-forget (mutation, not awaited); infinite-scroll pagination (RTKQ + `merge`/`serializeQueryArgs` or keep page-composition in the component — decide in the design doc).
- [ ] Auth stays in `authStore` (not RTKQ) unless the design doc argues otherwise; `AppSettingContext` untouched.
- [ ] Delete superseded `api/`/`service/`/thunk code + their now-dead tests **only after** each replacement is verified in-app (network tab: no duplicate fetches, `?lang=` present on every article call).
- [ ] Update mapper/service tests → endpoint tests (`transformResponse` units + a store-level integration test per endpoint group).

**Exit criteria:** all four slices replaced; no component imports from `api/` or `service/` remain (grep); language toggle refetches without manual resets (or documented exception); no duplicate in-flight fetches from co-mounted mobile+desktop sections; gates green; design doc committed.

---

### M5.5 — Interactive component sweep · **L** · _owner-added 2026-07-09_ · extends D1

**Objective:** migrate the remaining hand-rolled interactive components onto accessible primitive bases, following the pattern established in M3: **pull the shadcn/base-ui component as the accessible base, then adapt it into our own** (our tokens, react-icons, our styling, PascalCase filename) — never a verbatim registry copy. Owner explicitly scoped this out of M3 ("it is a big job, it should get a milestone of its own").

**Scope rule (owner-locked 2026-07-09, also in `CLAUDE.md`):** *base-ui only where the platform lacks a primitive* — menus, dialogs/drawers, tooltips, comboboxes, toggle groups. **Native elements stay native** (`<button>`, `<input>`, `<select>`); shadcn recipes may be borrowed as styling-only for those. Concretely: the base-ui candidates are `LanguageSwitcherDesktop`/`Mobile` (Menu + radio items), the theme selector if popover-style (Menu), and `MobileNavigation` (Dialog/Drawer — hand-rolled focus traps are the riskiest thing in a11y). The FilterBar/search `<select>`s, all form inputs, and all buttons are **keep-native** verdicts unless a real design need emerges.

- [ ] Inventory every remaining hand-rolled interactive: FilterBar/search-filter `<select>`s, pagination controls, theme/language switchers, mobile menu, auth/subscribe form inputs, LikeButton, BackToTopButton, any dialog/toast patterns.
- [ ] For each: pull the registry equivalent (shadcn MCP), compare a11y structure, decide adopt-and-adapt vs keep-with-fixes (native `<select>` is already accessible — replace only if the design-consistency win is real; record the verdict per component).
- [ ] Adapt per the M3 pattern: swap lucide → react-icons, registry styling → app tokens, JSDoc.
- [ ] Verify each swap with screenshots (both themes) + keyboard walkthrough; gates green after each component group.

**Exit criteria:** every interactive component either sits on an accessible base or has a recorded keep-verdict with its a11y gaps fixed by hand; one visual language across controls; gates green.

---

### M6 — Consistency, a11y & i18n sweep · **M** · fixes F017–F022, F026, F033 · _after M3+M5+M5.5 so it sweeps final code_

**Objective:** the surviving code obeys `CLAUDE.md` + the new token system uniformly, meets WCAG 2.1 AA basics, and EN/FR are structurally complete.

- [ ] **Colors (F017):** convert all hardcoded color classes (`border-gray-400`, `text-gray-500`, `bg-white`, `hover:text-amber-600`, …) to the M2 token vocabulary using the mapping table. Re-grep for the count first — M3 deleted files, so v1's "37" is stale. `NewsCard` exception preserved.
- [ ] **Imports (F018):** relative → `@/` per `CLAUDE.md`; fix the `EditorsSection` inconsistency class everywhere (much of it dies in M3 — sweep what's left).
- [ ] **Hygiene (F019/F020):** normalize indentation; resolve or properly catalogue the informal TODOs (`AppLogo.tsx:20` "replace logo", `CategoryNewsSection.tsx:30`, the "enum maybe" notes).
- [ ] **Effects audit (F033):** with context7 → React "You Might Not Need an Effect": flag effects that merely derive state; any `forwardRef` (ref is a prop in 19); fix the mechanical ones, log the rest.
- [ ] **a11y (F022 + remainder of F023 not covered by M3):** meaningful `alt` on the 8 uncovered `<img>`s (`alt=""` only if decorative); label every form input (subscribe, auth, account, reset) with errors via `aria-describedby`; keyboard-walkthrough menus, theme/lang switchers, forms; confirm focus-visible survived M2; re-run `lighthouse_audit` a11y and compare to M0.
- [ ] **i18n (F026):** structural key-path diff of `en/common.json` vs `fr/common.json` (not counts); flag untranslated FR values copied from EN; grep JSX for hardcoded English; playwright: EN↔FR toggle end-to-end (content refetch, `<html lang>`, `en-CA`/`fr-CA` dates).
- [ ] JSDoc coverage check on all hooks/services/utils/contexts (per `CLAUDE.md`).

**Exit criteria:** hardcoded-color grep ≈ 0 (excl. `NewsCard`); import style consistent; zero i18n key-path asymmetry; no hardcoded UI strings; Lighthouse a11y ≥ M0 baseline (target: meaningfully up); lint clean.

---

### M7 — Testing & CI · **M–L** · fixes F024, F025, F038 · implements D4

**Objective:** close the coverage gaps against the *post-migration* code, replace Cypress with Playwright, and stand up CI (none exists today).

- [ ] **Unit/component tests (F024):** hooks (`usePagination`, `useArticleFilters`, infinite-scroll hook(s), `useSectionDropdown`), RTKQ endpoint groups (from M5), and smoke/render tests for Home/Article/Search via `renderWithProviders`. Follow Testing Library query-priority guidance (context7).
- [ ] **Playwright e2e (D4, F025):** port the 8 Cypress flows (article, auth, home, navigation, search, static-pages, subscribe, theme) to `@playwright/test`, plus language-switch and pagination-mode flows (currently uncovered). Then remove Cypress: specs, `cypress.config.ts`, `tsconfig.cypress.json`, `cy:*` scripts, devDependency.
- [ ] **CI (F038):** GitHub Actions workflow on PR + push to `development`/`main`: `npm ci` → `lint` → `build` → `vitest run` → Playwright (against a preview build; mock or skip backend-dependent flows deliberately and document which).
- [ ] Confirm every M4/M5/M6 bug fix has a regression test.

**Exit criteria:** hooks + endpoints + core pages tested; Playwright suite green locally and in CI; Cypress fully removed; CI badge/workflow committed.

---

### M8 — Performance, security, docs & release · **M** · fixes F027–F030, F039

**Objective:** no obvious waste, no security gaps, docs match reality, ship.

- [ ] **Perf:** `performance_start_trace` on home + article (main-thread, CLS, long tasks); route-level `React.lazy` code-splitting for pages; bundle check (removed deps actually gone; shadcn additions reasonable); font-loading strategy — after O1, self-host the winner via `@fontsource` consistently instead of render-blocking Google-Fonts `@import`; image sizing/lazy-loading on cards; obvious re-render issues (unstable props to memoized children). Lighthouse perf ≥ M0.
- [ ] **Security (F030):** no secrets in tree (`.env*` gitignored — re-confirm); tokens HttpOnly-only, never JS/localStorage; the M5 `baseQueryWithReauth` has no infinite-refresh loop; `GoogleCallbackPage` + reset-token flow reviewed for token-in-URL/open-redirect; still 0 `dangerouslySetInnerHTML`; `npm audit` clean-or-triaged.
- [ ] **Docs (F027–F029, F039):** rewrite the stale sections of `CLAUDE.md` — shadcn adoption + `src/components/ui` + `src/lib/utils`, new token vocabulary + mapping, fonts decision, lucide, RTK Query data flow (the whole "Data Flow"/"API Layer"/state-management sections), Playwright story, MCP servers, new shared components/hooks, correct dev-server host. Single version source of truth (`package.json` 0.0.0 vs `APP_VERSION` v1.11.1). Add `.env.example` (`VITE_API_URL` + any other `VITE_` vars — note `.env.development`/`.env.production` exist and are committed; check they hold no secrets and decide whether they should stay committed).
- [ ] **Final report:** executive summary at the top of `AUDIT_FINDINGS.md` — what was broken, what changed, deferred items (D3 forms, any REFACTOR-Deferred), residual risk. Every findings row resolved or explicitly deferred with reason.
- [ ] Merge `development` → `main`, tag, deploy per existing flow.

**Exit criteria:** Lighthouse ≥ baselines; security checklist clean; `CLAUDE.md` truthful; one version source; `.env.example` present; findings log fully resolved; release tagged.

---

## 5. Deliverables

1. **`AUDIT_FINDINGS.md`** — living findings log; every row `Done` / `Rejected(reason)` / `Deferred(reason)` by M8.
2. **Milestone branches/commits** — small, scoped, gates green at every merge.
3. **`audit_docs/baseline/`** — `current/` + `intended/` before-sets and per-milestone after-shots.
4. **`audit_docs/` additions** — M2 token-mapping table, M5 RTK Query design doc.
5. **Updated `CLAUDE.md`** + `.env.example` + CI workflow.
6. **Executive summary** in `AUDIT_FINDINGS.md`.

> **Golden rule:** if a change alters what the user sees or how a flow behaves and you didn't prove otherwise with a screenshot or a driven flow, it isn't done. Build-green ≠ correct.
