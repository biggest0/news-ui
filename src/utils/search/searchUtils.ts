import type { ArticleInfo } from "@/types/articleTypes";
import { isWithinNDays } from "@/utils/date/dateUtils";
import { sortArticlesByMatchCount } from "@/utils/search/sortUtils";

export type DateRange = "24h" | "7d" | "30d" | "all" | "";
export type SortOption = "relevant" | "newest" | "";

export interface SearchFilters {
	query: string;
	dateRange: DateRange;
	sortBy: SortOption;
}

/**
 * Filters articles by date range
 * @param articles - Articles to filter
 * @param dateRange - Date range filter ("24h", "7d", "30d", "all", or "")
 * @returns Filtered articles
 */
function filterByDateRange(
	articles: ArticleInfo[],
	dateRange: DateRange
): ArticleInfo[] {
	if (!dateRange || dateRange === "all") {
		return articles;
	}

	const daysMap: Record<string, number> = {
		"24h": 1,
		"7d": 7,
		"30d": 30,
	};

	const days = daysMap[dateRange];
	if (!days) return articles;

	return articles.filter((article) => {
		if (article.datePublished) {
			return isWithinNDays(article.datePublished, days);
		}
		return false;
	});
}

/**
 * Filters articles by search query (title and summary)
 * @param articles - Articles to filter
 * @param query - Search query string
 * @returns Filtered articles
 */
function filterByQuery(articles: ArticleInfo[], query: string): ArticleInfo[] {
	if (!query.trim()) {
		return articles;
	}

	const lowerCaseQuery = query.toLowerCase();
	return articles.filter(
		(article) =>
			article.title.toLowerCase().includes(lowerCaseQuery) ||
			article.summary?.toLowerCase().includes(lowerCaseQuery)
	);
}

/**
 * Sorts articles based on sort option
 * @param articles - Articles to sort
 * @param sortBy - Sort option ("relevant", "newest", or "")
 * @param query - Search query (needed for relevant sorting)
 * @returns Sorted articles
 */
function sortArticles(
	articles: ArticleInfo[],
	sortBy: SortOption,
	query: string
): ArticleInfo[] {
	if (!sortBy) {
		return articles;
	}

	switch (sortBy) {
		case "relevant":
			return sortArticlesByMatchCount(articles, query);

		case "newest":
			return [...articles].sort((a, b) => {
				if (b.datePublished && a.datePublished) {
					return (
						new Date(b.datePublished).getTime() -
						new Date(a.datePublished).getTime()
					);
				}
				return 0;
			});

		default:
			return articles;
	}
}

/**
 * Applies all search filters and sorting to articles
 * @param articles - Articles to filter and sort
 * @param filters - Search filters object
 * @returns Filtered and sorted articles
 */
export function filterAndSortArticles(
	articles: ArticleInfo[],
	filters: SearchFilters
): ArticleInfo[] {
	if (!filters.query.trim()) {
		return [];
	}

	let result = articles;

	// Filter by query
	result = filterByQuery(result, filters.query);

	// Filter by date range
	result = filterByDateRange(result, filters.dateRange);

	// Sort articles
	result = sortArticles(result, filters.sortBy, filters.query);

	return result;
}
