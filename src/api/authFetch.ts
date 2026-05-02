import { authStore } from "@/auth/authStore";
import { isTokenExpired } from "@/auth/jwtUtils";

/**
 * Fetch wrapper for authenticated calls.
 *
 * Two refresh paths, in order:
 *   1. Proactive — if the JWT's `exp` says it's expired (or about to be),
 *      refresh BEFORE sending. Avoids the wasted 401 round-trip in the
 *      common "user came back to the page" case.
 *   2. Reactive — if the request still comes back 401 (clock skew, opaque
 *      token, server-side revocation), refresh once and retry.
 *
 * If both refreshes fail, the session is cleared and the 401 response is
 * returned so the caller can handle it.
 */
export async function authFetch(
	url: string,
	accessToken: string | null,
	init: RequestInit = {},
): Promise<Response> {
	let token = accessToken;

	if (token && isTokenExpired(token)) {
		const fresh = await authStore.refresh();
		if (fresh) {
			token = fresh;
		} else {
			authStore.clearSession();
			token = null;
		}
	}

	const headers = new Headers(init.headers);
	if (token) headers.set("Authorization", `Bearer ${token}`);

	const response = await fetch(url, { ...init, headers });
	if (response.status !== 401) return response;

	const newToken = await authStore.refresh();
	if (!newToken) {
		authStore.clearSession();
		return response;
	}

	headers.set("Authorization", `Bearer ${newToken}`);
	return fetch(url, { ...init, headers });
}
