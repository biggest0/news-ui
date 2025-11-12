import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/store/store";
import type { ArticleInfo } from "@/types/articleTypes";
import { loadArticlesInfoBySearch } from "@/store/articlesSlice";
import { parseSearchParams, type SearchParams } from "@/utils/search/searchUrlUtils";
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
 * Hook to load articles when search query changes
 * @param query - Search query string
 */
export function useSearchArticles(query: string) {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (query) {
			dispatch(loadArticlesInfoBySearch({ page: 1, search: query }));
		}
	}, [query, dispatch]);
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
 * @param query - Search query string
 * @param showMore - Whether more articles can be loaded (based on filtered articles)
 * @param fetching - Whether a fetch is currently in progress
 * @param page - Current page number
 * @param setPage - Function to update page number
 * @param setFetching - Function to update fetching state
 */
export function useInfiniteScroll(
	query: string,
	showMore: boolean,
	fetching: boolean,
	page: number,
	setPage: (updater: (prev: number) => number) => void,
	setFetching: (value: boolean) => void
) {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const handleScroll = () => {
			// Only load more if not fetching and more articles can be shown
			if (
				!fetching &&
				showMore &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 100
			) {
				setFetching(true);
				setPage((prev) => prev + 1);
				dispatch(
					loadArticlesInfoBySearch({
						page: page + 1,
						search: query,
					})
				);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [fetching, showMore, query, page, dispatch, setPage, setFetching]);
}
