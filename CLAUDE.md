# CLAUDE.md — Catire Time Frontend

This file gives Claude the context needed to work consistently in this codebase.

> **Maintenance rule:** Keep this file up to date. When implementing new UI components, update the relevant section (e.g. add new hooks to Key Custom Hooks, new routes to Routing). When a significant architectural change occurs (new slice, new context, new data flow), add or update the corresponding section. This file should always reflect the current state of the codebase.

---

## Project Overview

Catire Time is a satirical news frontend built with React 19, TypeScript, Redux Toolkit, and Tailwind v4. It fetches articles from a REST API, supports dark mode, multi-language (EN/FR), and user-configurable home layout.

**Live deployment:** GitHub Pages via `npm run deploy`
**Backend:** Separate Express API (not in this repo), accessed via `VITE_API_URL`

---

## Tech Stack

| Concern | Library / Version |
|---|---|
| UI | React `^19.1.0` |
| Language | TypeScript `~5.8.3` |
| Build | Vite `^7.x` + `@vitejs/plugin-react` |
| Server state | Redux Toolkit `^2.8` **RTK Query** + `react-redux ^9` |
| Routing | `react-router-dom ^7.8` (route-level `React.lazy` code-splitting) |
| Styling | Tailwind CSS `^4.1` (v4 — CSS-first, no `tailwind.config.js`) |
| UI primitives | `@base-ui/react` via adapted shadcn components (`src/components/ui/`) — see scope rule below |
| i18n | `i18next ^25.x` + `react-i18next ^16.x` |
| Icons | `react-icons ^5.5.0` (the only icon library) |
| Fonts | `@fontsource/tinos` + `@fontsource/cardo` (self-hosted, latin subsets) |
| Testing | Vitest (unit) + Playwright (e2e, chromium) |

---

## Project Structure

```
e2e/                      # Playwright specs + support/stubApi.ts + fixtures (stubbed backend)
src/
├── __tests__/            # Vitest suites (components/, hooks/, store/, mappers/, service/, utils/) + setup.ts
├── api/                  # Remaining raw fetch: articleApi (view increment only), authApi, authFetch, formApi
├── auth/                 # authStore.ts — module-level auth state (subscribed to via useAuth)
├── blog/                 # registry.ts auto-discovers posts/*.tsx via import.meta.glob
├── components/
│   ├── account/          # AccountPage building blocks (AccountInfoSection, AccountInfoForm)
│   ├── common/           # Reusable UI: feedback (SectionErrorMessage, LoadingOverlay), layout (SectionShell, SectionDropDown), social, theme, user
│   ├── layout/           # App shell: header, footer, navBar (MobileMenu drawer), sideColumn
│   ├── news/             # Domain: cards/, section/, shared/ (FilterBar, PaginationControls)
│   ├── search/           # Search-specific filters
│   └── ui/               # Adapted shadcn primitives on @base-ui (Button, DropdownMenu, Sheet)
├── config/               # config.ts — API_URL, BASE_URL, APP_VERSION (injected from package.json)
├── constants/            # routes.ts, keys.ts
├── contexts/             # AppSettingContext (UI prefs), AuthContext (AuthProvider + useAuth)
├── hooks/                # Custom hooks (see below)
├── i18n/                 # Translation files + i18next config + lang.ts helpers
├── lib/                  # utils.ts — cn() class-merge helper for ui/ primitives
├── mappers/              # DTO → domain type conversion (articleMapper.ts, catFactMapper.ts)
├── pages/                # Route-level components (lazy-loaded except HomePage)
├── service/              # Non-RTKQ business logic: authService, formService, localStorageService
├── store/                # store.ts + api/ (RTK Query: apiSlice + per-domain endpoint files)
├── types/                # Domain types, DTO types, localStorage types, prop types
└── utils/                # date, search, storage, text, validation utilities
```

### Path Alias

`@/` maps to `./src/`. Always use `@/` for imports, never relative `../../`.

---

## Styling: Tailwind v4 + Semantic CSS Tokens

This project uses **Tailwind v4's CSS-first approach** — there is no `tailwind.config.js`. Configuration lives in `src/index.css`.

### Color Token System

