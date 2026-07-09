# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits — M2 (branch: `audit/m2-tokens`)

> ⚠️ Commits 1 and 2 are one atomic unit — `index.css` and the component renames depend on each other; splitting them leaves a broken intermediate commit. Commit 3 is independent.

### 1. refactor: unify design tokens into single brand-themed system

**Files:**
- `src/index.css` (rewritten: one token source — brand values in `:root`/`.dark`, `@theme inline` mapping, extensions; legacy `@theme` + `html.dark` deleted; shadcn `--radius` remap + `chart/sidebar` vars dropped; dead commented CSS removed; Cormorant Garamond import dropped)
- all 51 modified files under `src/` **except** `src/index.css` handled above — the ~300 utility renames (`text-primary`→`text-foreground`, `text-secondary`→`text-foreground-secondary`, `text-muted`→`text-muted-foreground`, `text/bg-accent`→`text/bg-brand`, `bg-accent-bg`→`bg-primary`, `bg-accent-subtle`→`bg-accent`, `bg-hover-bg`→`bg-muted`, `text-error`→`text-destructive`, `bg-surface`→`bg-background`, `bg-elevated`→`bg-card`, …)
- `audit_docs/token-mapping.md` (the full mapping + deliberate decisions)

**Message:**
```
refactor: unify design tokens into single brand-themed system
```

**Rationale (F001/F002/F003/F034 — the P0):** ends the token collision. Verified: computed utilities match the production reference exactly in both modes (amber-600/amber-400 brand, gray/slate ramps); 12-shot screenshot grid in `audit_docs/m2-after/` matches the pre-shadcn baseline; 223/223 tests, lint 0 errors.

### 2. chore: remove noto sans and playfair display after typography decision

**Files:**
- `package.json`
- `package-lock.json`

**Message:**
```
chore: remove noto sans and playfair display after typography decision
```

**Rationale (O1 resolved → Tinos + Cardo; F042):** `@fontsource-variable/noto-sans` + `playfair-display` uninstalled — all 13 woff2 subsets (~530 kB) leave the bundle. Side-by-side renders kept in `audit_docs/m2-after/fonts-*.png` as the decision record.

### 3. docs: record m2 results in audit findings and commit plan

**Files:**
- `audit_docs/AUDIT_FINDINGS.md`
- `audit_docs/COMMIT_PLAN.md`
- ~~`audit_docs/m2-after/`~~ — owner decision: verification screenshots stay **local-only** (regenerable; text evidence in the findings log is what gets committed)

**Message:**
```
docs: record m2 results in audit findings and commit plan
```

---

## Pending git operations (owner to run, after the commits above)

```bash
git checkout refactor/ui-audit
git merge --no-ff audit/m2-tokens -m "merge audit/m2-tokens: design-token unification (P0 fix)"
git push origin refactor/ui-audit
```

M2 exit criteria (all met, pending your review): one token source ✅ · utility probe = brand amber both modes ✅ · screenshot grid matches intended baseline ✅ · O1 resolved (Tinos/Cardo) ✅ · F042 fonts removed ✅ · console: nothing new ✅ · gates green (build / 223 tests / lint 0 errors) ✅

---

## Log (committed)

| Date | Commit | Entry |
|---|---|---|
| 2026-07-09 | `040de2d` | audit m0 baseline (committed by Claude **before** the no-auto-commit protocol existed — pushed to both remotes) |
| 2026-07-09 | `39a8ceb` | docs: no-auto-commit protocol + integration-branch workflow (owner-committed) |
| 2026-07-09 | `32181f3` | Merged PR 106: audit: m0 complete → `refactor/ui-audit` (owner-merged) |
| 2026-07-09 | `c9816be` | Merged PR 107: M1 shadcn install repair & dependency fix → `refactor/ui-audit` (owner-merged) |
