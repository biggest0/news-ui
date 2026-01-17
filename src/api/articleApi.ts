import type { ArticleInfoQueryDTO } from "@/types/articleDto";
import { API_URL } from "@/config/config";

/**
 * Fetches article information from the server with optional filters
 * @param page - The page number to fetch (default: 1)
 * @param limit - The number of articles per page (default: 10)
 * @param category - Optional category filter
 * @param search - Optional search query filter
 * @param dateRange - Optional date range filter
 * @param sortBy - Optional sort criteria
 * @returns The response data from the server containing article information
 * @throws Error if the HTTP request fails
 */
export async function fetchArticlesInfo({
	page = 1,
	limit = 10,
	category,
	search,
	dateRange,
	sortBy,
}: ArticleInfoQueryDTO) {
	const params = new URLSearchParams();
	params.append("page", page.toString());
	params.append("limit", limit.toString());
	if (category) params.append("category", category);
	if (search) params.append("search", search);
	if (dateRange) params.append("dateRange", dateRange);
	if (sortBy) params.append("sortBy", sortBy);

	const response = await fetch(`${API_URL}/article-info?${params}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Fetches articles filtered by category from the server
 * @param page - The page number to fetch
 * @param category - The category to filter articles by
 * @returns The response data from the server containing article information
 * @throws Error if the HTTP request fails
 */
export async function fetchArticlesByCategory(page: number, category: string) {
	const response = await fetch(
		`${API_URL}/article-info?page=${page}&limit=10&category=${category}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Fetches articles filtered by search query from the server
 * @param page - The page number to fetch
 * @param search - The search query to filter articles by
 * @returns The response data from the server containing article information
 * @throws Error if the HTTP request fails
 */
export async function fetchArticlesBySearch(page: number, search: string) {
	const response = await fetch(
		`${API_URL}/article-info?page=${page}&limit=10&search=${search}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Fetches detailed information for a specific article from the server
 * @param articleId - The unique identifier of the article
 * @returns The response data from the server containing detailed article information
 * @throws Error if the HTTP request fails
 */
export async function fetchArticleDetail(articleId: string) {
	const response = await fetch(`${API_URL}/article-detail`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: articleId }),
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Increments the view count for a specific article on the server
 * @param articleId - The unique identifier of the article
 * @throws Error if the HTTP request fails
 */
export function incrementArticleViewed(articleId: string) {
	fetch(`${API_URL}/increment-article-view/${articleId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
	});
	// don't expect a repsonse, so no return/ no async because just incrementing view of article with specific ID
}

/**
 * Fetches the top ten most viewed articles from the server
 * @returns The response data from the server containing the top ten articles
 * @throws Error if the HTTP request fails
 */
export async function fetchTopTenArticles() {
	const response = await fetch(`${API_URL}/article-top-ten`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	return response.json();
}

// take date site loaded
// for last 24 hours grab most viewed
// tie breakers do time published
// grab 6

// export async function fetchTodayPopularArticles() {
// 	const today = new Date()
// 	const response = await fetch(`${API_URL}/article-info`, {
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify({ today: today }),
// 	});
// 	if (!response.ok) {
// 		throw new Error(`Error: ${response.statusText}`);
// 	}
// 	const data = await response.json();
// 	return articleDetailTransform(data);
// }
