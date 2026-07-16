import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import type { ArticleInfo } from "@/types/articleTypes";
import { useApiLang } from "@/hooks/useApiLang";
import {
	useSearchKeywordInfiniteQuery,
	useSearchSemanticInfiniteQuery,
} from "@/store/api/articleEndpoints";
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
 * Runs the active search (keyword or semantic) as an RTK Query infinite
 * query. The inactive mode is skipped entirely; pages accumulate per
 * {q, filters, lang} cache entry, and changing any of those (including the
 * language) starts a fresh entry — no manual resets.
 *
 * @returns Flattened results + scroll driver state for the active mode.
 */
export function useSearchResults(params: SearchParams) {
	const lang = useApiLang();
	const isSemantic = params.searchType === "semantic";
	const arg = {
		q: params.query,
		dateRange: params.dateRange,
		sortBy: params.sortBy,
		lang,
	};

	const keyword = useSearchKeywordInfiniteQuery(arg, {
		skip: !params.query || isSemantic,
	});
	const semantic = useSearchSemanticInfiniteQuery(arg, {
		skip: !params.query || !isSemantic,
	});

	const active = isSemantic ? semantic : keyword;

	// Semantic results are RecommendedArticle — normalize for NewsCard
	const articles: ArticleInfo[] = useMemo(() => {
		if (isSemantic) {
			return (
				semantic.data?.pages.flatMap((p) =>
					p.articles.map((a) => ({
						id: a.id,
						title: a.title,
						summary: a.summary,
						datePublished: a.datePublished,
						mainCategory: a.mainCategory,
						subCategory: a.subCategory,
						viewed: 0,
						likeCount: 0,
					}))
				) ?? []
			);
		}
		return keyword.data?.pages.flatMap((p) => p.articles) ?? [];
	}, [isSemantic, semantic.data, keyword.data]);

	return {
		articles,
		isError: active.isError,
		isFetching: active.isFetching,
		refetch: active.refetch,
		hasNextPage: !!active.hasNextPage,
		fetchNextPage: active.fetchNextPage,
	};
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
	// Derived data — computed during render with useMemo instead of the previous
	// setState-in-useEffect pattern, which double-rendered and briefly showed
	// stale results ("You Might Not Need an Effect", M4/F033).
	return useMemo(
		() => filterAndSortArticles(articles, filters),
		[articles, filters]
	);
}

/**
 * Window-scroll driver for the search infinite queries — near the bottom
 * (100px threshold, matching the old behavior) pulls the next page of the
 * active search mode.
 */
export function useSearchInfiniteScroll({
	enabled,
	hasNextPage,
	isFetching,
	fetchNextPage,
}: {
	enabled: boolean;
	hasNextPage: boolean;
	isFetching: boolean;
	fetchNextPage: () => void;
}) {
	useEffect(() => {
		if (!enabled) return;

		const handleScroll = () => {
			if (
				!isFetching &&
				hasNextPage &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 100
			) {
				fetchNextPage();
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [enabled, hasNextPage, isFetching, fetchNextPage]);
}
