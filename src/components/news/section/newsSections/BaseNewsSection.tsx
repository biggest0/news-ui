import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import NewsSideColumn from "../../shared/NewsSideColumn";
import type { ArticleInfo } from "@/types/articleTypes";
import type { ArticleInfoQueryDTO } from "@/types/articleDto";
import type { RootState } from "@/store/store";
import {
	useArticleHistory,
	useArticleFilters,
	useInfiniteScroll,
} from "@/hooks/useArticleHooks";
import { usePagination } from "@/hooks/usePagination";
import { FilterBar } from "../../shared/FilterBar";
import { ArticleList } from "../../shared/ArticleList";
import { LoadingMessage } from "../../shared/LoadingMessage";
import { PaginationControls } from "../../shared/PaginationControls";
import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { usePagePagination } from "@/hooks/usePagePagination";

interface BaseNewsSectionProps {
	articles: ArticleInfo[];
	totalCount: number; // Total articles available from server
	loadMoreArticles: (request: ArticleInfoQueryDTO) => void;
	resetKey?: string;
}

export function BaseNewsSection({
	articles,
	totalCount,
	loadMoreArticles,
	resetKey,
}: BaseNewsSectionProps) {
	const location = useLocation();
	const selectedCategory = location.pathname.split("/")[1];
	const { loading } = useSelector((state: RootState) => state.article);

	const isPaginationEnabled = usePagePagination();

	const handleLocalStorageUpdate = useArticleHistory();

	const { articlesToDisplay, dateRange, setDateRange, sortBy, setSortBy } =
		useArticleFilters(articles);

	// Track if this is the initial mount to avoid fetching on first render
	const isInitialMount = useRef(true);
	// Store loadMoreArticles in ref to avoid effect re-running when function reference changes
	const loadMoreArticlesRef = useRef(loadMoreArticles);
	loadMoreArticlesRef.current = loadMoreArticles;

	// Fetch fresh data when filters change to get updated count from server
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		// Request page 1 with new filters to get fresh count
		loadMoreArticlesRef.current({
			page: 1,
			category: selectedCategory,
			dateRange,
			sortBy,
		});
	}, [dateRange, sortBy, selectedCategory]);

	// Infinite scroll logic - only enabled when pagination is disabled
	useInfiniteScroll({
		currentArticlesCount: articles.length,
		totalArticlesCount: totalCount,
		loadMoreArticles,
		selectedCategory,
		resetKey,
		enabled: !isPaginationEnabled,
		dateRange,
		sortBy,
	});

	// Pagination logic - fetches pages directly from API
	const {
		paginatedArticles,
		currentPage,
		totalPages,
		pageSize,
		setPageSize,
		goToPage,
		hasNextPage,
		hasPrevPage,
		isLoading: isPaginationLoading,
	} = usePagination({
		selectedCategory,
		dateRange,
		sortBy,
	});

	const handleDateRangeChange = (value: string) => {
		setDateRange(value);
	};

	const handleSortByChange = (value: string) => {
		setSortBy(value);
	};

	// Determine which articles to show based on mode
	const displayedArticles = isPaginationEnabled
		? paginatedArticles
		: articlesToDisplay;

	return (
		<div className="flex flex-col md:grid md:grid-cols-3 gap-x-4 gap-y-6 pt-6">
			{/* Articles, main col */}
			<section className="md:col-span-2">
				<div className="flex flex-row justify-between w-full items-center">
					<div className="flex flex-row gap-2 items-center">
						<SectionHeaderExpandable title="MEWS" />
						{/* <SectionHeader title="MEWS" /> */}
					</div>
					<div className="flex items-center gap-4">
						<FilterBar
							dateRange={dateRange}
							sortBy={sortBy}
							onDateRangeChange={handleDateRangeChange}
							onSortByChange={handleSortByChange}
						/>
					</div>
				</div>

				<ArticleList
					articles={displayedArticles}
					onArticleRead={handleLocalStorageUpdate}
				/>

				{/* Show loading message for infinite scroll or pagination */}
				{!isPaginationEnabled && (
					<LoadingMessage isLoading={loading.articles} />
				)}
				{isPaginationEnabled && (
					<LoadingMessage isLoading={isPaginationLoading} />
				)}

				{/* Show pagination controls only in pagination mode */}
				{isPaginationEnabled && (
					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						pageSize={pageSize}
						onPageChange={goToPage}
						onPageSizeChange={setPageSize}
						hasNextPage={hasNextPage}
						hasPrevPage={hasPrevPage}
					/>
				)}
			</section>

			{/* Side col for md screen and larger */}
			<div className="hidden md:flex flex-col space-y-6 pl-4 border-l border-gray-400">
				<NewsSideColumn />
			</div>
		</div>
	);
}
