/**
 * Component tests for BaseNewsSection.
 *
 * BaseNewsSection is the core article listing component shared by
 * HomeNewsSection and CategoryNewsSection. It orchestrates:
 * - Article filtering and sorting (useArticleFilters)
 * - Infinite scroll loading (useInfiniteScroll)
 * - Server-side pagination (usePagination)
 * - Section visibility and collapse (useSectionVisible, CollapsibleSection)
 * - Empty state with a "Bring It Back" reset button
 *
 * Key behaviors tested:
 * - Renders section header, filter bar, and article list
 * - Shows PaginationControls only in pagination mode
 * - Shows LoadingMessage in infinite scroll mode
 * - Hides main section when not visible
 * - Shows EmptyStateSection when hidden but other sections are visible
 * - "Bring It Back" button calls updateSectionVisibility
 * - Renders NewsSideColumn
 *
 * Dependencies mocked:
 * - @/hooks/useArticleHooks       — useArticleFilters, useInfiniteScroll
 * - @/hooks/usePagination          — usePagination
 * - @/hooks/usePagePagination      — usePagePagination
 * - @/hooks/useSectionCollapse     — useSectionVisible, useAllSectionNotVisible, useSectionCollapse
 * - @/contexts/AppSettingContext    — useAppSettings
 * - @/components/news/shared/NewsSideColumn           — stub (renders 3 child sections)
 * - @/components/common/layout/SectionHeaderExpandable — stub
 * - @/components/news/shared/ArticleList               — stub (avoids NewsCard dep tree)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/__tests__/helpers/renderWithProviders";
import { BaseNewsSection } from "@/components/news/section/newsSections/BaseNewsSection";
import type { ArticleInfo } from "@/types/articleTypes";

// ── Mocks: child components ──────────────────────────────────────────

vi.mock("@/components/news/shared/NewsSideColumn", () => ({
	default: () => <div data-testid="news-side-column" />,
}));

vi.mock("@/components/common/layout/SectionHeaderExpandable", () => ({
	SectionHeaderExpandable: ({ title }: { title: string }) => (
		<h2 data-testid="section-header">{title}</h2>
	),
}));

vi.mock("@/components/news/shared/ArticleList", () => ({
	ArticleList: ({ articles }: { articles: ArticleInfo[] }) => (
		<div data-testid="article-list">{articles.length} articles</div>
	),
}));

// ── Mocks: hooks ─────────────────────────────────────────────────────

const mockSetDateRange = vi.fn();
const mockSetSortBy = vi.fn();
const mockUpdateSectionVisibility = vi.fn();

vi.mock("@/hooks/useArticleHooks", () => ({
	useArticleFilters: vi.fn((articles: ArticleInfo[]) => ({
		articlesToDisplay: articles,
		dateRange: "all",
		setDateRange: mockSetDateRange,
		sortBy: "newest",
		setSortBy: mockSetSortBy,
	})),
	useInfiniteScroll: vi.fn(),
}));

vi.mock("@/hooks/usePagination", () => ({
	usePagination: vi.fn(() => ({
		paginatedArticles: [],
		currentPage: 1,
		totalPages: 1,
		pageSize: 5,
		setPageSize: vi.fn(),
		goToPage: vi.fn(),
		hasNextPage: false,
		hasPrevPage: false,
		isLoading: false,
	})),
}));

vi.mock("@/hooks/usePagePagination", () => ({
	usePagePagination: vi.fn(() => false),
}));

vi.mock("@/hooks/useSectionCollapse", () => ({
	useSectionVisible: vi.fn(() => true),
	useAllSectionNotVisible: vi.fn(() => false),
	useSectionCollapse: vi.fn(() => true),
}));

vi.mock("@/contexts/AppSettingContext", () => ({
	useAppSettings: vi.fn(() => ({
		appSetting: {
			homeLayout: {
				visible: {
					newsSection: true,
					editorsSection: true,
					catFactsSection: true,
					staffPicksSection: true,
					popularSection: true,
				},
				expanded: {
					newsSection: true,
					editorsSection: true,
					catFactsSection: true,
					staffPicksSection: true,
					popularSection: true,
				},
				pagePagination: false,
			},
		},
		updateSectionVisibility: mockUpdateSectionVisibility,
		updateSectionExpansion: vi.fn(),
		togglePagination: vi.fn(),
	})),
}));

// Import mocked modules for per-test overrides
import { usePagePagination } from "@/hooks/usePagePagination";
import { useSectionVisible, useAllSectionNotVisible } from "@/hooks/useSectionCollapse";
import { usePagination } from "@/hooks/usePagination";
import { useArticleFilters } from "@/hooks/useArticleHooks";

// ── Setup ────────────────────────────────────────────────────────────

beforeEach(() => {
	vi.resetAllMocks();

	// Restore default hook returns after reset
	vi.mocked(usePagePagination).mockReturnValue(false);
	vi.mocked(useSectionVisible).mockReturnValue(true);
	vi.mocked(useAllSectionNotVisible).mockReturnValue(false);
	vi.mocked(useArticleFilters).mockImplementation((articles: ArticleInfo[]) => ({
		articlesToDisplay: articles,
		dateRange: "all",
		setDateRange: mockSetDateRange,
		sortBy: "newest",
		setSortBy: mockSetSortBy,
	}));
	vi.mocked(usePagination).mockReturnValue({
		paginatedArticles: [],
		currentPage: 1,
		totalPages: 1,
		pageSize: 5,
		totalCount: 0,
		setPageSize: vi.fn(),
		goToPage: vi.fn(),
		hasNextPage: false,
		hasPrevPage: false,
		isLoading: false,
	});
});

const sampleArticles: ArticleInfo[] = [
	{
		id: "base-1",
		title: "Cat Astronaut Returns From Space",
		summary: "Mission accomplished",
		datePublished: "3/26/2026",
		mainCategory: "science",
		subCategory: [],
		viewed: 1000,
		likeCount: 100,
	},
	{
		id: "base-2",
		title: "Catnip Stocks Hit All-Time High",
		summary: "Investors rejoice",
		datePublished: "3/25/2026",
		mainCategory: "business",
		subCategory: [],
		viewed: 800,
		likeCount: 80,
	},
];

const mockLoadMore = vi.fn();

// ── Tests ────────────────────────────────────────────────────────────

describe("BaseNewsSection", () => {
	// ── Basic rendering ──────────────────────────────────────────────

	/** Verifies the section header renders with the "Mews" title. */
	it("renders the section header with Mews title", () => {
		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		expect(screen.getByTestId("section-header")).toHaveTextContent("Mews");
	});

	/** Verifies the FilterBar is rendered with date and sort dropdowns. */
	it("renders the FilterBar with date range and sort options", () => {
		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		expect(screen.getByText("All Time")).toBeInTheDocument();
		expect(screen.getByText("Newest")).toBeInTheDocument();
	});

	/** Verifies articles are passed to the ArticleList. */
	it("renders the article list with articles", () => {
		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		expect(screen.getByTestId("article-list")).toHaveTextContent("2 articles");
	});

	/** Verifies the NewsSideColumn is always rendered. */
	it("renders the NewsSideColumn", () => {
		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		expect(screen.getByTestId("news-side-column")).toBeInTheDocument();
	});

	// ── Infinite scroll mode (default) ───────────────────────────────

	/** In infinite scroll mode, LoadingMessage is shown. */
	it("shows LoadingMessage in infinite scroll mode", () => {
		vi.mocked(usePagePagination).mockReturnValue(false);

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />,
			{
				preloadedState: {
					article: {
						topTenArticles: [],
						homeArticles: [],
						homeArticlesCount: 0,
						articles: [],
						articlesCount: 0,
						articlesDetail: {},
						loading: { homePage: false, topTen: false, articles: true, detail: false },
						error: { homePage: undefined, topTen: undefined, articles: undefined, detail: undefined },
					},
				},
			}
		);

		expect(screen.getByText("Just a few seoncds, articles are coming!")).toBeInTheDocument();
	});

	/** In infinite scroll mode, PaginationControls are NOT shown. */
	it("hides PaginationControls in infinite scroll mode", () => {
		vi.mocked(usePagePagination).mockReturnValue(false);

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		expect(screen.queryByText("Show")).not.toBeInTheDocument();
	});

	/** When not loading in infinite scroll mode, shows end-of-list message. */
	it("shows end-of-list message when not loading", () => {
		vi.mocked(usePagePagination).mockReturnValue(false);

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		expect(screen.getByText("You've scrolled to the end. There's nothing left!")).toBeInTheDocument();
	});

	// ── Pagination mode ──────────────────────────────────────────────

	/** In pagination mode, PaginationControls are rendered. */
	it("shows PaginationControls in pagination mode", () => {
		vi.mocked(usePagePagination).mockReturnValue(true);
		vi.mocked(usePagination).mockReturnValue({
			paginatedArticles: sampleArticles,
			currentPage: 1,
			totalPages: 4,
			pageSize: 5,
			totalCount: 20,
			setPageSize: vi.fn(),
			goToPage: vi.fn(),
			hasNextPage: true,
			hasPrevPage: false,
			isLoading: false,
		});

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		expect(screen.getByText("Show")).toBeInTheDocument();
		expect(screen.getByText("per page")).toBeInTheDocument();
	});

	/** In pagination mode, uses paginatedArticles from usePagination hook. */
	it("displays paginated articles in pagination mode", () => {
		const paginatedArticle: ArticleInfo = {
			id: "pag-1",
			title: "Paginated Cat Story",
			summary: "From pagination",
			datePublished: "3/27/2026",
			mainCategory: "world",
			subCategory: [],
			viewed: 50,
			likeCount: 5,
		};

		vi.mocked(usePagePagination).mockReturnValue(true);
		vi.mocked(usePagination).mockReturnValue({
			paginatedArticles: [paginatedArticle],
			currentPage: 1,
			totalPages: 1,
			pageSize: 5,
			totalCount: 1,
			setPageSize: vi.fn(),
			goToPage: vi.fn(),
			hasNextPage: false,
			hasPrevPage: false,
			isLoading: false,
		});

		// Note: in pagination mode, BaseNewsSection uses paginatedArticles not the articles prop
		vi.mocked(useArticleFilters).mockReturnValue({
			articlesToDisplay: sampleArticles,
			dateRange: "all",
			setDateRange: mockSetDateRange,
			sortBy: "newest",
			setSortBy: mockSetSortBy,
		});

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		// ArticleList mock shows the count of articles passed to it
		expect(screen.getByTestId("article-list")).toHaveTextContent("1 articles");
	});

	/** In pagination mode, shows LoadingMessage only when there's no next page. */
	it("shows LoadingMessage in pagination mode when no next page", () => {
		vi.mocked(usePagePagination).mockReturnValue(true);
		vi.mocked(usePagination).mockReturnValue({
			paginatedArticles: sampleArticles,
			currentPage: 4,
			totalPages: 4,
			pageSize: 5,
			totalCount: 20,
			setPageSize: vi.fn(),
			goToPage: vi.fn(),
			hasNextPage: false,
			hasPrevPage: true,
			isLoading: false,
		});

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		expect(screen.getByText("You've scrolled to the end. There's nothing left!")).toBeInTheDocument();
	});

	/** In pagination mode with more pages, LoadingMessage is NOT shown. */
	it("hides LoadingMessage in pagination mode when there are more pages", () => {
		vi.mocked(usePagePagination).mockReturnValue(true);
		vi.mocked(usePagination).mockReturnValue({
			paginatedArticles: sampleArticles,
			currentPage: 1,
			totalPages: 4,
			pageSize: 5,
			totalCount: 20,
			setPageSize: vi.fn(),
			goToPage: vi.fn(),
			hasNextPage: true,
			hasPrevPage: false,
			isLoading: false,
		});

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		// Neither loading nor end-of-list message should show when hasNextPage is true
		expect(screen.queryByText("Just a few seoncds, articles are coming!")).not.toBeInTheDocument();
		expect(screen.queryByText("You've scrolled to the end. There's nothing left!")).not.toBeInTheDocument();
	});

	// ── Section visibility ───────────────────────────────────────────

	/** When section is hidden and other sections are visible, shows EmptyStateSection. */
	it("shows EmptyStateSection when news section is hidden", () => {
		vi.mocked(useSectionVisible).mockReturnValue(false);
		vi.mocked(useAllSectionNotVisible).mockReturnValue(false);

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		expect(
			screen.getByText("Looks like you removed the Mews section")
		).toBeInTheDocument();
		expect(screen.getByText("Bring It Back")).toBeInTheDocument();
	});

	/** When section is hidden, the main article section has the "hidden" class. */
	it("hides main article section when not visible", () => {
		vi.mocked(useSectionVisible).mockReturnValue(false);
		vi.mocked(useAllSectionNotVisible).mockReturnValue(false);

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		// The article list should still be in DOM but its parent section is hidden
		const articleList = screen.getByTestId("article-list");
		const section = articleList.closest("section");
		expect(section?.className).toContain("hidden");
	});

	/** Clicking "Bring It Back" calls updateSectionVisibility to restore the section. */
	it("calls updateSectionVisibility when 'Bring It Back' is clicked", async () => {
		vi.mocked(useSectionVisible).mockReturnValue(false);
		vi.mocked(useAllSectionNotVisible).mockReturnValue(false);

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		await userEvent.click(screen.getByText("Bring It Back"));

		expect(mockUpdateSectionVisibility).toHaveBeenCalledWith("newsSection", true);
	});

	/** When all sections are hidden, EmptyStateSection is NOT shown (handled by parent). */
	it("hides EmptyStateSection when all sections are hidden", () => {
		vi.mocked(useSectionVisible).mockReturnValue(false);
		vi.mocked(useAllSectionNotVisible).mockReturnValue(true);

		renderWithProviders(
			<BaseNewsSection articles={sampleArticles} totalCount={20} loadMoreArticles={mockLoadMore} />
		);

		// EmptyStateSection renders but its parent div has "hidden" class
		const bringBackButton = screen.getByText("Bring It Back");
		const emptyStateParent = bringBackButton.closest("div.md\\:col-span-2");
		expect(emptyStateParent?.className).toContain("hidden");
	});

	// ── Edge cases ───────────────────────────────────────────────────

	/** Renders without crashing when articles array is empty. */
	it("renders with empty articles array", () => {
		renderWithProviders(
			<BaseNewsSection articles={[]} totalCount={0} loadMoreArticles={mockLoadMore} />
		);

		expect(screen.getByTestId("article-list")).toHaveTextContent("0 articles");
		expect(screen.getByTestId("section-header")).toHaveTextContent("Mews");
	});
});
