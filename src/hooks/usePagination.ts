import { useEffect, useMemo, useState } from "react";

import type { ArticleInfo } from "@/types/articleTypes";
import { useApiLang } from "@/hooks/useApiLang";
import { useGetArticlesPageQuery } from "@/store/api/articleEndpoints";

export type PageSize = 5 | 10 | 20 | 50;

interface UsePaginationProps {
	selectedCategory: string;
	initialPageSize?: PageSize;
	dateRange?: string;
	sortBy?: string;
	/** Only fetch while page-pagination mode is active. */
	enabled?: boolean;
}

interface UsePaginationReturn {
	paginatedArticles: ArticleInfo[];
	currentPage: number;
	totalPages: number;
	pageSize: PageSize;
	totalCount: number;
	isLoading: boolean;
	isError: boolean;
	refetchPage: () => void;
	setPageSize: (size: PageSize) => void;
	goToPage: (page: number) => void;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

/**
 * Page-mode pagination on RTK Query (M5): each {page, size, filters, lang}
 * combination is its own cache entry, so revisiting a page is instant and a
 * language/filter change refetches automatically. Only page/size state lives
 * here — data, loading, and errors come from the query hook.
 */
export function usePagination({
	selectedCategory,
	initialPageSize = 5,
	dateRange,
	sortBy,
	enabled = true,
}: UsePaginationProps): UsePaginationReturn {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<PageSize>(initialPageSize);
	const lang = useApiLang();

	// Back to page 1 whenever the result set changes shape
	useEffect(() => {
		setCurrentPage(1);
	}, [selectedCategory, dateRange, sortBy, pageSize]);

	const { data, isFetching, isError, refetch } = useGetArticlesPageQuery(
		{
			page: currentPage,
			limit: pageSize,
			category: selectedCategory || undefined,
			dateRange,
			sortBy,
			lang,
		},
		{ skip: !enabled }
	);

	const totalCount = data?.count ?? 0;
	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(totalCount / pageSize)),
		[totalCount, pageSize]
	);

	return {
		paginatedArticles: data?.articles ?? [],
		currentPage,
		totalPages,
		pageSize,
		totalCount,
		isLoading: isFetching,
		isError,
		refetchPage: refetch,
		setPageSize,
		goToPage: (page: number) =>
			setCurrentPage(Math.max(1, Math.min(page, totalPages || 1))),
		hasNextPage: currentPage < totalPages,
		hasPrevPage: currentPage > 1,
	};
}
