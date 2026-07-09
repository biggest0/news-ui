# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits

### 1. docs: commit-protocol + branch-model updates

**Branch:** `audit/m0-baseline` (current)
**Files:**
- `CLAUDE.md`
- `audit_docs/AUDIT_PLAN.md`
- `audit_docs/COMMIT_PLAN.md`

**Message:**
```
docs: add no-auto-commit protocol and integration-branch workflow
```

**Rationale:** one logical change — establishes the owner-reviews-all-commits workflow and the refactor/ui-audit integration-branch model across the docs that describe them.

---

## Pending git operations (owner to run)

Fold M0 into the integration branch so M1 can fork from it:

```bash
# 1. commit entry 1 above (on audit/m0-baseline), then:
git checkout refactor/ui-audit
git merge --no-ff audit/m0-baseline -m "merge audit/m0-baseline: baseline artifacts and audit docs"
git push origin refactor/ui-audit        # pushes to both GitHub + Azure
# optional cleanup once merged:
git branch -d audit/m0-baseline
git push origin --delete audit/m0-baseline
```

After this, M1 work starts on `audit/m1-shadcn-wiring` forked from `refactor/ui-audit`.

---

## Log (committed)

| Date | Commit | Entry |
|---|---|---|
| 2026-07-09 | `040de2d` | audit m0 baseline (committed by Claude **before** this protocol existed — pushed to both remotes) |
