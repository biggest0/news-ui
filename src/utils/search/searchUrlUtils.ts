export type SearchType = "keyword" | "semantic";

export interface SearchParams {
	query: string;
	dateRange: string;
	sortBy: string;
	searchType: SearchType;
}

/**
 * Parses search parameters from URL search string
 * @param search - URL search string (e.g., "?q=test&dateRange=7d&sortBy=newest&searchType=keyword")
 * @returns Parsed search parameters
 */
export function parseSearchParams(search: string): SearchParams {
	const params = new URLSearchParams(search);
	const rawType = params.get("searchType");
	return {
		query: params.get("q") || "",
		dateRange: params.get("dateRange") || "all",
		sortBy: params.get("sortBy") || "newest",
		searchType: rawType === "semantic" ? "semantic" : "keyword",
	};
}

/**
 * Builds a URL search string from search parameters
 * @param params - Search parameters object
 * @returns URL search string (e.g., "q=test&dateRange=7d&sortBy=newest&searchType=keyword")
 */
export function buildSearchParams(params: Partial<SearchParams>): string {
	const urlParams = new URLSearchParams();
	if (params.query) urlParams.set("q", params.query);
	if (params.dateRange) urlParams.set("dateRange", params.dateRange);
	if (params.sortBy) urlParams.set("sortBy", params.sortBy);
	if (params.searchType) urlParams.set("searchType", params.searchType);
	return urlParams.toString();
}

/**
 * Builds a full search URL path
 * @param params - Search parameters object
 * @returns Full URL path (e.g., "/search?q=test&dateRange=7d&sortBy=newest&searchType=keyword")
 */
export function buildSearchUrl(params: Partial<SearchParams>): string {
	const urlParams = new URLSearchParams();
	if (params.query) urlParams.set("q", params.query);
	if (params.dateRange) urlParams.set("dateRange", params.dateRange);
	if (params.sortBy) urlParams.set("sortBy", params.sortBy);
	if (params.searchType) urlParams.set("searchType", params.searchType);
	const queryString = urlParams.toString();
	return `/search${queryString ? `?${queryString}` : ""}`;
}
