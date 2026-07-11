import { API_URL } from "@/config/config";
import { authFetch } from "@/api/authFetch";

/**
 * M5 note: like status/toggle and reading-history reads/mutations moved to
 * RTK Query (store/api/userContentEndpoints.ts). Only the fire-and-forget
 * read-recording POST remains here — it is intentionally not a mutation hook
 * because nothing awaits it or consumes its result.
 */

/**
 * POST /api/articles/:id/read
 * Records that the authenticated user read an article. Fire-and-forget.
 */
export function postArticleRead(articleId: string) {
	authFetch(`${API_URL}/api/articles/${articleId}/read`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});
}
