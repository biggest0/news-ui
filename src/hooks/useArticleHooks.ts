import { useEffect } from "react";

import { useApiLang } from "@/hooks/useApiLang";
import { useGetFeaturedQuery } from "@/store/api/articleEndpoints";

interface UseInfiniteScrollProps {
	/** Whether infinite scroll is active (false in page-pagination mode). */
	enabled: boolean;
	/** From the infinite query: whether another page exists. */
	hasNextPage: boolean;
	/** From the infinite query: a request is already in flight. */
	isFetching: boolean;
	/** From the infinite query: pulls the next page into the cache entry. */
	fetchNextPage: () => void;
}

/**
 * Window-scroll driver for RTK Query infinite queries (M5): near the bottom
 * (700px threshold) it calls `fetchNextPage`. Page bookkeeping, dedupe, and
 * reset-on-filter-change all live in the query cache now — RTKQ ignores
 * fetchNextPage while a page request is in flight.
 */
export function useListInfiniteScroll({
	enabled,
	hasNextPage,
	isFetching,
	fetchNextPage,
}: UseInfiniteScrollProps) {
	useEffect(() => {
		if (!enabled) return;

		const handleScroll = () => {
			if (
				!isFetching &&
				hasNextPage &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 700
			) {
				fetchNextPage();
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [enabled, hasNextPage, isFetching, fetchNextPage]);
}

/**
 * Returns the server-curated featured articles ("staff picks") via RTK Query.
 * Co-mounted sections (desktop + mobile variants) share one cache entry, and
 * a language switch refetches automatically (lang is part of the cache key).
 */
export function useFeaturedArticles() {
	const lang = useApiLang();
	const { data: featuredArticles = [] } = useGetFeaturedQuery({ lang });
	return featuredArticles;
}
