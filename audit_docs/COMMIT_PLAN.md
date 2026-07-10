# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits — M4 (branch: `audit/m4-correctness`)

### 1. fix: return typed safe default from getTopTenArticles

**Files:**
- `src/service/articleService.ts` (explicit `Promise<ArticleInfo[]>` + `return []` in catch)
- `src/__tests__/service/articleService.test.ts` (the old test asserted the bug — now asserts `[]`)

**Message:**
```
fix: return typed safe default from getTopTenArticles on failure
```

**Rationale (F014):** the only service violating the uniform error contract — callers `.map` the result and crashed on `undefined`.

### 2. fix: encode category and subcategory query params

**Files:**
- `src/api/articleApi.ts` (both fetchers → URLSearchParams)
- `src/__tests__/api/articleApi.test.ts` (new — proves "Food & drink industry" survives intact)

**Message:**
```
fix: encode category and subcategory query params via urlsearchparams
```

**Rationale (F015):** live bug — real sub-categories contain `&`/spaces and truncated the query string at the ampersand.

### 3. fix: record reading history after silent auth refresh resolves

**Files:**
- `src/pages/ArticlePage.tsx` (effect split: view-count once per id; history keyed on [id, isAuthenticated])

**Message:**
```
fix: record reading history after silent auth refresh resolves
```

**Rationale (F047, user-visible):** logged-in users landing directly on an article never got a history entry — the effect ran before the token refresh flipped isAuthenticated. View counting deliberately stays un-keyed on auth to avoid double-counting.

### 4. fix: enable react-hooks lint rules and resolve dependency warnings

**Files:**
- `eslint.config.js` (rules-of-hooks: error, exhaustive-deps: warn — plugin was registered but rules never enabled)
- `src/hooks/useSearchPage.ts` (useFilteredArticles → useMemo, derived-data fix)
- `src/hooks/useLocalStorage.ts`, `src/hooks/useSectionDropdown.ts` (dep additions)
- `src/components/news/section/PopularSection.tsx`, `src/components/layout/navBar/MobileSearchBar.tsx` (dep additions)
- `src/components/layout/navBar/MobileMenu.tsx` (justified eslint-disable with why-comment)

**Message:**
```
fix: enable react-hooks lint rules and resolve dependency warnings
```

**Rationale (F048 + F033-partial):** the hooks safety net was silently off; enabling surfaced 7 warnings, each triaged — no blanket disables.

### 4.5 fix: break store type-import cycle that collapsed rootstate in the ide

**Files:**
- `src/store/articlesSlice.ts`, `src/store/catFactsSlice.ts`, `src/store/recommendationsSlice.ts` (drop `RootState` imports; thunk conditions type `getState()` structurally against their own slice state)

**Message:**
```
fix: break store type-import cycle that collapsed rootstate in the ide
```

**Rationale (F049, owner-reported):** store↔slice circular type imports made the IDE's tsserver infer `state.article` as `unknown` (tsc passed only by inference-order luck). Structural getState typing breaks the cycle; type-only, zero runtime change.

### 5. docs: record m4 results in audit findings and commit plan

**Files:**
- `audit_docs/AUDIT_FINDINGS.md`
- `audit_docs/COMMIT_PLAN.md`

**Message:**
```
docs: record m4 results in audit findings and commit plan
```

---

## Backend ticket recommendation (outside this repo — from F044)

Keyword search (`/api/articles/search/keyword`) matches **substrings**, so `q=cat` matches "vacation"/"cattle"/"communication". Stated contract is *word* matching (title/category/paragraph). Recommend word-boundary matching server-side. Also: `audit_docs/schemas/README.md` route names (`/article-info`, `/article-top-ten`) have drifted from the live routes (`/api/articles`, `/api/articles/top`).

---

## Pending git operations (owner to run, after the commits above)

```bash
git checkout refactor/ui-audit
git merge --no-ff audit/m4-correctness -m "merge audit/m4-correctness: correctness hotfixes and hooks lint"
git push origin refactor/ui-audit
```

M4 exit criteria (all met, pending your review): F014/F015 fixed **with regression tests** ✅ · F047 history bug fixed ✅ · hooks lint enabled, 0 errors ✅ · error contract uniform + documented ✅ · F044 characterized (backend ticket) ✅ · gates green (build / **225** tests / lint 0 errors) ✅

---

## Log (committed)

| Date | Commit | Entry |
|---|---|---|
| 2026-07-09 | `040de2d` | audit m0 baseline (committed by Claude **before** the no-auto-commit protocol existed — pushed to both remotes) |
| 2026-07-09 | `39a8ceb` | docs: no-auto-commit protocol + integration-branch workflow (owner-committed) |
| 2026-07-09 | `32181f3` | Merged PR 106: audit: m0 complete → `refactor/ui-audit` (owner-merged) |
| 2026-07-09 | `c9816be` | Merged PR 107: M1 shadcn install repair & dependency fix → `refactor/ui-audit` (owner-merged) |
