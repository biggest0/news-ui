import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import NewsSideColumn from "@/components/news/shared/NewsSideColumn";
import type { ArticleInfo, ArticleQuery } from "@/types/articleTypes";
import type { RootState } from "@/store/store";
import {
	useArticleFilters,
	useListInfiniteScroll,
} from "@/hooks/useArticleHooks";
import { usePagination } from "@/hooks/usePagination";
import { FilterBar } from "@/components/news/shared/FilterBar";
import { ArticleList } from "@/components/news/shared/ArticleList";
import { LoadingMessage } from "@/components/news/shared/LoadingMessage";
import { PaginationControls } from "@/components/news/shared/PaginationControls";
import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import { usePagePagination } from "@/hooks/usePagePagination";
import { SECTIONS } from "@/constants/keys";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import {
	useAllSectionNotVisible,
	useSectionVisible,
} from "@/hooks/useSectionCollapse";
import { useAppSettings } from "@/contexts/AppSettingContext";
import EmptyStateSection from "@/components/news/section/EmptyStateSection";

interface BaseNewsSectionProps {
	articles: ArticleInfo[];
	totalCount: number; // Total articles available from server
	loadMoreArticles: (request: ArticleQuery) => void;
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
	const isAllSectionNotVisible = useAllSectionNotVisible();
	const isPaginationEnabled = usePagePagination();

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
	useListInfiniteScroll({
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
	const { t } = useTranslation();

	// Determine which articles to show based on mode
	const displayedArticles = isPaginationEnabled
		? paginatedArticles
		: articlesToDisplay;

	return (
		<div className="flex flex-col md:grid md:grid-cols-3 md:items-start gap-x-4 gap-y-6 pt-6">
			{/* Articles, main col */}
			<SectionShell visible={isVisible} className="md:col-span-2">
				{/* Header and filters */}
				<div className="flex flex-row justify-between w-full items-center">
					<SectionHeaderExpandable
						title={t("SECTION.MEWS")}
						section={SECTIONS.NEWS}
					/>
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
					/>
					{/* Show loading message for infinite scroll or pagination */}
					{!isPaginationEnabled && (
						<LoadingMessage isLoading={loading.articles} />
					)}
					{isPaginationEnabled && !hasNextPage && (
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
			</SectionShell>

			{/* Hidden state with reset option */}
			<div
				className={`md:col-span-2 ${
					// mews section not visible, there are some section(s) visible
					!isVisible && !isAllSectionNotVisible ? "" : "hidden"
				}`}
			>
				<EmptyStateSection
					isVisible={!isVisible && !isAllSectionNotVisible}
					resetSectionVisibility={() =>
						updateSectionVisibility(SECTIONS.NEWS, true)
					}
					message={t("EMPTY_STATE.NEWS_SECTION_MESSAGE")}
					buttonText={t("EMPTY_STATE.BRING_BACK_BUTTON")}
				/>
			</div>

			{/* Side col for md screen and larger */}
			<NewsSideColumn />
		</div>
	);
}
