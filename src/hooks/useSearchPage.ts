import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/store/store";
import type { ArticleInfo } from "@/types/articleTypes";
import { loadArticlesInfoBySearch } from "@/store/articlesSlice";
import { loadSemanticSearchResults } from "@/store/recommendationsSlice";
import { parseSearchParams, type SearchParams, type SearchType } from "@/utils/search/searchUrlUtils";
import { filterAndSortArticles, type SearchFilters } from "@/utils/search/searchUtils";

/**
 * Hook to read and parse search parameters from URL
 * @returns Parsed search parameters
 */
export function useSearchParams(): SearchParams {
	const location = useLocation();
	return parseSearchParams(location.search);
}

/**
 * Hook to load articles when search query or search type changes.
 * Dispatches keyword or semantic search thunk based on searchType.
 */
export function useSearchArticles(
	query: string,
	searchType: SearchType,
	dateRange: string,
	sortBy: string
) {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!query) return;
		if (searchType === "semantic") {
			dispatch(loadSemanticSearchResults({ q: query, page: 1, dateRange, sortBy }));
		} else {
			dispatch(loadArticlesInfoBySearch({ page: 1, search: query, dateRange, sortBy }));
		}
	}, [query, searchType, dateRange, sortBy, dispatch]);
}

/**
 * Hook to create a subset of articles by filtering and sorting articles based on search parameters
 * @param articles - All articles from Redux store
 * @param filters - Search filters (query, dateRange, sortBy)
 * @returns Filtered and sorted articles
 */
export function useFilteredArticles(
	articles: ArticleInfo[],
	filters: SearchFilters
): ArticleInfo[] {
	const [filteredArticles, setFilteredArticles] = useState<ArticleInfo[]>([]);

	useEffect(() => {
		const result = filterAndSortArticles(articles, filters);
		setFilteredArticles(result);
	}, [articles, filters.query, filters.dateRange, filters.sortBy]);

	return filteredArticles;
}

/**
 * Hook to track pagination state and determine if more articles can be loaded
 * @param filteredArticles - Filtered articles to display
 * @param filters - Current search filters (used to detect filter changes)
 * @returns Object with pagination state (showMore, fetching, page)
 */
export function useSearchPagination(
	filteredArticles: ArticleInfo[],
	filters: SearchFilters
) {
	const prevFilteredArticlesLength = useRef(0);
	const prevFiltersRef = useRef<SearchFilters>(filters);
	const [page, setPage] = useState(1);
	const [showMore, setShowMore] = useState(true);
	const [fetching, setFetching] = useState(false);

	// Reset pagination when filters change
	useEffect(() => {
		const filtersChanged =
			prevFiltersRef.current.query !== filters.query ||
			prevFiltersRef.current.dateRange !== filters.dateRange ||
			prevFiltersRef.current.sortBy !== filters.sortBy;

		if (filtersChanged) {
			prevFilteredArticlesLength.current = 0;
			setShowMore(true);
			setFetching(false);
			prevFiltersRef.current = filters;
		}
	}, [filters]);

	// Check if more filtered articles can be loaded
	useEffect(() => {
		if (filteredArticles.length === prevFilteredArticlesLength.current) {
			setShowMore(false);
		} else {
			setShowMore(true);
			setFetching(false);
			prevFilteredArticlesLength.current = filteredArticles.length;
		}
	}, [filteredArticles]);

	return {
		page,
		setPage,
		showMore,
		fetching,
		setFetching,
	};
}

/**
 * Hook to handle infinite scroll loading of articles
 */
export function useInfiniteScroll(
	query: string,
	searchType: SearchType,
	dateRange: string,
	sortBy: string,
	showMore: boolean,
	fetching: boolean,
	page: number,
	setPage: (updater: (prev: number) => number) => void,
	setFetching: (value: boolean) => void
) {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const handleScroll = () => {
			if (
				!fetching &&
				showMore &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 100
			) {
				setFetching(true);
				setPage((prev) => prev + 1);
				if (searchType === "semantic") {
					dispatch(
						loadSemanticSearchResults({
							q: query,
							page: page + 1,
							dateRange,
							sortBy,
						})
					);
				} else {
					dispatch(
						loadArticlesInfoBySearch({
							page: page + 1,
							search: query,
							dateRange,
							sortBy,
						})
					);
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, showMore, query, searchType, dateRange, sortBy, page, dispatch, setPage, setFetching]);
}
