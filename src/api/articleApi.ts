import type { ArticleInfoQueryDTO, RecommendedArticlesResponseDTO, SemanticSearchResponseDTO } from "@/types/articleDto";
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
 * Fetches articles filtered by subcategory from the server
 * @param page - The page number to fetch
 * @param subCategory - The subcategory to filter articles by
 * @returns The response data from the server containing article information
 * @throws Error if the HTTP request fails
 */
export async function fetchArticlesBySubCategory(page: number, subCategory: string) {
	const response = await fetch(
		`${API_URL}/article-info?page=${page}&limit=10&subCategory=${subCategory}`,
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

/**
 * Fetches articles semantically similar to a given article.
 * Public endpoint — no auth required.
 * @param articleId - The seed article to find similar articles for
 * @returns The response containing similar articles with similarity scores
 * @throws Error if the HTTP request fails
 */
export async function fetchSimilarArticles(
	articleId: string
): Promise<RecommendedArticlesResponseDTO> {
	const response = await fetch(`${API_URL}/api/articles/${articleId}/similar`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Fetches personalised article recommendations for the logged-in user.
 * Requires a valid access token. The backend builds a profile vector
 * from the user's reading history and returns semantically similar articles.
 * @param accessToken - Bearer token for authentication
 * @returns The response containing recommended articles with similarity scores
 * @throws Error if the HTTP request fails
 */
export async function fetchRecommendedArticles(
	accessToken: string
): Promise<RecommendedArticlesResponseDTO> {
	const response = await fetch(`${API_URL}/api/recommendations`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	return response.json();
}

/**
 * Vectorises the query string and returns semantically similar articles.
 * GET /api/articles/search/similar
 * @param q         - Search text (required)
 * @param page      - Page number (default: 1)
 * @param dateRange - "all" | "24h" | "7d" | "30d"
 * @param sortBy    - "newest" | "relevant"
 * @returns Articles with similarity scores and total count
 * @throws Error if the HTTP request fails
 */
export async function fetchSemanticSearch({
	q,
	page = 1,
	dateRange = "all",
	sortBy = "newest",
}: {
	q: string;
	page?: number;
	dateRange?: string;
	sortBy?: string;
}): Promise<SemanticSearchResponseDTO> {
	const params = new URLSearchParams();
	params.set("q", q);
	params.set("page", page.toString());
	if (dateRange) params.set("dateRange", dateRange);
	if (sortBy) params.set("sortBy", sortBy);

	const response = await fetch(
		`${API_URL}/api/articles/search/similar?${params}`,
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
