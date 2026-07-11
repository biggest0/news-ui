# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits — M5 (branch: `audit/m5-rtk-query`)

> The migration was built slice-by-slice with green gates after each step, and the commits mirror that order — each leaves the tree green.

### 1. feat: add rtk query api slice with reauth and session hint

**Files:** `src/store/api/apiSlice.ts` (new), `src/hooks/useApiLang.ts` (new), `src/contexts/AuthContext.tsx` (session-hint gate), `src/store/store.ts` (api reducer+middleware), `src/components/common/feedback/SectionErrorMessage.tsx` (new), `src/i18n/{en,fr}/common.json` (COMMON.LOAD_ERROR/RETRY), `audit_docs/rtkq-design.md` (new)

**Message:** `feat: add rtk query api slice with reauth and session hint`
**Rationale:** infrastructure per the design doc; F043 fixed (anonymous loads fire no /auth/refresh — browser-verified).

### 2. refactor: migrate cat facts to rtk query

**Files:** `src/store/api/catFactEndpoints.ts` (new), `src/components/news/section/CatFactsSection.tsx`, deletions: `src/store/catFactsSlice.ts`, `src/service/catFactService.ts`, `src/api/catFactApi.ts`; `src/main.tsx` (drop catFacts reset)

**Message:** `refactor: migrate cat facts to rtk query`

### 3. refactor: migrate recommendations to rtk query

**Files:** `src/store/api/recommendationEndpoints.ts` (new), `SimilarArticlesSection.tsx`, `RecommendedSection.tsx`, `src/store/recommendationsSlice.ts` (trimmed to semantic, deleted in commit 5), `src/service/articleService.ts` + `src/api/articleApi.ts` (similar/recommended removed)

**Message:** `refactor: migrate recommendations to rtk query`

### 4. refactor: migrate likes and history to rtk query

**Files:** `src/store/api/userContentEndpoints.ts` (new), `LikeButton.tsx`, `AccountNewsSection.tsx`, deletions: `src/store/userContentSlice.ts`; `src/api/userArticleApi.ts` + `src/service/userArticleService.ts` (trimmed to recordArticleRead), `src/main.tsx` (logout cache-drop subscription), tests: `userArticleService.test.ts` trimmed, `NewsCard.test.tsx` mocks RTKQ hooks

**Message:** `refactor: migrate likes and history to rtk query`

### 5. refactor: migrate articles to rtk query and retire language remount

**Files:** `src/store/api/articleEndpoints.ts` (new — infinite queries), `BaseNewsSection.tsx` (owns data now), `HomeNewsSection.tsx`/`CategoryNewsSection.tsx` (thin wrappers), `usePagination.ts`, `useArticleHooks.ts` (scroll driver + useFeaturedArticles; dead useArticleFilters removed), `useSearchPage.ts`, `SearchPage.tsx`, `SubCategoryPage.tsx` (+ `PAGES.SUBCATEGORY.*` i18n keys), `ArticlePage.tsx`, `NewsCard.tsx`, `PopularSection.tsx`, `FeaturedSection.tsx`, `CategoryBar.tsx` (pure nav), `NavBar.tsx`, **`App.tsx` (main key removed)**, `main.tsx` (resets removed), deletions: `articlesSlice.ts`, `recommendationsSlice.ts`, `articleService.ts`, `useSubCategoryPage.ts`, stale tests; rewritten tests: `BaseNewsSection.test.tsx`, `HomeNewsSection.test.tsx`, `CategoryNewsSection.test.tsx`; `renderWithProviders.tsx`

**Message:** `refactor: migrate articles to rtk query and retire language remount`
**Rationale:** the modernization payoff — EN↔FR updates in place (browser-verified: same <main> node, 4 auto-refetches with lang=fr).

### 5.5 fix: invalidate history on read and drop per-user cache retention

**Files:** `src/store/api/userContentEndpoints.ts` (recordArticleRead mutation + getHistory keepUnusedDataFor: 0), 7 call-site conversions (`ArticlePage`, `NewsCard`, `NewsHeroCard`, `ArticleTitleCard`, `StaffPicksSection`, `RecommendedSection`, `SimilarArticlesSection`), deletions: `src/service/userArticleService.ts`, `src/api/userArticleApi.ts`, its test; card tests re-mocked

**Message:** `fix: invalidate history on read and drop per-user cache retention`
**Rationale (F050, owner-reported):** stale history within 60s + fast logout→login leaving history unpopulated (error-poisoned cache entry). Fire-and-forget contract preserved (mutation triggered without await).

### 6. docs: record m5 results; update claude.md data-flow sections

**Files:** `audit_docs/AUDIT_FINDINGS.md`, `audit_docs/COMMIT_PLAN.md`, `CLAUDE.md` (State Management + Data Flow), `.gitignore` (m5-after local-only)

**Message:** `docs: record m5 results and update data-flow docs`

> ⚠️ Note: the working tree holds all changes together — if you want the six-commit split above, stage per the file lists; otherwise a single squashed `refactor: migrate data layer to rtk query (m5)` is equally green.

---

## Pending git operations (owner to run, after the commits above)

```bash
git checkout refactor/ui-audit
git merge --no-ff audit/m5-rtk-query -m "merge audit/m5-rtk-query: rtk query data layer migration"
git push origin refactor/ui-audit
```

M5 exit criteria (all met, pending your review): all four slices replaced ✅ · no component imports data services/apis beyond sanctioned fire-and-forget + auth/forms (grep) ✅ · language toggle refetches without remount (browser-verified, same DOM node) ✅ · no duplicate in-flight fetches from co-mounted sections (1× featured for 3 consumers) ✅ · `?lang=` on every request ✅ · F043: zero /auth/refresh for anonymous ✅ · inline error states wired ✅ · design doc committed ✅ · gates green (build / 182 tests / lint 0 errors) ✅

---

## Log (committed)

| Date | Commit | Entry |
|---|---|---|
| 2026-07-09 | `040de2d` | audit m0 baseline (committed by Claude **before** the no-auto-commit protocol existed — pushed to both remotes) |
| 2026-07-09 | `39a8ceb` | docs: no-auto-commit protocol + integration-branch workflow (owner-committed) |
| 2026-07-09 | `32181f3` | Merged PR 106: audit: m0 complete → `refactor/ui-audit` (owner-merged) |
| 2026-07-09 | `c9816be` | Merged PR 107: M1 shadcn install repair & dependency fix → `refactor/ui-audit` (owner-merged) |
