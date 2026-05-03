import { authStore } from "@/auth/authStore";

/**
 * Fetch wrapper for authenticated calls.
 *
 * Sends requests with `credentials: "include"` so the browser attaches
 * HttpOnly auth cookies automatically. No token is passed or managed
 * client-side.
 *
 * If the request returns 401, attempts a single cookie-based refresh
 * and retries. If the refresh also fails, the session is cleared.
 */
export async function authFetch(
	url: string,
	init: RequestInit = {},
): Promise<Response> {
	const response = await fetch(url, { ...init, credentials: "include" });
	if (response.status !== 401) return response;

	const refreshed = await authStore.refresh();
	if (!refreshed) {
		authStore.clearSession();
		return response;
	}

	return fetch(url, { ...init, credentials: "include" });
}
