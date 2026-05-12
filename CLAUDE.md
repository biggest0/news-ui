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
| Build | Vite `^7.0.3` + `@vitejs/plugin-react ^4.0.0` |
| State | Redux Toolkit `^2.8.2` + `react-redux ^9.2.0` |
| Routing | `react-router-dom ^7.8.2` |
| Styling | Tailwind CSS `^4.1.11` (v4 — CSS-first, no `tailwind.config.js`) |
| i18n | `i18next ^25.x` + `react-i18next ^16.x` |
| Icons | `react-icons ^5.5.0` |

---

## Project Structure

```
src/
├── __tests__/            # Vitest suites (components/, helpers/, mappers/, service/, utils/) + setup.ts
├── api/                  # Raw fetch calls (articleApi, authApi, authFetch, formApi, userArticleApi)
├── auth/                 # authStore.ts — module-level auth state (subscribed to via useAuth)
├── blog/                 # registry.ts auto-discovers posts/*.tsx via import.meta.glob
├── components/
│   ├── account/          # AccountPage building blocks (AccountInfoSection, AccountInfoForm)
│   ├── common/           # Reusable UI: feedback, layout, navigation, social, theme, user
│   ├── layout/           # App shell: header, footer, navBar, sideColumn
│   ├── news/             # Domain: cards/, section/, shared/ (FilterBar, PaginationControls)
│   └── search/           # Search-specific filters
├── config/               # config.ts — API_URL, BASE_URL, APP_VERSION
├── constants/            # routes.ts, keys.ts
├── contexts/             # AppSettingContext (UI prefs), AuthContext (AuthProvider + useAuth)
├── hooks/                # Custom hooks (see below)
├── i18n/                 # Translation files + i18next config
├── mappers/              # DTO → domain type conversion (articleMapper.ts)
├── pages/                # Route-level components
├── service/              # Business logic + error handling wrapping api/ (article, auth, form, localStorage, userArticle)
├── store/                # Redux store: articlesSlice, recommendationsSlice, userContentSlice
├── types/                # Domain types, DTO types, localStorage types, prop types
└── utils/                # date, search, storage, text, validation utilities
```

### Path Alias

`@/` maps to `./src/`. Always use `@/` for imports, never relative `../../`.

---

## Styling: Tailwind v4 + Semantic CSS Tokens

This project uses **Tailwind v4's CSS-first approach** — there is no `tailwind.config.js`. Configuration lives in `src/index.css`.

### Color Token System

All colors are defined as CSS custom properties in `src/index.css` and auto-switched for dark mode. **Never hardcode `text-gray-800 dark:text-slate-100` pairs in components** — use the semantic tokens instead.

| Token class | Light value | Dark value | Usage |
|---|---|---|---|
| `text-primary` / `bg-primary` | gray-800 | slate-100 | Headings, titles |
| `text-secondary` / `bg-secondary` | gray-600 | slate-300 | Body text, form inputs |
| `text-muted` | gray-500 | slate-400 | Dates, captions, icons |
| `text-disabled` | gray-300 | slate-600 | Disabled UI |
| `border-border` | gray-400 | slate-600 | Standard dividers |
| `border-border-subtle` | gray-200 | slate-700 | Light dividers |
| `bg-surface` | white | slate-900 | Page background |
| `bg-elevated` | white | slate-800 | Cards, inputs, dropdowns |
| `bg-elevated-glass` | white/50% | slate-800/70% | Translucent surfaces |
| `text-accent` / `hover:text-accent` | amber-600 | amber-400 | Interactive text, links |
| `bg-accent-bg` | amber-500 | amber-600 | Button fills |
| `hover:bg-accent-bg-hover` | amber-700 | amber-500 | Hover state for accent button fills |
| `bg-accent-subtle` | amber-100 | amber-900/40% | Hover tints on controls |
| `bg-hover-bg` | gray-100 | slate-700 | Neutral hover backgrounds |
| `bg-control-active` | white | slate-600 | Selected toggle/chip on top of `bg-hover-bg` |
| `bg-disabled-bg` | gray-400 | slate-600 | Disabled fill on accent buttons |
| `placeholder:text-placeholder` | gray-400 | slate-500 | Input placeholder text |
| `text-success` | green-600 | green-400 | Success message text |
| `text-error` | red-600 | red-400 | Error message text |
| `text-warning` / `bg-warning-subtle` / `border-warning-border` | yellow-700 / yellow-100 / yellow-500 | yellow-400 / yellow-900/30 / yellow-600 | Warning text, surface, border (NoticeBar) |

