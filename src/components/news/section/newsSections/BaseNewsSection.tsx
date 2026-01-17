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
import { SECTIONS } from "@/constants/keys";
import CollapsibleSection from "../CollapsibleSection";
import { useSectionVisible } from "@/hooks/useSectionCollapse";
import { useAppSettings } from "@/contexts/AppSettingContext";

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

	const isVisible = useSectionVisible(SECTIONS.NEWS);

	const isPaginationEnabled = usePagePagination();

	const handleLocalStorageUpdate = useArticleHistory();

	const { updateSectionVisibility } = useAppSettings();

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
			<section className={`md:col-span-2 ${isVisible ? "" : "hidden"}`}>
				{/* Header and filters */}
				<div className="flex flex-row justify-between w-full items-center">
					<SectionHeaderExpandable title="MEWS" section={SECTIONS.NEWS} />
					<FilterBar
						dateRange={dateRange}
						sortBy={sortBy}
						onDateRangeChange={handleDateRangeChange}
						onSortByChange={handleSortByChange}
					/>
				</div>

				{/* Article list */}
				<CollapsibleSection section={SECTIONS.NEWS}>
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
				</CollapsibleSection>
			</section>

			{/* Hidden state with reset option */}
			<section className={`md:col-span-2 ${isVisible ? "hidden" : ""}`}>
				<div className="flex flex-col p-8 items-center text-center gap-4">
					{/* Add cat illustration later*/}

					{/* Text content */}
					<div className="space-y-2">
						<p className="text-sm font-medium text-gray-800">
							Looks like you removed the Mews section
						</p>
					</div>

					{/* Reset button */}
					<button className="underline text-gray-800 text-sm rounded-lg hover:text-amber-600 transition-colors duration-200 cursor-pointer"
					onClick={() => updateSectionVisibility(SECTIONS.NEWS, true)}>
						Bring It Back
					</button>
				</div>
			</section>

			{/* Side col for md screen and larger */}
			<NewsSideColumn />
		</div>
	);
}
