# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits — M3 (branch: `audit/m3-components`)

> Commits 1–3 build on each other (primitive → consumers → consolidation) but each leaves the tree green, so they can land as three reviewable commits in this order.

### 1. feat: add accessible dropdown-menu primitive adapted from shadcn base

**Files:**
- `src/components/ui/DropdownMenu.tsx` (new — @base-ui Menu base, adapted: react-icons, app tokens, normal-case items)
- `src/components/common/layout/SectionDropDown.tsx` (rebufeat: add accessible dropdown-menu primitive and compose section headersilt on the primitive; trigger is a real button with aria-haspopup/expanded)
- `src/components/common/layout/SectionHeaderExpandable.tsx` (now composes SectionDropDown; inlined duplicate + duplicate type deleted)
- `src/components/news/section/ExpandableSection.tsx` (chevron → real button with aria-expanded)
- `src/i18n/en/common.json`, `src/i18n/fr/common.json` (DROPDOWN.SECTION_OPTIONS)

**Message:**
```

```

**Rationale (F008/F009/F013/F016/F023):** kills the byte-identical dropdown duplication AND the keyboard/ARIA gaps in one move; fixes the dark-mode white-panel bug. Keyboard cycle verified in-browser.

### 2. refactor: extract SectionShell and consolidate section pairs

**Files:**
- `src/components/common/layout/SectionShell.tsx` (new)
- `src/components/news/section/EditorsSection.tsx`, `CatFactsSection.tsx` (variant prop; consolidated)
- `src/components/news/section/mobileSections/MobileEditorsSection.tsx`, `MobileCatFactsSection.tsx` (**deleted**)
- `src/components/news/section/StaffPicksSection.tsx`, `mobileSections/MobileStaffPicksSection.tsx` (share useFeaturedArticles; kept split by design — different presentation)
- `src/components/news/section/PopularSection.tsx`, `RecommendedSection.tsx`, `EmptyStateSection.tsx`, `newsSections/BaseNewsSection.tsx` (SectionShell migration)
- `src/hooks/useArticleHooks.ts` (new useFeaturedArticles hook)
- `src/pages/HomePage.tsx` (call sites → variant props)

**Message:**
```
refactor: extract section shell and consolidate mobile/desktop section pairs
```

**Rationale (F010/F011):** ~90%-duplicate pairs → one component each; the copy-pasted wrapper pattern → SectionShell. Mobile layout verified against baseline.

### 3. refactor: rename infinite-scroll hooks and drop lucide-react

**Files:**
- `src/hooks/useArticleHooks.ts`, `src/hooks/useSearchPage.ts` (useListInfiniteScroll / useSearchInfiniteScroll)
- `src/components/news/section/newsSections/BaseNewsSection.tsx`, `src/pages/SearchPage.tsx` (call sites)
- `src/__tests__/components/news/section/newsSections/BaseNewsSection.test.tsx` (mock rename)
- `package.json`, `package-lock.json` (lucide-react removed — O2: react-icons is the standard)

**Message:**
```
refactor: rename infinite-scroll hooks and standardize on react-icons
```

**Rationale (F012, O2):** kills the same-name/different-signature import footgun; one icon library.

### 3.5 refactor: rename ui primitives to app naming convention

**Files:**
- `src/components/ui/button.tsx` → `src/components/ui/Button.tsx` (git mv, case-only)
- `src/components/ui/DropdownMenu.tsx` (created directly with the final name; listed in commit 1)
- `src/components/common/layout/SectionDropDown.tsx` (import path)

**Message:**
```
refactor: rename ui primitives to pascal case per naming convention
```

**Rationale (owner decision):** file naming stays app-standard — PascalCase components, camelCase .ts; shadcn-generated kebab-case files get renamed during adaptation. (Fold into commit 1 if you prefer; kept separate so the case-only `git mv` of Button.tsx is visible.)

### 4. docs: record m3 results, base-ui scope rule, naming convention, milestone m5.5

**Files:**
- `audit_docs/AUDIT_PLAN.md` (M5.5 milestone + base-ui scope rule)
- `audit_docs/AUDIT_FINDINGS.md` (M3 results, O2/D1-scope resolutions, F046 bundle note)
- `audit_docs/COMMIT_PLAN.md`
- `CLAUDE.md` (naming conventions expanded; base-ui/shadcn scope section added)
- `.gitignore` (audit_docs/m3-after/ local-only)

**Message:**
```
docs: record m3 results, base-ui scope, naming convention, milestone m5.5
```

---

## Pending git operations (owner to run, after the commits above)

```bash
git checkout refactor/ui-audit
git merge --no-ff audit/m3-components -m "merge audit/m3-components: accessible dropdowns + section consolidation"
git push origin refactor/ui-audit
```

M3 exit criteria (all met, pending your review): no byte-identical component bodies ✅ · dropdowns keyboard-operable with correct ARIA (verified: Enter/arrows/Escape/focus-return) ✅ · dark-mode panel bug fixed ✅ · one icon library ✅ · mobile/desktop layout matches baseline ✅ · gates green (build / 223 tests / lint 0 errors) ✅ · noted: bundle +54 kB gzip from @base-ui core → F046 routed to perf milestone

---

## Log (committed)

| Date | Commit | Entry |
|---|---|---|
| 2026-07-09 | `040de2d` | audit m0 baseline (committed by Claude **before** the no-auto-commit protocol existed — pushed to both remotes) |
| 2026-07-09 | `39a8ceb` | docs: no-auto-commit protocol + integration-branch workflow (owner-committed) |
| 2026-07-09 | `32181f3` | Merged PR 106: audit: m0 complete → `refactor/ui-audit` (owner-merged) |
| 2026-07-09 | `c9816be` | Merged PR 107: M1 shadcn install repair & dependency fix → `refactor/ui-audit` (owner-merged) |
