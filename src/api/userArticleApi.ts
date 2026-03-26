import { API_URL } from "@/config/config";
import type { ArticleLikeStatusDTO, ArticleHistoryResponseDTO } from "@/types/articleDto";

/**
 * POST /api/articles/:id/like
 * Toggles the like status of an article for the authenticated user.
 * @param articleId - The article to like/unlike
 * @param accessToken - Bearer token for authentication
 * @returns The new like status and total like count
 * @throws Error if the request fails
 */
export async function postToggleLike(
	articleId: string,
	accessToken: string
): Promise<ArticleLikeStatusDTO> {
	const response = await fetch(`${API_URL}/api/articles/${articleId}/like`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

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
 * @param articleId - The article to check
 * @param accessToken - Optional Bearer token for authentication
 * @returns The like status and total like count
 * @throws Error if the request fails
 */
export async function fetchLikeStatus(
	articleId: string,
	accessToken?: string | null
): Promise<ArticleLikeStatusDTO> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}

	const response = await fetch(`${API_URL}/api/articles/${articleId}/like`, {
		method: "GET",
		headers,
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return await response.json();
}

/**
 * POST /api/articles/:id/read
 * Records that the authenticated user read an article.
 * Fire-and-forget — do not await.
 * @param articleId - The article that was read
 * @param accessToken - Bearer token for authentication
 */
export function postArticleRead(articleId: string, accessToken: string) {
	fetch(`${API_URL}/api/articles/${articleId}/read`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
}

/**
 * GET /api/user/history
 * Fetches the authenticated user's reading history (paginated, newest first).
 * @param page - Page number (default 1)
 * @param limit - Articles per page (default 20)
 * @param accessToken - Bearer token for authentication
 * @returns Paginated list of articles with read_at timestamps
 * @throws Error if the request fails
 */
export async function fetchArticleHistory(
	accessToken: string,
	page: number = 1,
	limit: number = 20
): Promise<ArticleHistoryResponseDTO> {
	const response = await fetch(
		`${API_URL}/api/user/history?page=${page}&limit=${limit}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
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
 * @param accessToken - Bearer token for authentication
 * @throws Error if the request fails
 */
export async function deleteArticleHistory(accessToken: string): Promise<void> {
	const response = await fetch(`${API_URL}/api/user/history`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}

/**
 * DELETE /api/user/history/:articleId
 * Removes a single article from the user's reading history.
 * @param articleId - The article to remove from history
 * @param accessToken - Bearer token for authentication
 * @throws Error if the request fails
 */
export async function deleteArticleHistoryItem(
	articleId: string,
	accessToken: string
): Promise<void> {
	const response = await fetch(`${API_URL}/api/user/history/${articleId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}
