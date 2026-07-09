# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits — M1 (branch: `audit/m1-shadcn-wiring`)

### 1. fix: relocate shadcn files into src and add root tsconfig paths

**Files:**
- `tsconfig.json` (adds `baseUrl` + `paths` — root cause of the misfire)
- `@/lib/utils.ts` → **deleted** (was tracked)
- `@/components/ui/button.tsx` → **deleted** (was tracked)
- `src/lib/utils.ts` (new — same content + JSDoc on `cn()`)
- `src/components/ui/button.tsx` (new — unchanged registry source)

**Message:**
```
fix: relocate shadcn files into src and add root tsconfig paths
```

**Rationale (F004/F005):** the shadcn CLI reads the **root** `tsconfig.json` for alias resolution; this repo's solution-style root config had no `paths`, so the CLI wrote a literal `@` folder. Per the official shadcn Vite docs, `baseUrl`/`paths` must be in *both* `tsconfig.json` and `tsconfig.app.json`. Verified: `npx shadcn add badge` now lands in `src/components/ui/` (throwaway badge removed).

### 2. chore: fix dependency placement, drop stale type stubs, npm audit fix

**Files:**
- `package.json`
- `package-lock.json`

**Message:**
```
chore: fix dependency placement, drop stale type stubs, npm audit fix
```

**Rationale (F035/F036/F037/F041):** `shadcn` (CLI) and `gh-pages` (deploy tool) moved from `dependencies` → `devDependencies`; removed deprecated stubs `@types/i18next`/`@types/react-redux`/`@types/react-router-dom` (all three libs ship their own types); `npm audit fix` took vulnerabilities **21 → 0** (vite 7.0.x → 7.3.6 and dev-tooling transitive bumps, all within semver). Note: run `npm install` after checkout; if Cypress's binary download fails with EACCES, prefix with `CYPRESS_INSTALL_BINARY=0` (binary for 15.13.0 is already cached).

### 3. fix: resolve cypress lint errors blocking the lint gate

**Files:**
- `cypress/e2e/auth.cy.ts` (`.to.be.null` → `.to.equal(null)` — no-unused-expressions)
- `cypress/support/commands.ts` (scoped eslint-disable + why-comment for the required `Cypress` namespace merge)
- `cypress.config.ts` (drop empty `setupNodeEvents` with unused params)

**Message:**
```
fix: resolve cypress lint errors blocking the lint gate
```

**Rationale (F040):** lint gate red → green (0 errors; 6 remaining warnings are F026 i18n items owned by M6). Minimal touches — these files are deleted in M7 (D4) anyway.

### 4. docs: record m1 results in audit findings and commit plan

**Files:**
- `audit_docs/AUDIT_FINDINGS.md`
- `audit_docs/COMMIT_PLAN.md`

**Message:**
```
docs: record m1 results in audit findings and commit plan
```

**Rationale:** findings statuses for F004/F005/F035/F036/F037/F040/F041 → Done; M1 exit criteria recorded.

---

## Pending git operations (owner to run, after the commits above)

```bash
git checkout refactor/ui-audit
git merge --no-ff audit/m1-shadcn-wiring -m "merge audit/m1-shadcn-wiring: shadcn install repair and dependency hygiene"
git push origin refactor/ui-audit
# optional cleanup:
git branch -d audit/m1-shadcn-wiring && git push origin --delete audit/m1-shadcn-wiring 2>/dev/null
```

M1 exit criteria (all met, pending your review): no literal `@/` dir ✅ · `shadcn add` lands in `src/` ✅ · deps correctly placed ✅ · stale `@types` gone ✅ · `npm audit` 0 vulns ✅ · lint **0 errors** / build ✅ / tests 223/223 ✅ · dev server smoke-tested on vite 7.3.6 ✅

---

## Log (committed)

| Date | Commit | Entry |
|---|---|---|
| 2026-07-09 | `040de2d` | audit m0 baseline (committed by Claude **before** the no-auto-commit protocol existed — pushed to both remotes) |
| 2026-07-09 | `39a8ceb` | docs: no-auto-commit protocol + integration-branch workflow (owner-committed) |
| 2026-07-09 | `32181f3` | Merged PR 106: audit: m0 complete → `refactor/ui-audit` (owner-merged) |
