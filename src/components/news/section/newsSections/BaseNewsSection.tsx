import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import NewsSideColumn from "@/components/news/shared/NewsSideColumn";
import { useListInfiniteScroll } from "@/hooks/useArticleHooks";
import { usePagination } from "@/hooks/usePagination";
import { useApiLang } from "@/hooks/useApiLang";
import { FilterBar } from "@/components/news/shared/FilterBar";
import { ArticleList } from "@/components/news/shared/ArticleList";
import { LoadingMessage } from "@/components/news/shared/LoadingMessage";
import { LoadingOverlay } from "@/components/common/feedback/LoadingOverlay";
import { PaginationControls } from "@/components/news/shared/PaginationControls";
import { SectionHeaderExpandable } from "@/components/common/layout/SectionHeaderExpandable";
import { SectionShell } from "@/components/common/layout/SectionShell";
import { SectionErrorMessage } from "@/components/common/feedback/SectionErrorMessage";
import { usePagePagination } from "@/hooks/usePagePagination";
import { SECTIONS } from "@/constants/keys";
import CollapsibleSection from "@/components/news/section/CollapsibleSection";
import {
	useAllSectionNotVisible,
	useSectionVisible,
} from "@/hooks/useSectionCollapse";
import { useAppSettings } from "@/contexts/AppSettingContext";
import { useGetArticlesInfiniteQuery } from "@/store/api/articleEndpoints";
import EmptyStateSection from "@/components/news/section/EmptyStateSection";

interface BaseNewsSectionProps {
	/** Main category to load; omit for the home feed (all categories). */
	category?: string;
	/** Show the full-page overlay during the initial load (home page). */
	overlayOnInitialLoad?: boolean;
}

/**
 * The main article list (home + category pages) — RTK Query consumer.
 *
 * Scroll mode uses a native infinite query: pages accumulate in one cache
 * entry per {category, filters, lang} and `fetchNextPage` pulls the next
 * page. Page mode delegates to usePagination (a per-page query). A language
 * or filter change alters the query arg, which refetches automatically —
 * the old manual "refetch on filter change" effect and `resetKey` are gone.
 */
export function BaseNewsSection({
	category,
	overlayOnInitialLoad = false,
}: BaseNewsSectionProps) {
	const { t } = useTranslation();
	const lang = useApiLang();

	const isVisible = useSectionVisible(SECTIONS.NEWS);
	const isAllSectionNotVisible = useAllSectionNotVisible();
	const isPaginationEnabled = usePagePagination();
	const { updateSectionVisibility } = useAppSettings();

	// Filter state — the server applies dateRange/sortBy (they're part of the
	// query arg), so changing either swaps to a fresh cache entry and refetches.
	const [dateRange, setDateRange] = useState("all");
	const [sortBy, setSortBy] = useState("newest");

	// Infinite-scroll mode
	const {
		data,
		isLoading,
		isFetching,
		isError,
		refetch,
		hasNextPage,
		fetchNextPage,
	} = useGetArticlesInfiniteQuery(
		{ category, dateRange, sortBy, lang },
		{ skip: isPaginationEnabled }
	);
	const scrollArticles = data?.pages.flatMap((p) => p.articles) ?? [];

	useListInfiniteScroll({
		enabled: !isPaginationEnabled,
		hasNextPage: !!hasNextPage,
		isFetching,
		fetchNextPage,
	});

	// Page mode
	const {
		paginatedArticles,
		currentPage,
		totalPages,
		pageSize,
		setPageSize,
		goToPage,
		hasNextPage: hasNextPaginationPage,
		hasPrevPage,
		isLoading: isPaginationLoading,
		isError: isPageError,
		refetchPage,
	} = usePagination({
		selectedCategory: category ?? "",
		dateRange,
		sortBy,
		enabled: isPaginationEnabled,
	});

	const displayedArticles = isPaginationEnabled
		? paginatedArticles
		: scrollArticles;
	const showError = isPaginationEnabled ? isPageError : isError;

	// The full-page overlay is a first-open affair only: latch true once the
	// first batch of articles is present so later page changes or filter swaps
	// (which momentarily empty a page-mode cache entry) never re-trigger it.
	const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
	useEffect(() => {
		if (displayedArticles.length > 0) setHasLoadedOnce(true);
	}, [displayedArticles.length]);

	// Initial-load signal for the active mode. Scroll mode reads the infinite
	// query's first-load flag; page mode is skipped there, so it falls back to
	// its own fetch state. Gated on hasLoadedOnce so the overlay shows only
	// while we're still waiting for the very first response.
	const isInitialLoading =
		!hasLoadedOnce && (isPaginationEnabled ? isPaginationLoading : isLoading);

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
						onDateRangeChange={setDateRange}
						onSortByChange={setSortBy}
					/>
				</div>

				{/* Article list */}
				<CollapsibleSection section={SECTIONS.NEWS}>
					{showError ? (
						<SectionErrorMessage
							onRetry={isPaginationEnabled ? refetchPage : refetch}
						/>
					) : (
						<>
							<ArticleList articles={displayedArticles} />
							{/* Loading feedback per mode */}
							{!isPaginationEnabled && (
								<LoadingMessage isLoading={isFetching} />
							)}
							{isPaginationEnabled && !hasNextPaginationPage && (
								<LoadingMessage isLoading={isPaginationLoading} />
							)}
							{isPaginationEnabled && (
								<PaginationControls
									currentPage={currentPage}
									totalPages={totalPages}
									pageSize={pageSize}
									onPageChange={goToPage}
									onPageSizeChange={setPageSize}
									hasNextPage={hasNextPaginationPage}
									hasPrevPage={hasPrevPage}
								/>
							)}
						</>
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

			{overlayOnInitialLoad && <LoadingOverlay loading={isInitialLoading} />}
		</div>
	);
}
