import { API_URL } from "@/config/config";

/**
 * M5 note: all article reads (lists, search, detail, top-ten, featured)
 * moved to RTK Query endpoints (store/api/articleEndpoints.ts). Only the
 * fire-and-forget view increment remains here.
 */

/**
 * Fire-and-forget increment of an article's view counter.
 * POST /api/articles/:id/view
 * @param articleId - The unique identifier of the article
 */
export function incrementArticleViewed(articleId: string) {
	fetch(`${API_URL}/api/articles/${articleId}/view`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});
	// no response expected — intentionally not awaited (see CLAUDE.md)
}
