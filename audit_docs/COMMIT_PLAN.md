# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits — M6 (branch: `audit/m6-consistency`)

### 1. refactor: convert remaining hardcoded colors to semantic tokens

**Files:** `CatFactsCard`, `CategoryBar`, `UnderMaintenance`, `ShareButton`, `LoadingOverlay` (dark-mode white-flash bug), `FeaturedSection`, `LoadingMessage`, `NewsSideColumn`, `PaginationControls`, `AccountInfoForm`, `BackToTopButton`, `LikeButton` (exception comment)

**Message:** `refactor: convert remaining hardcoded colors to semantic tokens`

### 2. refactor: convert same-directory imports to path alias

**Files:** 51 mechanical import rewrites across src (script-driven)

**Message:** `refactor: convert same-directory imports to path alias`

### 3. fix: localize remaining strings and document untranslatable brand text

**Files:** `UnderMaintenance` (+ `PAGES.MAINTENANCE.*` keys en/fr), `AppTitle` + `ContactPage` (literal expressions with why-comments)

**Message:** `fix: localize remaining strings and document untranslatable brand text`

### 4. fix: name and label every form control and icon-only interactive

**Files:** search bars ×3, `DateRangeFilter`/`SortByFilter`/`SearchTypeFilter`/`FilterBar`/`PaginationControls` (id/name/aria-label), `SubscribeForm` (id/name/aria-label/autocomplete), `LikeButton` (aria-label + aria-pressed), `ShareButton` (label + useTranslation fix), `SocialMediaLinks`, `UserAccountIcon`, `AppLogo` (labels), `ARTICLE_CARD.LIKE` keys en/fr

**Message:** `fix: name and label every form control and icon-only interactive`

### 5. fix: correct heading hierarchy across sections and footer

**Files:** `SectionHeader` (h3→h2), `SubscribeForm` (h4→h2), `CatFactsCard` (h4→h3) — zero visual change under Tailwind preflight

**Message:** `fix: correct heading hierarchy across sections and footer`

### 6. fix: meet wcag aa contrast for brand text and category colors

**Files:** `src/index.css` (light `--brand` amber-600→amber-700), `NewsCard.tsx` (category rgba → solid 700-shades, same hues)

**Message:** `fix: meet wcag aa contrast for brand text and category colors`
**⚠️ Owner-visible change (F051):** light-mode links/active text one step darker; category labels more saturated. Sanctioned by D1 ("colors can be refactored") — easy revert if disliked.

### 7. docs: add jsdoc to remaining exported functions; record m6 results

**Files:** 18 JSDoc additions (hooks/services/utils/context), `audit_docs/AUDIT_FINDINGS.md`, `audit_docs/COMMIT_PLAN.md`, `.gitignore`

**Message:** `docs: add jsdoc to remaining exports and record m6 results`

---

## Pending git operations (owner to run, after the commits above)

```bash
git checkout refactor/ui-audit
git merge --no-ff audit/m6-consistency -m "merge audit/m6-consistency: a11y 100s, tokens, i18n parity"
git push origin refactor/ui-audit
```

M6 exit criteria (all met, pending your review): hardcoded-color grep ≈ 0 (2 documented exceptions) ✅ · imports 100% `@/` ✅ · **lint 0 errors 0 warnings** ✅ · i18n parity 220/220 zero asymmetry ✅ · every img has alt, every control named ✅ · **Lighthouse a11y 100/100/100** (baseline 93/82/79) ✅ · JSDoc on all exports ✅ · gates green (build / 181 tests) ✅

---

## Log (committed)

| Date | Commit | Entry |
|---|---|---|
| 2026-07-09 | `040de2d` | audit m0 baseline (committed by Claude **before** the no-auto-commit protocol existed — pushed to both remotes) |
| 2026-07-09 | `39a8ceb` | docs: no-auto-commit protocol + integration-branch workflow (owner-committed) |
| 2026-07-09 | `32181f3` | Merged PR 106: audit: m0 complete → `refactor/ui-audit` (owner-merged) |
| 2026-07-09 | `c9816be` | Merged PR 107: M1 shadcn install repair & dependency fix → `refactor/ui-audit` (owner-merged) |
