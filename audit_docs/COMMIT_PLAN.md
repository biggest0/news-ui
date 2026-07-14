# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits — M7 (branch: `audit/m7-testing`)

### 1. test: add playwright e2e suite and remove cypress

**Files:** `playwright.config.ts` (new), `e2e/*.spec.ts` (10 specs: home, navigation, theme, search, article, auth, subscribe, static-pages, + **new** language, pagination), `e2e/support/stubApi.ts` + `e2e/fixtures/*.json` (ported/adapted from Cypress); **deletions:** `cypress/`, `cypress.config.ts`, `tsconfig.cypress.json`; `package.json` (`cypress` devDep removed, `cy:*` scripts → `test:e2e`/`test:e2e:ui`), `package-lock.json`; `.gitignore` (Playwright artifacts)

**Message:** `test: add playwright e2e suite and remove cypress`
**Rationale (F025, D4):** 8 Cypress flows ported + 2 new (language switch, view-mode toggle); 42/42 pass against the prod build with a fully stubbed API. One small a11y improvement fell out: the desktop search toggle became a real `<button>` (was an icon `onClick`).

### 2. test: add rtk query endpoint and hook unit tests

**Files:** `src/__tests__/store/apiEndpoints.test.ts` (URL construction + F015 regression, DTO→domain mapping, isError surface), `src/__tests__/hooks/useListInfiniteScroll.test.ts`, `src/__tests__/hooks/useSectionDropdown.test.ts`, `src/__tests__/hooks/usePagination.test.ts`

**Message:** `test: add rtk query endpoint and hook unit tests`
**Rationale (F024, rescoped by M5):** covers the surviving data layer + pure-logic hooks. Unit suite 181 → 201.

### 3. ci: add github actions workflow for lint, build, unit, and e2e

**Files:** `.github/workflows/ci.yml`

**Message:** `ci: add github actions workflow for lint, build, unit, and e2e`
**Rationale (F038):** first CI for the repo. Two jobs (unit: lint→build→vitest; e2e: build→Playwright chromium) on PR + push to main/development/refactor/ui-audit. Advisory to Azure PR merges.

### 4. docs: record m7 results; update claude.md testing and ci sections

**Files:** `CLAUDE.md` (Build & Deploy + new CI + e2e docs), `audit_docs/AUDIT_FINDINGS.md`, `audit_docs/COMMIT_PLAN.md`

**Message:** `docs: record m7 results and update testing/ci docs`

---

## Pending git operations (owner to run, after the commits above)

```bash
git checkout refactor/ui-audit
git merge --no-ff audit/m7-testing -m "merge audit/m7-testing: playwright e2e, unit coverage, CI"
git push origin refactor/ui-audit
```

M7 exit criteria (all met, pending your review): 8 Cypress flows ported + 2 new ✅ · **42/42 e2e** green ✅ · Cypress fully removed ✅ · endpoint + hook unit tests added (**201/201**) ✅ · **GitHub Actions CI** committed (unit + e2e jobs) ✅ · single e2e framework ✅ · gates green (build / lint 0/0) ✅

> Note: after the owner pushes the CI workflow, the first Actions run will appear on GitHub — check it goes green before merging M7 in Azure.

---

## Log (committed)

| Date | Commit | Entry |
|---|---|---|
| 2026-07-09 | `040de2d` | audit m0 baseline (committed by Claude **before** the no-auto-commit protocol existed — pushed to both remotes) |
| 2026-07-09 | `39a8ceb` | docs: no-auto-commit protocol + integration-branch workflow (owner-committed) |
| 2026-07-09 | `32181f3` | Merged PR 106: audit: m0 complete → `refactor/ui-audit` (owner-merged) |
| 2026-07-09 | `c9816be` | Merged PR 107: M1 shadcn install repair & dependency fix → `refactor/ui-audit` (owner-merged) |
| 2026-07-09 | `fffa296` | Merged PR 108: M2 design token unification (the P0) → `refactor/ui-audit` |
| 2026-07-09 | `086e98f` | Merged PR 109: M3 component migration & section redundancy removal → `refactor/ui-audit` |
| 2026-07-09 | `fea9bf2` | Merged PR 110: M4 correctness fixes and hooks lint → `refactor/ui-audit` |
| 2026-07-10 | `ff87398` | Merged PR 111: M5 RTK Query data layer migration → `refactor/ui-audit` |
| 2026-07-11 | `8a47833` | Merged PR 112: M5.5 primitives + accessibility + translation strings → `refactor/ui-audit` |
| 2026-07-11 | `9c66d2a` | Merged PR 113: M6 app consistency (tokens, imports, i18n, a11y 100s, docstrings) → `refactor/ui-audit` |