One unified token system (M2 — shadcn's vocabulary themed to the brand): plain CSS variables hold light values in `:root` and dark values in `.dark`; `@theme inline` maps them to Tailwind utilities. **Never hardcode `text-gray-800 dark:text-slate-100` pairs in components** — use the semantic tokens. The full old→new mapping lives in `audit_docs/token-mapping.md`.

| Token class | Light value | Dark value | Usage |
|---|---|---|---|
| `bg-background` | white | slate-900 | Page background |
| `text-foreground` | gray-800 | slate-100 | Headings, titles, bold labels |
| `text-foreground-secondary` | gray-600 | slate-300 | Body text, form inputs, nav links |
| `text-muted-foreground` | gray-500 | slate-400 | Dates, captions, icons |
| `bg-card` / `bg-popover` | white | slate-800 | Cards, inputs, dropdown panels |
| `bg-elevated-glass` | white/50% | slate-800/70% | Translucent sticky surfaces |
| `text-brand` / `hover:text-brand` | amber-700 (AA-safe since M6) | amber-400 | Interactive text, links, active states |
| `bg-primary` / `hover:bg-primary-hover` | amber-500 / amber-700 | amber-600 / amber-500 | Button fills + hover |
| `bg-accent` | amber-100 | amber-900/40% | Hover tints, selected-state backgrounds |
| `bg-muted` | gray-100 | slate-700 | Neutral hover backgrounds |
| `bg-control-active` | white | slate-600 | Selected toggle/chip on top of `bg-muted` |
| `border-border` | gray-400 | slate-600 | Standard dividers |
| `border-border-subtle` | gray-200 | slate-700 | Light dividers |
| `text-disabled` / `bg-disabled-bg` | gray-300 / gray-400 | slate-600 | Disabled UI |
| `placeholder:text-placeholder` | gray-400 | slate-500 | Input placeholder text |
| `focus:ring-ring` | amber-500 | amber-600 | Focus rings |
| `text-success` | green-600 | green-400 | Success message text |
| `text-destructive` | red-600 | red-400 | Error message text |
| `text-warning` / `bg-warning-subtle` / `border-warning-border` | yellow-700 / yellow-100 / yellow-500 | yellow-400 / yellow-900/30 / yellow-600 | Warning text, surface, border (NoticeBar) |

**To change a color:** edit the variable in `:root` / `.dark` in `src/index.css` — components update automatically.

### Dark Mode Mechanism

- Tailwind dark mode is **class-based**: the `dark` class on `<html>` (set by `AppSettingContext`)
- `@custom-variant dark (&:where(.dark, .dark *))` is declared in `index.css`
- Variables override themselves in `.dark { }`; `@theme inline` makes utilities reference them directly — no `dark:` prefixes needed on semantic tokens
- Only use `dark:` prefix for one-off exceptions that can't be tokenized

### Documented Exceptions

- **`categoryColor()` in `NewsCard.tsx`**: raw Tailwind + `dark:` pairs, one color per category (solid 700-shades in light mode since M6, for WCAG AA)
- **`LikeButton`'s red-300 heart**: a deliberate soft-pink one-off in both themes
- **`AppTitle`'s `dark:invert`** on the cat SVG behind the Ç

### Fonts

- **Body:** `Tinos` (serif) via `--font-serif`; **Headings (h1–h6):** `Cardo` (serif) via `--font-heading` — both applied in `@layer base`
- **Self-hosted** via `@fontsource/tinos` + `@fontsource/cardo` imports in `index.css` (M8) — no Google Fonts request; `unicode-range` keeps downloads to the subsets in use

---

## State Management

**RTK Query** (`src/store/api/`) handles all **async server data** (migrated from hand-rolled slices/thunks in M5, 2026-07-10):
- `apiSlice.ts` — single `createApi` + `baseQueryWithReauth` (cookie auth, 401 → one refresh via `authStore.refresh()` → retry; refresh is skipped when no session is known)
- Domain endpoints are injected per file: `articleEndpoints.ts` (lists as **infinite queries**, page-mode query, detail, top-ten, featured, keyword + semantic search), `recommendationEndpoints.ts` (similar, recommended), `userContentEndpoints.ts` (like status/toggle, history + tag invalidation), `catFactEndpoints.ts`
- **`lang` is part of every article-ish query arg** (use `useApiLang()`), so EN↔FR toggles refetch automatically via cache-key change — no manual resets, no page remount
- `transformResponse` calls `mappers/` — components still never see DTOs
- Co-mounted sections (desktop + mobile variants) share cache entries automatically
- Failed loads render `<SectionErrorMessage onRetry={refetch} />` (inline, localized) instead of silent-empty
- Use `AppDispatch` and `RootState` from `src/store/store.ts` for typed hooks

**React Context** (`AppSettingContext`) handles all **local UI preferences**:
- Theme mode (`light` | `dark` | `system`), section visibility, section expansion, pagination mode
- Persisted to `localStorage`, synced across tabs

**Auth state** lives in a module-level store at `src/auth/authStore.ts` (not Redux, not Context):
- `AuthProvider` (`src/contexts/AuthContext.tsx`) wraps the app and triggers a silent token refresh on mount
- Components subscribe via `useAuth()` (uses `useSyncExternalStore`) to read `user`, `isAuthenticated`, `isLoading` and call `login` / `register` / `logout` / `loginWithGoogle`
- Tokens are HttpOnly cookies; the frontend never holds them in JS

**Rule:** Never put UI preferences in Redux. Never put server data in Context.

---

## Data Flow

```
Component
  → RTK Query hook (src/store/api/*Endpoints.ts)
    → baseQueryWithReauth (cookie auth, 401 → refresh → retry)
      → backend REST API
    ← transformResponse → mappers/ (DTO → domain)
```

DTOs from the API are **always mapped** in `src/mappers/` via each endpoint's `transformResponse` before entering the cache. Components never see raw DTOs. Fire-and-forget calls (never awaited): `incrementArticleViewed` (`api/articleApi.ts`, bypasses RTK Query) and the `recordArticleRead` **mutation** (triggered without awaiting; it invalidates the `History` tag so the account page refetches). Auth flows still use `authService`/`authApi` + `authFetch`; the subscribe form uses `formService`.

---

## Routing

Routes are defined in `App.tsx`. Category pages are generated dynamically from `ARTICLE_ROUTES` in `src/constants/routes.ts`.

```
/                          → HomePage
/:category                 → ArticlesPage (world, lifestyle, science, technology, business, sport, politics, other)
/article/:id               → ArticlePage
/subcategory/:subCategory  → SubCategoryPage
/search                    → SearchPage
/about, /contact, /account, /disclaimer → static pages
/login, /register          → auth entry points
/account/verification      → EmailVerificationPage (post-register email link)
/reset-password            → ResetPasswordPage (request reset email)
/reset-password/:token     → NewPasswordPage (set new password from email link)
/auth/google/callback      → GoogleCallbackPage (OAuth code exchange)
/blog                      → BlogPage (lists posts from blog/registry.ts)
/blog/:slug                → BlogPostPage (renders matching blog/posts/<slug>.tsx)
```

---

## Internationalisation (i18n)

- Languages: `en` (default), `fr`
- Translation files: `src/i18n/en/common.json`, `src/i18n/fr/common.json`
- **Always use `useTranslation()` and `t("KEY")` for user-visible strings**
- Never hardcode English strings in JSX
- Detection order: `localStorage` → browser navigator
- Key namespaces: `APP`, `CATEGORY`, `SECTION`, `ARTICLE_CARD`, `FILTER`, `PAGINATION`, `PAGES.*`, `COMMON`, `NAVIGATION`, `FOOTER`, `SUBSCRIBE`

### Localized article content (server-side)

Article *content* (title, summary, paragraphs, sub_category) is translated by the API, not the client:

- Every article-returning endpoint takes `?lang=en|fr`; the api/ layer appends it automatically via `getApiLang()` from `src/i18n/lang.ts` — **any new article endpoint call must do the same**
- `main_category` stays a language-independent key (translated client-side via `CATEGORY.*`); untranslated articles fall back to English content under `lang=fr` (never 404)
- **Re-fetch on toggle (RTK Query, since M5):** every article-ish query arg includes `lang` via `useApiLang()`, so an EN↔FR switch is a cache-key change that refetches automatically — content updates **in place** (no remount, scroll preserved). `main.tsx` only syncs `<html lang>`. Any new endpoint must put `lang` in its query arg
- Article dates are formatted at map time in `articleMapper.ts` with `getDateLocale()` (`en-CA` / `fr-CA`)

---

## Component Conventions

- **File names:** PascalCase for component files (`NewsCard.tsx`, `ThemeToggle.tsx`, `DropdownMenu.tsx`); camelCase for non-component `.ts` files (`articleMapper.ts`, `useSectionDropdown.ts`). **No kebab-case** — shadcn-generated files (which arrive as e.g. `dropdown-menu.tsx`) must be renamed to PascalCase during adaptation, with imports updated
- **Exports:** `export default function ComponentName()` for components; named exports for utilities/types/hooks
- **Props:** Define inline `interface ComponentNameProps` above the component; use `src/types/props/` only when props are shared across multiple components
- **Prop callbacks:** Type explicitly — `onRead?: (article: ArticleInfo) => void`
- **Hooks first:** Extract logic into custom hooks in `src/hooks/` rather than bloating components
- **Mobile vs Desktop:** Some sections have separate mobile components (e.g. `MobileMenu`, `MobileStaffPicksSection`); near-identical pairs are consolidated behind a `variant="sidebar" | "mobile"` prop instead (`EditorsSection`, `CatFactsSection`) — check before adding responsive logic inline

### UI primitives: base-ui / shadcn scope (decided 2026-07-09)

- **base-ui (`@base-ui/react`) is used ONLY where the web platform lacks a native primitive:** menus/dropdowns, dialogs/drawers, tooltips, comboboxes, toggle groups. These live in `src/components/ui/` as *adapted* shadcn registry components — pulled for their accessible behavior, then made ours: app tokens, react-icons (never lucide), app styling, PascalCase filename, JSDoc.
- **Native elements stay native:** `<button>`, `<input>`, `<select>`, links. shadcn *styling recipes* may be borrowed for visual consistency (pure CSS), but no base-ui runtime for these.
- **Domain components never import `@base-ui/react` directly** — they compose the primitives in `src/components/ui/`.
- shadcn is a code source, not a design authority: registry components are a base/standard to build on, never verbatim copies.

---

## Key Custom Hooks

| Hook | File | Purpose |
|---|---|---|
| `useAppSettings()` | `contexts/AppSettingContext.tsx` | Access theme, section visibility, toggles, pagination mode |
| `useAuth()` | `contexts/AuthContext.tsx` | Subscribe to auth store; exposes user, isAuthenticated, login/register/logout |
| `useApiLang()` | `hooks/useApiLang.ts` | Reactive content language ("en"/"fr") for RTK Query args — subscribes to i18next changes |
| `useListInfiniteScroll(...)` | `hooks/useArticleHooks.ts` | Window-scroll driver for infinite queries (700px threshold) — calls `fetchNextPage` |
| `useFeaturedArticles()` | `hooks/useArticleHooks.ts` | Featured/staff-picks articles via RTKQ (co-mounted sections share the cache) |
| `usePagination(...)` | `hooks/usePagination.ts` | Page-mode pagination on the `getArticlesPage` query; owns page/size state + clamping |
| `usePagePagination()` | `hooks/usePagePagination.ts` | Reads pagination mode (page vs scroll) from app settings |
| `useLocalStorage(key, init)` | `hooks/useLocalStorage.ts` | Generic localStorage-backed state |
| `useSectionVisible(section)` | `hooks/useSectionCollapse.ts` | Section visibility state |
| `useSectionCollapse(section)` | `hooks/useSectionCollapse.ts` | Section expand/collapse state |
| `useAllSectionNotVisible()` | `hooks/useSectionCollapse.ts` | True when every home section is hidden (drives empty state) |
| `useSectionDropdown(sectionKey)` | `hooks/useSectionDropdown.ts` | Builds the per-section dropdown options (collapse / remove / view mode) |
| `useSearchPage` exports | `hooks/useSearchPage.ts` | `useSearchParams`, `useSearchResults` (keyword/semantic infinite queries), `useFilteredArticles`, `useSearchInfiniteScroll` |

RTK Query hooks (`useGetArticlesInfiniteQuery`, `useGetArticleDetailQuery`, `useGetCatFactsQuery`, `useToggleLikeMutation`, …) are exported from their endpoint files in `src/store/api/`.

---

## TypeScript Conventions

- **Strict mode** is on — no implicit `any`, no unused vars
- Path alias `@/` must be used for all src imports
- DTOs live in `src/types/articleDto.ts` — snake_case matching backend
- Domain types live in `src/types/articleTypes.ts` — camelCase
- App settings / localStorage types in `src/types/localStorageTypes.ts`
- Redux types: `RootState`, `AppDispatch` exported from `src/store/store.ts`
- i18n types: `Language`, `TranslationNamespace`, `CategoryKey` in `src/i18n/types.ts`

---

## API Layer

- Base URL: `import.meta.env.VITE_API_URL` (falls back to `http://localhost:3001`) — see `.env.example`
- **All server data goes through RTK Query** (`src/store/api/`, one endpoint file per domain — see State Management). `baseQueryWithReauth` handles cookies + 401 → single refresh → retry, with the session hint skipping refresh for anonymous visitors
- What remains outside RTK Query:
  - `authApi.ts` + `authService.ts` — register, login, logout, refresh, Google OAuth exchange, email verify, password reset (consumed by `authStore`)
  - `formApi.ts` + `formService.ts` — email subscriptions (throws user-friendly errors for the form to display)
  - `articleApi.ts` — only `incrementArticleViewed()`, **fire-and-forget, do not await**
  - `localStorageService.ts` — localStorage read/write helpers
- `authFetch.ts` wraps `fetch` for the remaining non-RTKQ authenticated calls (single 401 → refresh → retry, no loop)
- `recordArticleRead` is an RTKQ **mutation** triggered without awaiting (invalidates the `History` tag)

---

## Git Workflow

- **`main`** — production branch (deployed to GitHub Pages)
- **`development`** — active development branch; PRs target this
- Merge `development` → `main` for releases
- Versioning: **`package.json` is the single source of truth** — Vite injects it at build time and `config.ts` exposes it as `APP_VERSION`. Bump `package.json` only; git tags on main (e.g. `v1.12.0`)
- Commit messages: lowercase imperative ("implement darkmode toggle", "fix filter bar styling")
- `origin` pushes to **both** GitHub and Azure DevOps (dual push URLs); fetch comes from Azure. Azure DevOps is where PRs live.

### Claude: never commit or push automatically

**Claude must not run `git commit`, `git push`, `git merge`, or `git tag` on its own initiative** — only when explicitly asked in the current conversation. When a chunk of work is ready, instead **update the commit-plan doc** (`audit_docs/COMMIT_PLAN.md` during the audit program) with one entry per proposed commit:

- the files to stage together,
- the proposed commit message (lowercase imperative),
- a one-line rationale for the grouping.

The owner reviews, splits/reorders as they see fit, and executes the commits and pushes themselves — especially for code changes.

---

## Build & Deploy

```bash
npm run dev         # dev server on port 5174
npm run build       # tsc -b && vite build
npm run preview     # local preview of prod build
npm run lint        # eslint
npm run test        # vitest run (unit/component, CI mode)
npm run test:watch  # vitest watch
npm run test:e2e    # build + playwright test (chromium, stubbed API)
npm run test:e2e:ui # playwright test --ui (interactive)
npm run deploy      # build + copy index.html → 404.html + gh-pages deploy
```

**Unit/component tests** (Vitest) live in `src/__tests__/` with subfolders mirroring `src/` (`mappers/`, `service/`, `utils/`, `components/`, `hooks/`, `store/`). Shared helpers in `__tests__/helpers/` (`renderWithProviders.tsx`); global setup in `__tests__/setup.ts`.

**E2E tests** (Playwright, chromium-only) live in `e2e/*.spec.ts`. The backend is fully stubbed per-test via `page.route` (fixtures + helpers in `e2e/support/stubApi.ts`), so no live API is needed — locally or in CI. Tests run against the production build served by `vite preview` (port 4173). Auth is exercised with a fake session hint (`e2e/support/stubApi.ts` → `loginSession`) since tokens are HttpOnly cookies. **Cypress was removed in M7 — Playwright is the sole e2e framework.**

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every PR and on pushes to `main`/`development`/`refactor/ui-audit`: two jobs — **unit** (lint → build → vitest) and **e2e** (build → Playwright). Note: PRs are reviewed/merged on Azure DevOps, so GitHub checks are advisory — confirm the green checkmark before merging in Azure.

---

## Do / Don't

**Do:**
- Use semantic color tokens (`text-foreground`, `text-brand`, `border-border`) — never `text-gray-800 dark:text-slate-100`
- Use `@/` path alias for all imports
- Use `useTranslation()` for every user-visible string (an eslint rule enforces this)
- Map API responses through `mappers/` inside each endpoint's `transformResponse` — components never see DTOs
- Keep UI preferences in `AppSettingContext`, server data in RTK Query; put `lang` in every article-ish query arg (`useApiLang()`)
- Follow the existing folder structure when adding new components
- **Docstrings on all generated code:** every new function, hook, context, service, or utility you write must have a JSDoc comment (`/** ... */`) describing what it does, its parameters, and its return value if non-obvious
- **Inline comments in long blocks:** for any function or code block longer than ~20 lines, add short inline comments to section off distinct logical steps (e.g. `// validate inputs`, `// build query params`, `// update store`) so the flow is easy to scan
- Preserve existing inline comments — only remove a comment if the code it describes has been changed or deleted and the comment no longer applies

**Don't:**
- Add `tailwind.config.js` — this is Tailwind v4 (CSS-first)
- Hardcode color pairs with `dark:` variants when a semantic token exists
- Put English strings directly in JSX (brand names/proper nouns go in `{"..."}` literal expressions with a why-comment)
- Import `@base-ui/react` in domain components — compose the primitives in `src/components/ui/` instead
- Use relative imports (`../../` or `./`) — always `@/`
- Await `incrementArticleViewed()` — it's intentionally fire-and-forget
- Strip inline comments when editing adjacent code — leave them intact unless they are actively misleading after your change
- Skip the JSDoc or section comments on trivial one-liners or self-evident code — comment where it actually helps
