import { useState, useEffect, useMemo, useCallback } from "react";
import type { ArticleInfo } from "@/types/articleTypes";
import { getArticlesInfo } from "@/service/articleService";

export type PageSize = 5 | 10 | 20 | 50;

interface UsePaginationProps {
	selectedCategory: string;
	initialPageSize?: PageSize;
	dateRange?: string;
	sortBy?: string;
}

interface UsePaginationReturn {
	paginatedArticles: ArticleInfo[];
	currentPage: number;
	totalPages: number;
	pageSize: PageSize;
	totalCount: number;
	isLoading: boolean;
	setPageSize: (size: PageSize) => void;
	goToPage: (page: number) => void;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export function usePagination({
	selectedCategory,
	initialPageSize = 5,
	dateRange,
	sortBy,
}: UsePaginationProps): UsePaginationReturn {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<PageSize>(initialPageSize);
	const [paginatedArticles, setPaginatedArticles] = useState<ArticleInfo[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	// Calculate total pages based on server's total count
	const totalPages = useMemo(
		() => Math.max(1, Math.ceil(totalCount / pageSize)),
		[totalCount, pageSize]
	);

	const hasNextPage = currentPage < totalPages;
	const hasPrevPage = currentPage > 1;

	// Fetch articles for a specific page directly from the API
	const fetchPage = useCallback(async (page: number, limit: PageSize) => {
		setIsLoading(true);
		try {
			const response = await getArticlesInfo({
				page,
				limit,
				category: selectedCategory || undefined,
				dateRange,
				sortBy,
			});
			setPaginatedArticles(response.articles);
			setTotalCount(response.count);
		} catch (error) {
			console.error("Error fetching page:", error);
		} finally {
			setIsLoading(false);
		}
	}, [selectedCategory, dateRange, sortBy]);

	// Fetch initial page and when filters change
	useEffect(() => {
		setCurrentPage(1);
		fetchPage(1, pageSize);
	}, [selectedCategory, dateRange, sortBy, pageSize, fetchPage]);

	// Navigate to a specific page
	const goToPage = useCallback((page: number) => {
		const validPage = Math.max(1, Math.min(page, totalPages || 1));
		setCurrentPage(validPage);
		fetchPage(validPage, pageSize);
	}, [totalPages, pageSize, fetchPage]);

	const handlePageSizeChange = useCallback((size: PageSize) => {
		setPageSize(size);
		// Will trigger useEffect to fetch page 1 with new size
	}, []);

	return {
		paginatedArticles,
		currentPage,
		totalPages,
		pageSize,
		totalCount,
		isLoading,
		setPageSize: handlePageSizeChange,
		goToPage,
		hasNextPage,
		hasPrevPage,
	};
}
