/**
 * Component tests for BaseNewsSection (RTK Query consumer since M5).
 *
 * BaseNewsSection is the core article listing component shared by
 * HomeNewsSection and CategoryNewsSection. It orchestrates:
 * - The articles infinite query (scroll mode) / usePagination (page mode)
 * - Infinite scroll driving (useListInfiniteScroll)
 * - Section visibility and collapse (useSectionVisible, CollapsibleSection)
 * - Empty state with a "Bring It Back" reset button
 * - Inline error state with retry (SectionErrorMessage)
 *
 * Dependencies mocked:
 * - @/store/api/articleEndpoints   — useGetArticlesInfiniteQuery
 * - @/hooks/useArticleHooks        — useListInfiniteScroll
 * - @/hooks/usePagination          — usePagination
 * - @/hooks/usePagePagination      — usePagePagination
 * - @/hooks/useSectionCollapse     — useSectionVisible, useAllSectionNotVisible, useSectionCollapse
 * - @/contexts/AppSettingContext   — useAppSettings
 * - child components (side column, header, article list) — stubs
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

// ── Mocks: data hooks ────────────────────────────────────────────────

const mockUpdateSectionVisibility = vi.fn();
const mockFetchNextPage = vi.fn();
const mockRefetch = vi.fn();

/** Builds a useGetArticlesInfiniteQuery return value for a page of articles. */
function infiniteQueryResult(
	articles: ArticleInfo[],
	overrides: Record<string, unknown> = {}
) {
	return {
		data: { pages: [{ articles, count: articles.length }], pageParams: [1] },
		isLoading: false,
		isFetching: false,
		isError: false,
		refetch: mockRefetch,
		hasNextPage: false,
		fetchNextPage: mockFetchNextPage,
		...overrides,
	};
}

vi.mock("@/store/api/articleEndpoints", () => ({
	useGetArticlesInfiniteQuery: vi.fn(),
}));

vi.mock("@/hooks/useArticleHooks", () => ({
	useListInfiniteScroll: vi.fn(),
}));

vi.mock("@/hooks/usePagination", () => ({
	usePagination: vi.fn(),
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
		updateSectionVisibility: mockUpdateSectionVisibility,
		updateSectionExpansion: vi.fn(),
		togglePagination: vi.fn(),
	})),
}));

// Import mocked modules for per-test overrides
import { useGetArticlesInfiniteQuery } from "@/store/api/articleEndpoints";
import { usePagePagination } from "@/hooks/usePagePagination";
import { useSectionVisible, useAllSectionNotVisible } from "@/hooks/useSectionCollapse";
import { usePagination } from "@/hooks/usePagination";