**To change a color:** edit the variable value in `src/index.css` — components update automatically.

### Dark Mode Mechanism

- Tailwind dark mode is **class-based**: `html.dark` (set by `AppSettingContext`)
- `@custom-variant dark (&:where(.dark, .dark *))` is declared in `index.css`
- CSS variables override themselves in `html.dark { }` — no `dark:` prefixes needed on semantic tokens
- Only use `dark:` prefix for one-off exceptions that can't be tokenized (e.g. `dark:focus:ring-offset-slate-800`)

### Exception: Category Colors in NewsCard

The `categoryColor()` function in `NewsCard.tsx` uses raw Tailwind + `dark:` pairs intentionally — these are visually distinct per category and don't fit the semantic token system.

### Fonts

- **Body:** `Tinos` (serif) — applied globally via `body { font-family: "Tinos" }`
- **Headings (h1–h6):** `Cardo` (serif) — applied globally
- Both loaded from Google Fonts in `index.css`

---

## State Management

**Redux** (`src/store/`) handles all **async server data**:
- `articlesSlice` (`state.article`) — home/category/search articles, article details, topTen, loading flags, errors
- `recommendationsSlice` (`state.recommendations`) — similar articles (cached by articleId) and personalised recommendations
- `userContentSlice` (`state.userContent`) — per-article like status and user reading history
- Article details are cached in `state.article.articlesDetail` (keyed by ID)
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
  → Redux thunk (articlesSlice / recommendationsSlice / userContentSlice)
    → service/ (error handling + mapping)
      → api/ (fetch calls)
        → backend REST API
```

DTOs from the API are **always mapped** in `src/mappers/articleMapper.ts` before entering the Redux store. Components never see raw DTOs.

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

---

## Component Conventions

- **File names:** PascalCase (`NewsCard.tsx`, `ThemeToggle.tsx`)
- **Exports:** `export default function ComponentName()` for components; named exports for utilities/types/hooks
- **Props:** Define inline `interface ComponentNameProps` above the component; use `src/types/props/` only when props are shared across multiple components
- **Prop callbacks:** Type explicitly — `onRead?: (article: ArticleInfo) => void`
- **Hooks first:** Extract logic into custom hooks in `src/hooks/` rather than bloating components
- **Mobile vs Desktop:** Many sections have separate mobile components (e.g. `MobileEditorsSection`, `MobileMenu`); check before adding responsive logic inline

---

## Key Custom Hooks

| Hook | File | Purpose |
|---|---|---|
| `useAppSettings()` | `contexts/AppSettingContext.tsx` | Access theme, section visibility, toggles, pagination mode |
| `useAuth()` | `contexts/AuthContext.tsx` | Subscribe to auth store; exposes user, isAuthenticated, login/register/logout |
| `useArticleFilters(articles)` | `hooks/useArticleHooks.ts` | Client-side date range + sort filtering |
| `useInfiniteScroll(...)` | `hooks/useArticleHooks.ts` | Scroll-triggered load more (700px threshold) for category/home news |
| `usePagination(...)` | `hooks/usePagination.ts` | Page-based pagination with page size selector |
| `usePagePagination()` | `hooks/usePagePagination.ts` | Reads pagination mode (page vs scroll) from app settings |
| `useLocalStorage(key, init)` | `hooks/useLocalStorage.ts` | Generic localStorage-backed state |
| `useSectionVisible(section)` | `hooks/useSectionCollapse.ts` | Section visibility state |
| `useSectionCollapse(section)` | `hooks/useSectionCollapse.ts` | Section expand/collapse state |
| `useAllSectionNotVisible()` | `hooks/useSectionCollapse.ts` | True when every home section is hidden (drives empty state) |
| `useSectionDropdown(sectionKey)` | `hooks/useSectionDropdown.ts` | Builds the per-section dropdown options (collapse / remove / view mode) |
| `useSearchPage` exports | `hooks/useSearchPage.ts` | `useSearchParams`, `useSearchArticles`, `useFilteredArticles`, `useSearchPagination`, `useInfiniteScroll` |
| `useSubCategoryPage` exports | `hooks/useSubCategoryPage.ts` | `useSubCategoryArticles`, `useSubCategoryInfiniteScroll` |

> **Note:** `useInfiniteScroll` is exported from both `useArticleHooks.ts` and `useSearchPage.ts` with different signatures — import from the file matching the page you're on (search vs. category/home).

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

- Base URL: `import.meta.env.VITE_API_URL` (falls back to `http://localhost:3001`)
- Every API module pairs with a service module that handles errors + DTO mapping:
  - `articleApi.ts` ↔ `articleService.ts` — articles, details, top-ten, similar, recommended, semantic search
  - `authApi.ts` ↔ `authService.ts` — register, login, logout, refresh, Google OAuth exchange, email verify, password reset
  - `userArticleApi.ts` ↔ `userArticleService.ts` — like status, reading history, `recordArticleRead`
  - `formApi.ts` ↔ `formService.ts` — email subscriptions
  - `localStorageService.ts` — localStorage read/write helpers (no api/ pair)
