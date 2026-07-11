# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits — M5.5 (branch: `audit/m5.5-interactive-sweep`)

### 1. feat: add sheet primitive and rebuild mobile menu as accessible drawer

**Files:** `src/components/ui/Sheet.tsx` (new, adapted from registry), `src/components/layout/navBar/MobileMenu.tsx`, `NavBar.tsx` + `MobileNavigation.tsx` + `HamburgerButton.tsx` (finalFocus ref plumbing, ref-as-prop), `src/types/navBarTypes.ts`, i18n keys `COMMON.CLOSE`/`NAVIGATION.MENU_LABEL`/`NAVIGATION.TOGGLE_MENU` (en/fr)

**Message:** `feat: add sheet primitive and rebuild mobile menu as accessible drawer`
**Rationale:** focus trap/Escape/dialog semantics/focus return for the highest-risk hand-rolled interactive; swipe-to-close preserved. Browser-verified keyboard cycle.

### 2. refactor: rebuild desktop language switcher on dropdown menu primitive

**Files:** `src/components/layout/navBar/LanguageSwitcherDesktop.tsx`

**Message:** `refactor: rebuild desktop language switcher on dropdown menu primitive`

### 3. fix: accessibility and i18n touches on kept-native controls

**Files:** `LanguageSwitcherMobile.tsx` (button trigger + aria-expanded), `ThemeSelector.tsx` + `ThemeToggle.tsx` (THEME.* i18n, en/fr keys)

**Message:** `fix: accessibility and i18n touches on kept-native controls`

### 4. docs: record m5.5 verdicts in audit findings and commit plan

**Files:** `audit_docs/AUDIT_FINDINGS.md`, `audit_docs/COMMIT_PLAN.md`, `.gitignore`

**Message:** `docs: record m5.5 verdicts in audit findings and commit plan`

---

## Pending git operations (owner to run, after the commits above)

```bash
git checkout refactor/ui-audit
git merge --no-ff audit/m5.5-interactive-sweep -m "merge audit/m5.5-interactive-sweep: accessible drawer + language menu"
git push origin refactor/ui-audit
```

M5.5 exit criteria (all met, pending your review): every interactive sits on an accessible base or has a recorded keep-verdict ✅ · drawer keyboard cycle browser-verified (dialog role, Escape, focus return to hamburger) ✅ · language menu aria/keyboard verified ✅ · keep-native verdicts recorded ✅ · gates green (build / 181 tests / lint 0 errors) ✅

---

## Log (committed)

| Date | Commit | Entry |
|---|---|---|
| 2026-07-09 | `040de2d` | audit m0 baseline (committed by Claude **before** the no-auto-commit protocol existed — pushed to both remotes) |
| 2026-07-09 | `39a8ceb` | docs: no-auto-commit protocol + integration-branch workflow (owner-committed) |
| 2026-07-09 | `32181f3` | Merged PR 106: audit: m0 complete → `refactor/ui-audit` (owner-merged) |
| 2026-07-09 | `c9816be` | Merged PR 107: M1 shadcn install repair & dependency fix → `refactor/ui-audit` (owner-merged) |
