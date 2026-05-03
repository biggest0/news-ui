import { API_URL } from "@/config/config";
import { authFetch } from "@/api/authFetch";
import type { ArticleLikeStatusDTO, ArticleHistoryResponseDTO } from "@/types/articleDto";

/**
 * POST /api/articles/:id/like
 * Toggles the like status of an article for the authenticated user.
 */
export async function postToggleLike(
	articleId: string
): Promise<ArticleLikeStatusDTO> {
	const response = await authFetch(
		`${API_URL}/api/articles/${articleId}/like`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!response.ok) {
		const error = await response.json().catch(() => null);
		throw new Error(error?.message || `HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * GET /api/articles/:id/like
 * Fetches the like status and count for an article.
 * If authenticated, returns whether the current user liked it.
 */
export async function fetchLikeStatus(
	articleId: string
): Promise<ArticleLikeStatusDTO> {
	const response = await authFetch(
		`${API_URL}/api/articles/${articleId}/like`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

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

/**
 * GET /api/user/history
 * Fetches the authenticated user's reading history (paginated, newest first).
 */
export async function fetchArticleHistory(
	page: number = 1,
	limit: number = 20
): Promise<ArticleHistoryResponseDTO> {
	const response = await authFetch(
		`${API_URL}/api/user/history?page=${page}&limit=${limit}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * DELETE /api/user/history
 * Clears all reading history for the authenticated user.
 */
export async function deleteArticleHistory(): Promise<void> {
	const response = await authFetch(`${API_URL}/api/user/history`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}

/**
 * DELETE /api/user/history/:articleId
 * Removes a single article from the user's reading history.
 */
export async function deleteArticleHistoryItem(
	articleId: string
): Promise<void> {
	const response = await authFetch(
		`${API_URL}/api/user/history/${articleId}`,
		{
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}