- `authFetch.ts` wraps `fetch` with HttpOnly-cookie auth + 401 → silent refresh + retry. Use it for any authenticated endpoint.
- `incrementArticleViewed()` is **fire-and-forget** — do not await it

---

## Git Workflow

- **`main`** — production branch (deployed to GitHub Pages)
- **`development`** — active development branch; PRs target this
- Merge `development` → `main` for releases
- Versioning: `APP_VERSION` in `src/config/config.ts`, git tags on main (e.g. `v1.3.0`)
- Commit messages: lowercase imperative ("implement darkmode toggle", "fix filter bar styling")

---

## Build & Deploy

```bash
npm run dev         # dev server on port 5174, LAN accessible (host: 0.0.0.0)
npm run build       # tsc -b && vite build
npm run preview     # local preview of prod build
npm run lint        # eslint
npm run test        # vitest run (CI mode)
npm run test:watch  # vitest watch
npm run deploy      # build + copy index.html → 404.html + gh-pages deploy
```

Tests live in `src/__tests__/` with subfolders mirroring `src/` (`mappers/`, `service/`, `utils/`, `components/`). Shared test helpers live in `__tests__/helpers/` (e.g. `renderWithProviders.tsx`); global setup in `__tests__/setup.ts`.

---

## Do / Don't

**Do:**
- Use semantic color tokens (`text-primary`, `border-border`) — never `text-gray-800 dark:text-slate-100`
- Use `@/` path alias for all imports
- Use `useTranslation()` for every user-visible string
- Map API responses through `articleMapper` before storing in Redux
- Keep UI preferences in `AppSettingContext`, server data in Redux
- Follow the existing folder structure when adding new components
- Preserve existing inline comments — only remove a comment if the code it describes has been changed or deleted and the comment no longer applies
- Add inline comments to large or complex code blocks where the logic isn't immediately obvious; section off distinct parts of a function with a short comment when it aids readability

**Don't:**
- Add `tailwind.config.js` — this is Tailwind v4 (CSS-first)
- Hardcode color pairs with `dark:` variants when a semantic token exists
- Put English strings directly in JSX
- Mutate Redux state directly (use slice actions)
- Use relative `../../` imports — use `@/`
- Await `incrementArticleViewed()` — it's intentionally fire-and-forget
- Strip inline comments when editing adjacent code — leave them intact unless they are actively misleading after your change
