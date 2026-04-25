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
├── api/                  # Raw fetch calls (articleApi.ts, formApi.ts)
├── components/
│   ├── common/           # Reusable UI: feedback, layout, navigation, social, theme, user
│   ├── layout/           # App shell: header, footer, navBar, sideColumn
│   ├── news/             # Domain: cards/, section/, shared/ (FilterBar, PaginationControls)
│   └── search/           # Search-specific filters
├── config/               # config.ts — API_URL, BASE_URL, APP_VERSION
├── constants/            # routes.ts, keys.ts
├── contexts/             # AppSettingContext — theme + layout preferences
├── hooks/                # Custom hooks (see below)
├── i18n/                 # Translation files + i18next config
├── mappers/              # DTO → domain type conversion (articleMapper.ts)
├── pages/                # Route-level components
├── service/              # Business logic + error handling wrapping api/
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
| `bg-accent-bg` / `hover:bg-accent-bg` | amber-500 | amber-600 | Button fills |
| `bg-accent-subtle` | amber-100 | amber-900/40% | Hover tints on controls |
| `bg-hover-bg` | gray-100 | slate-700 | Neutral hover backgrounds |

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
/                       → HomePage
/:category              → ArticlesPage (world, lifestyle, science, technology, business, sport, politics, other)
/article/:id            → ArticlePage
/subcategory/:subCategory → SubCategoryPage
/search                 → SearchPage
/about, /contact, /account, /disclaimer → static pages
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

| Hook | Purpose |
|---|---|
| `useAppSettings()` | Access theme, section visibility, toggles from context |
| `useArticleHistory()` | User reading history (localStorage, max 100, deduped) |
| `useArticleFilters(articles)` | Client-side date range + sort filtering |
| `useInfiniteScroll(...)` | Scroll-triggered load more (700px threshold) |
| `usePagination(...)` | Page-based pagination with page size selector |
| `useSectionVisible(section)` | Section visibility state |
| `useSectionCollapse(section)` | Section expand/collapse state |

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
- All article fetches go through `src/api/articleApi.ts` → `src/service/articleService.ts`
- `incrementArticleViewed()` is **fire-and-forget** — do not await it
- Forms: `src/api/formApi.ts` handles email subscriptions

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
npm run dev        # dev server on port 5174, LAN accessible (host: 0.0.0.0)
npm run build      # tsc -b && vite build
npm run preview    # local preview of prod build
npm run lint       # eslint
npm run deploy     # build + copy index.html → 404.html + gh-pages deploy
```

---

## Do / Don't

**Do:**
- Use semantic color tokens (`text-primary`, `border-border`) — never `text-gray-800 dark:text-slate-100`
- Use `@/` path alias for all imports
- Use `useTranslation()` for every user-visible string
- Map API responses through `articleMapper` before storing in Redux
- Keep UI preferences in `AppSettingContext`, server data in Redux
- Follow the existing folder structure when adding new components

**Don't:**
- Add `tailwind.config.js` — this is Tailwind v4 (CSS-first)
- Hardcode color pairs with `dark:` variants when a semantic token exists
- Put English strings directly in JSX
- Mutate Redux state directly (use slice actions)
- Use relative `../../` imports — use `@/`
- Await `incrementArticleViewed()` — it's intentionally fire-and-forget
