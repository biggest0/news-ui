# Commit Plan

> Maintained by Claude; **executed by the owner.** Each entry is a proposed commit: files to stage together, message, and why they belong together. Split, reorder, or reword freely. Delete entries once committed (or move them to the Log at the bottom).
>
> Claude never runs `git commit` / `git push` / `git merge` / `git tag` unless explicitly asked (see `CLAUDE.md` → Git Workflow).

---

## Pending commits — M8 (branch: `audit/m8-release`) — FINAL

### 1. perf: code-split routes and vendors, self-host brand fonts

**Files:** `src/App.tsx` (React.lazy all routes except HomePage + Suspense fallback; `@//` import typos fixed), `vite.config.ts` (manualChunks: react/redux/i18n/baseui), `src/index.css` (Google Fonts @import → @fontsource imports), `package.json` + `package-lock.json` (@fontsource/tinos, @fontsource/cardo)

**Message:** `perf: code-split routes and vendors, self-host brand fonts`
**Rationale:** main chunk 620→351 kB; vendors cache across deploys; zero Google Fonts requests (F042/F046 closed). 42/42 e2e green through the Suspense transitions.

### 2. feat: add seo meta description, open graph tags, and robots.txt

**Files:** `index.html`, `public/robots.txt` (allow-all per owner decision)

**Message:** `feat: add seo meta description, open graph tags, and robots txt`
**Rationale:** Lighthouse SEO 83 → 100 on all pages. Meta copy owner-approved.

### 3. build: make package.json the single version source at v1.12.0

**Files:** `package.json` (version 1.12.0), `vite.config.ts` (define __APP_VERSION__), `src/config/config.ts` (APP_VERSION derived, test-safe fallback)

**Message:** `build: make package json the single version source at v1.12.0`
**Rationale (F027):** drift structurally impossible; mobile drawer verified showing v1.12.0.

### 4. docs: add env example and final claude.md reconciliation; close audit

**Files:** `.env.example` (new), `CLAUDE.md` (tech stack, structure, token table → M2 vocabulary, fonts, i18n, hooks, API layer, versioning, Do/Don't), `audit_docs/AUDIT_FINDINGS.md` (M8 results + final executive summary), `audit_docs/COMMIT_PLAN.md`, `.gitignore` (m8-after local-only)

**Message:** `docs: add env example, reconcile claude md, close audit findings`

---

## Release steps (owner to run, after the commits above)

```bash
# 1. merge the final milestone
git checkout refactor/ui-audit
git merge --no-ff audit/m8-release -m "merge audit/m8-release: perf, seo, security, docs — audit complete"
git push origin refactor/ui-audit

# 2. verify the GitHub Actions run is green on refactor/ui-audit

# 3. promote to development (via Azure PR, as usual)
#    then development → main when you're ready to ship

# 4. on main: tag and deploy
git tag v1.12.0 && git push origin v1.12.0
npm run deploy
```

M8 exit criteria (all met, pending your review): Lighthouse **100/100/100 × 3 pages** (a11y, BP, SEO) ✅ · main chunk −43% + vendor caching ✅ · fonts self-hosted, 0 Google requests ✅ · security review clean (0 vulns, no secrets, flows sound) ✅ · v1.12.0 single-sourced ✅ · `.env.example` + CLAUDE.md truthful ✅ · executive summary written ✅ · gates green (build / 201 unit / 42 e2e / lint 0/0) ✅

**🎉 This closes the audit program. Post-ship backlog: placeholder logo, F051 color-darkening review, React 19 form Actions (D3), backend keyword-search word-matching ticket (F044).**

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
| 2026-07-14 | `40c3d6b` | Merged PR 114: M7 Playwright e2e + unit coverage + CI → `refactor/ui-audit` |
