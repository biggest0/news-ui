export interface SearchParams {
	query: string;
	dateRange: string;
	sortBy: string;
}

/**
 * Parses search parameters from URL search string
 * @param search - URL search string (e.g., "?q=test&dateRange=7d&sortBy=newest")
 * @returns Parsed search parameters
 */
export function parseSearchParams(search: string): SearchParams {
	const params = new URLSearchParams(search);
	return {
		query: params.get("q") || "",
		dateRange: params.get("dateRange") || "",
		sortBy: params.get("sortBy") || "",
	};
}

/**
 * Builds a URL search string from search parameters
 * @param params - Search parameters object
 * @returns URL search string (e.g., "q=test&dateRange=7d&sortBy=newest")
 */
export function buildSearchParams(params: Partial<SearchParams>): string {
	const urlParams = new URLSearchParams();
	if (params.query) urlParams.set("q", params.query);
	if (params.dateRange) urlParams.set("dateRange", params.dateRange);
	if (params.sortBy) urlParams.set("sortBy", params.sortBy);
	return urlParams.toString();
}

/**
 * Builds a full search URL path
 * @param params - Search parameters object
 * @returns Full URL path (e.g., "/search?q=test&dateRange=7d")
 */
export function buildSearchUrl(params: Partial<SearchParams>): string {
	const queryString = buildSearchParams(params);
	return `/search${queryString ? `?${queryString}` : ""}`;
}
