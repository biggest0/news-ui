# M5 — RTK Query Migration Design

> Owner decisions baked in (2026-07-10): retire the `<main key>` remount · session-hint flag for silent refresh · inline per-section error messages · standard cache defaults. Patterns verified against official docs (context7 → /reduxjs/redux-toolkit: customizing-queries.mdx re-auth + mutex; infinite-queries.mdx native infiniteQuery).

## Architecture

```
Component → RTKQ hook (useGetXQuery)         [src/store/api/*]
              └─ baseQueryWithReauth          401 → (has_session?) refresh → retry, mutex-guarded
                   └─ fetchBaseQuery          credentials:"include", VITE_API_URL
              transformResponse → mappers/    components still never see DTOs
```

- **One `createApi`** (`src/store/api/apiSlice.ts`), endpoints injected per domain file (`articleEndpoints.ts`, `catFactEndpoints.ts`, `recommendationEndpoints.ts`, `userContentEndpoints.ts`) via `injectEndpoints` — keeps files small, one reducer/middleware.
- **Auth stays in `authStore`** (module store + useSyncExternalStore) — unchanged. `authService`/`authApi` untouched this milestone.
- **`lang` in every article-ish query arg** (from `getApiLang()`), so EN↔FR is a cache-key change → automatic refetch. The `languageChanged` → manual slice resets → `<main key={lang}>` remount chain is **retired**; `<html lang>` setting stays.
- **Type acyclicity (F049 lesson):** the api slice defines its own types; nothing imports `RootState` back into endpoint files.

## baseQueryWithReauth + session hint (F043)

Per the documented pattern (async-mutex variant) with one addition: refresh is only attempted when the non-sensitive `has_session` localStorage flag exists (set on login/register/successful refresh, cleared on logout/failed refresh). Anonymous visitors: zero `/auth/refresh` calls, zero console 401s. Tokens remain HttpOnly-cookie only. `authFetch.ts` keeps serving the remaining non-RTKQ authed calls (authStore bootstrap) until M8 review.

## Endpoint map

| Old thunk/service | New endpoint | Type | Notes |
|---|---|---|---|
| loadCatFacts | `getCatFacts({lang})` | query | thunk-`condition` dedupe → automatic cache sharing |
| loadSimilarArticles | `getSimilarArticles({articleId,lang})` | query | per-article cache replaces slice's keyed map |
| loadRecommendedArticles | `getRecommendedArticles({lang})` | query (authed) | skip-gated on isAuthenticated |
| loadSemanticSearchResults | `searchSemantic` | **infiniteQuery** | pages accumulate in one entry |
| like status / toggle | `getLikeStatus({id})` + `toggleLike` mutation | query+mutation | mutation invalidates `["Like", id]` |
| reading history | `getHistory({page})` | query | tag `["History"]`, invalidated by recordArticleRead? No — record stays fire-and-forget; history refetches on mount (standard staleness) |
| loadArticleDetail | `getArticleDetail({id,lang})` | query | replaces articlesDetail map cache |
| loadTopTenArticles | `getTopTen({lang})` | query | |
| loadFeaturedArticles | `getFeatured({lang})` | query | |
| loadInitialArticlesInfo / ByCategory / BySubCategory / BySearch (+ append reducers) | `getArticles` (`{category?,subCategory?,search?,dateRange?,sortBy?,lang}`) | **infiniteQuery** | native `build.infiniteQuery` (RTK ≥2.6): `initialPageParam:1`, `getNextPageParam` from `count`; `data.pages.flat()` in consumers |
| incrementArticleViewed | stays as-is in `articleApi.ts` | fire-and-forget | explicitly NOT awaited (CLAUDE.md rule) |

- `usePagination` (page mode) consumes `getArticles` as a plain paged query variant (page in arg → per-page cache entries) — page mode and scroll mode share the endpoint definition via two exported hooks.
- Error UX: shared `<SectionErrorMessage onRetry={refetch} />` (localized `COMMON.LOAD_ERROR` + `COMMON.RETRY`, EN/FR) rendered where `isError`.

## Migration order & deletions

catFacts → recommendations → userContent → articles; gates green after each. After each step: delete the slice, its thunks, its service functions that only served it (mappers stay), and its consumers' dispatch/useSelector wiring. `main.tsx` languageChanged handler and `App.tsx` `<main key>` go in the articles step. Superseded tests replaced by endpoint-level tests (transformResponse units + store-level integration).

## Explicitly out of scope

Auth-flow migration to RTKQ · form Actions (D3) · `authFetch` removal · error-logging middleware centralization (O3 — revisit M6).