const defaultPagination = () => ({
	paginatedArticles: [] as ArticleInfo[],
	currentPage: 1,
	totalPages: 1,
	pageSize: 5 as const,
	totalCount: 0,
	setPageSize: vi.fn(),
	goToPage: vi.fn(),
	hasNextPage: false,
	hasPrevPage: false,
	isLoading: false,
	isError: false,
	refetchPage: vi.fn(),
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

beforeEach(() => {
	vi.resetAllMocks();

	// Restore default hook returns after reset
	vi.mocked(usePagePagination).mockReturnValue(false);
	vi.mocked(useSectionVisible).mockReturnValue(true);
	vi.mocked(useAllSectionNotVisible).mockReturnValue(false);
	vi.mocked(useGetArticlesInfiniteQuery).mockReturnValue(
		infiniteQueryResult(sampleArticles) as never
	);
	vi.mocked(usePagination).mockReturnValue(defaultPagination());
});

// ── Tests ────────────────────────────────────────────────────────────

describe("BaseNewsSection", () => {
	// ── Basic rendering ──────────────────────────────────────────────

	/** Verifies the section header renders with the "Mews" title. */
	it("renders the section header with Mews title", () => {
		renderWithProviders(<BaseNewsSection />);

		expect(screen.getByTestId("section-header")).toHaveTextContent("Mews");
	});

	/** Verifies the FilterBar is rendered with date and sort dropdowns. */
	it("renders the FilterBar with date range and sort options", () => {
		renderWithProviders(<BaseNewsSection />);

		expect(screen.getByText("Any Time")).toBeInTheDocument();
		expect(screen.getByText("Newest")).toBeInTheDocument();
	});

	/** Verifies flattened query pages reach the ArticleList. */
	it("renders the article list with articles from the infinite query", () => {
		renderWithProviders(<BaseNewsSection />);

		expect(screen.getByTestId("article-list")).toHaveTextContent("2 articles");
	});

	/** Verifies the NewsSideColumn is always rendered. */
	it("renders the NewsSideColumn", () => {
		renderWithProviders(<BaseNewsSection />);

		expect(screen.getByTestId("news-side-column")).toBeInTheDocument();
	});

	// ── Infinite scroll mode (default) ───────────────────────────────

	/** While a page request is in flight, LoadingMessage shows the loading text. */
	it("shows LoadingMessage while fetching in infinite scroll mode", () => {
		vi.mocked(useGetArticlesInfiniteQuery).mockReturnValue(
			infiniteQueryResult(sampleArticles, { isFetching: true }) as never
		);

		renderWithProviders(<BaseNewsSection />);

		expect(screen.getByText("Just a few seconds, articles are coming!")).toBeInTheDocument();
	});

	/** In infinite scroll mode, PaginationControls are NOT shown. */
	it("hides PaginationControls in infinite scroll mode", () => {
		renderWithProviders(<BaseNewsSection />);

		expect(screen.queryByText("Show")).not.toBeInTheDocument();
	});

	/** When not fetching in infinite scroll mode, shows end-of-list message. */
	it("shows end-of-list message when not fetching", () => {
		renderWithProviders(<BaseNewsSection />);

		expect(screen.getByText("You've scrolled to the end. There's nothing left!")).toBeInTheDocument();
	});

	/** A failed load renders the inline error with a retry action. */
	it("shows the inline error message with retry on query failure", async () => {
		vi.mocked(useGetArticlesInfiniteQuery).mockReturnValue(
			infiniteQueryResult([], { isError: true }) as never
		);

		renderWithProviders(<BaseNewsSection />);

		await userEvent.click(screen.getByText("Try again"));
		expect(mockRefetch).toHaveBeenCalled();
	});

	// ── Pagination mode ──────────────────────────────────────────────

	/** In pagination mode, PaginationControls are rendered. */
	it("shows PaginationControls in pagination mode", () => {
		vi.mocked(usePagePagination).mockReturnValue(true);
		vi.mocked(usePagination).mockReturnValue({
			...defaultPagination(),
			paginatedArticles: sampleArticles,
			totalPages: 4,
			totalCount: 20,
			hasNextPage: true,
		});

		renderWithProviders(<BaseNewsSection />);

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
			...defaultPagination(),
			paginatedArticles: [paginatedArticle],
			totalCount: 1,
		});

		renderWithProviders(<BaseNewsSection />);

		// ArticleList mock shows the count of articles passed to it
		expect(screen.getByTestId("article-list")).toHaveTextContent("1 articles");
	});

	/** In pagination mode with more pages, LoadingMessage is NOT shown. */
	it("hides LoadingMessage in pagination mode when there are more pages", () => {
		vi.mocked(usePagePagination).mockReturnValue(true);
		vi.mocked(usePagination).mockReturnValue({
			...defaultPagination(),
			paginatedArticles: sampleArticles,
			totalPages: 4,
			totalCount: 20,
			hasNextPage: true,
		});

		renderWithProviders(<BaseNewsSection />);

		expect(screen.queryByText("Just a few seoncds, articles are coming!")).not.toBeInTheDocument();
		expect(screen.queryByText("You've scrolled to the end. There's nothing left!")).not.toBeInTheDocument();
	});

	// ── Section visibility ───────────────────────────────────────────

	/** When section is hidden and other sections are visible, shows EmptyStateSection. */
	it("shows EmptyStateSection when news section is hidden", () => {
		vi.mocked(useSectionVisible).mockReturnValue(false);
		vi.mocked(useAllSectionNotVisible).mockReturnValue(false);

		renderWithProviders(<BaseNewsSection />);

		expect(
			screen.getByText("Looks like you removed the Mews section")
		).toBeInTheDocument();
		expect(screen.getByText("Bring It Back")).toBeInTheDocument();
	});

	/** When section is hidden, the main article section has the "hidden" class. */
	it("hides main article section when not visible", () => {
		vi.mocked(useSectionVisible).mockReturnValue(false);
		vi.mocked(useAllSectionNotVisible).mockReturnValue(false);

		renderWithProviders(<BaseNewsSection />);

		const articleList = screen.getByTestId("article-list");
		const section = articleList.closest("section");
		expect(section?.className).toContain("hidden");
	});

	/** Clicking "Bring It Back" calls updateSectionVisibility to restore the section. */
	it("calls updateSectionVisibility when 'Bring It Back' is clicked", async () => {
		vi.mocked(useSectionVisible).mockReturnValue(false);
		vi.mocked(useAllSectionNotVisible).mockReturnValue(false);

		renderWithProviders(<BaseNewsSection />);

		await userEvent.click(screen.getByText("Bring It Back"));

		expect(mockUpdateSectionVisibility).toHaveBeenCalledWith("newsSection", true);
	});

	/** When all sections are hidden, EmptyStateSection is NOT shown (handled by parent). */
	it("hides EmptyStateSection when all sections are hidden", () => {
		vi.mocked(useSectionVisible).mockReturnValue(false);
		vi.mocked(useAllSectionNotVisible).mockReturnValue(true);

		renderWithProviders(<BaseNewsSection />);

		const bringBackButton = screen.getByText("Bring It Back");
		const emptyStateParent = bringBackButton.closest("div.md\\:col-span-2");
		expect(emptyStateParent?.className).toContain("hidden");
	});

	// ── Edge cases ───────────────────────────────────────────────────

	/** Renders without crashing when the query has no articles. */
	it("renders with an empty result set", () => {
		vi.mocked(useGetArticlesInfiniteQuery).mockReturnValue(
			infiniteQueryResult([]) as never
		);

		renderWithProviders(<BaseNewsSection />);

		expect(screen.getByTestId("article-list")).toHaveTextContent("0 articles");
		expect(screen.getByTestId("section-header")).toHaveTextContent("Mews");
	});
});
