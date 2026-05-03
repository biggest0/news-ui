import {
	postToggleLike,
	fetchLikeStatus,
	postArticleRead,
	fetchArticleHistory,
	deleteArticleHistory,
	deleteArticleHistoryItem,
} from "@/api/userArticleApi";
import { mapDTOtoArticleHistoryItem } from "@/mappers/articleMapper";
import type { ArticleLikeStatus, ArticleHistoryResponse } from "@/types/articleTypes";

/**
 * Toggles the like status of an article.
 * @returns The new like status and count
 * @throws Error with a user-friendly message on failure
 */
export async function toggleArticleLike(
	articleId: string
): Promise<ArticleLikeStatus> {
	try {
		const data = await postToggleLike(articleId);
		return { liked: data.liked, likeCount: data.like_count };
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			throw error;
		}
		throw new Error("Unable to update like. Please check your connection.");
	}
}

/**
 * Gets the like status and count for an article.
 * @returns The like status and count, or defaults on error
 */
export async function getArticleLikeStatus(
	articleId: string
): Promise<ArticleLikeStatus> {
	try {
		const data = await fetchLikeStatus(articleId);
		return { liked: data.liked, likeCount: data.like_count };
	} catch (error) {
		console.error("[Error fetching like status]:", error);
		return { liked: false, likeCount: 0 };
	}
}

/**
 * Records that the user read an article.
 * Fire-and-forget — do not await.
 */
export function recordArticleRead(articleId: string) {
	postArticleRead(articleId);
}

/**
 * Fetches the user's reading history from the server.
 * @returns Paginated history with article info and read timestamps
 */
export async function getArticleHistory(
	page: number = 1,
	limit: number = 20
): Promise<ArticleHistoryResponse> {
	try {
		const data = await fetchArticleHistory(page, limit);
		return {
			articles: data.articles.map(mapDTOtoArticleHistoryItem),
			count: data.count,
		};
	} catch (error) {
		console.error("[Error fetching article history]:", error);
		return { articles: [], count: 0 };
	}
}

/**
 * Clears all reading history for the authenticated user.
 * @throws Error with a user-friendly message on failure
 */
export async function clearArticleHistory(): Promise<void> {
	try {
		await deleteArticleHistory();
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			throw error;
		}
		throw new Error("Unable to clear history. Please check your connection.");
	}
}

/**
 * Removes a single article from the user's reading history.
 * @throws Error with a user-friendly message on failure
 */
export async function removeArticleFromHistory(
	articleId: string
): Promise<void> {
	try {
		await deleteArticleHistoryItem(articleId);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("HTTP error")) {
				throw new Error("Failed to connect to server. Please try again later.");
			}
			throw error;
		}
		throw new Error("Unable to remove article from history. Please check your connection.");
	}
}
