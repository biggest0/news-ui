import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { API_URL } from "@/config/config";
import { authStore } from "@/auth/authStore";
import { getApiLang } from "@/i18n/lang";

/**
 * Plain base query: HttpOnly-cookie auth via credentials:"include";
 * the backend reads tokens from cookies, never from JS.
 */
const baseQuery = fetchBaseQuery({
	baseUrl: API_URL,
	credentials: "include",
});

/**
 * Wraps the base query with the documented RTK Query re-auth pattern
 * (redux-toolkit docs → customizing-queries): on a 401, attempt one token
 * refresh and retry the original request.
 *
 * Differences from the doc example, on purpose:
 * - Refresh goes through `authStore.refresh()`, which already dedupes
 *   concurrent refreshes behind a single in-flight promise (so we don't need
 *   the async-mutex dependency) and keeps the user object in sync.
 * - Session hint (F043): if no session is known, don't attempt a refresh at
 *   all — anonymous users get a clean failure instead of a guaranteed-401
 *   refresh round-trip.
 */
export const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		// no known session → nothing to refresh
		if (!authStore.getState().isAuthenticated) {
			return result;
		}

		const refreshed = await authStore.refresh();
		if (refreshed) {
			// retry the original request with the rotated cookie
			result = await baseQuery(args, api, extraOptions);
		} else {
			authStore.clearSession();
		}
	}

	return result;
};

/**
 * The single RTK Query API slice. Domain endpoint files (articles, cat facts,
 * recommendations, user content) inject their endpoints into this slice via
 * `apiSlice.injectEndpoints` — one reducer + one middleware for everything.
 *
 * Localization: article-ish endpoints put `lang` (from getApiLang()) in their
 * query arg, so an EN↔FR switch is a cache-key change that refetches
 * automatically — no manual resets or page remounts.
 */
export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Like", "History"],
	endpoints: () => ({}),
});

/** Current-language helper re-exported so endpoint files build args uniformly. */
export const currentLang = () => getApiLang();
