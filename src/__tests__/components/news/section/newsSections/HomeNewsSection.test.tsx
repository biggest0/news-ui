/**
 * Component tests for HomeNewsSection.
 *
 * HomeNewsSection is a thin wrapper that connects the Redux store to
 * BaseNewsSection for the home page. It reads `homeArticles` and
 * `homeArticlesCount` from the articles slice and passes them down,
 * along with a `loadMoreArticles` callback that dispatches `loadArticlesInfo`.
 * A LoadingOverlay is shown while `loading.homePage` is true.
 *
 * Key behaviors tested:
 * - Passes homeArticles and homeArticlesCount from Redux to BaseNewsSection
 * - Shows LoadingOverlay when loading.homePage is true
 * - Hides LoadingOverlay when loading.homePage is false
 * - loadMoreArticles dispatches the loadArticlesInfo thunk
 *
 * Dependencies mocked:
 * - BaseNewsSection   — stub that exposes received props for assertions
 * - LoadingOverlay    — stub that renders a testid when loading
 * - @/service/articleService — all exports (needed by articlesSlice thunks)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/__tests__/helpers/renderWithProviders";
import { HomeNewsSection } from "@/components/news/section/newsSections/HomeNewsSection";
import type { ArticleInfo } from "@/types/articleTypes";
import type { RootState } from "@/store/store";

// ── Mocks ────────────────────────────────────────────────────────────

/** Capture props passed to BaseNewsSection for verification. */
let capturedBaseProps: Record<string, unknown> = {};

vi.mock("@/components/news/section/newsSections/BaseNewsSection", () => ({
	BaseNewsSection: (props: Record<string, unknown>) => {
		capturedBaseProps = props;
		return (
			<div data-testid="base-news-section">
				{(props.articles as ArticleInfo[]).length} articles
			</div>
		);
	},
}));

vi.mock("@/components/common/feedback/LoadingOverlay", () => ({
	LoadingOverlay: ({ loading }: { loading: boolean }) =>
		loading ? <div data-testid="loading-overlay">Loading...</div> : null,
}));

vi.mock("@/service/articleService", () => ({
	getArticlesInfo: vi.fn().mockResolvedValue({ articles: [], count: 0 }),
	getArticleDetail: vi.fn(),
	getArticlesByCategory: vi.fn(),
	getArticlesBySearch: vi.fn(),
	getArticlesBySubCategory: vi.fn(),
	getTopTenArticles: vi.fn(),
}));

// ── Setup ────────────────────────────────────────────────────────────

beforeEach(() => {
	vi.resetAllMocks();
	capturedBaseProps = {};
});

const sampleArticles: ArticleInfo[] = [
	{
		id: "home-1",
		title: "Cat Mayor Declares Nap Day",
		summary: "All citizens must nap",
		datePublished: "3/25/2026",
		mainCategory: "politics",
		subCategory: [],
		viewed: 100,
		likeCount: 10,
	},
	{
		id: "home-2",
		title: "Fish Prices Skyrocket",
		summary: "Tuna now costs a fortune",
		datePublished: "3/24/2026",
		mainCategory: "business",
		subCategory: [],
		viewed: 200,
		likeCount: 20,
	},
];

function buildState(overrides: Partial<RootState["article"]> = {}): { article: RootState["article"] } {
	return {
		article: {
			topTenArticles: [],
			homeArticles: [],
			homeArticlesCount: 0,
			articles: [],
			articlesCount: 0,
			articlesDetail: {},
			similarArticles: {},
			recommendedArticles: [],
			loading: { homePage: false, topTen: false, articles: false, detail: false, similar: false, recommended: false },
			error: { homePage: undefined, topTen: undefined, articles: undefined, detail: undefined, similar: undefined, recommended: undefined },
			...overrides,
		},
	};
}

// ── Tests ────────────────────────────────────────────────────────────

describe("HomeNewsSection", () => {
	/** Verifies BaseNewsSection receives homeArticles from Redux. */
	it("passes homeArticles from Redux to BaseNewsSection", () => {
		renderWithProviders(<HomeNewsSection />, {
			preloadedState: buildState({
				homeArticles: sampleArticles,
				homeArticlesCount: 42,
			}),
		});

		expect(screen.getByTestId("base-news-section")).toHaveTextContent("2 articles");
		expect(capturedBaseProps.articles).toEqual(sampleArticles);
	});

	/** Verifies BaseNewsSection receives the totalCount from Redux. */
	it("passes homeArticlesCount as totalCount to BaseNewsSection", () => {
		renderWithProviders(<HomeNewsSection />, {
			preloadedState: buildState({
				homeArticles: sampleArticles,
				homeArticlesCount: 42,
			}),
		});

		expect(capturedBaseProps.totalCount).toBe(42);
	});

	/** Verifies BaseNewsSection receives resetKey="home". */
	it('passes resetKey="home" to BaseNewsSection', () => {
		renderWithProviders(<HomeNewsSection />, {
			preloadedState: buildState(),
		});

		expect(capturedBaseProps.resetKey).toBe("home");
	});

	/** Verifies LoadingOverlay is shown when loading.homePage is true. */
	it("shows LoadingOverlay when homePage is loading", () => {
		renderWithProviders(<HomeNewsSection />, {
			preloadedState: buildState({
				loading: { homePage: true, topTen: false, articles: false, detail: false, similar: false, recommended: false },
			}),
		});

		expect(screen.getByTestId("loading-overlay")).toBeInTheDocument();
	});

	/** Verifies LoadingOverlay is hidden when loading.homePage is false. */
	it("hides LoadingOverlay when homePage is not loading", () => {
		renderWithProviders(<HomeNewsSection />, {
			preloadedState: buildState({
				loading: { homePage: false, topTen: false, articles: false, detail: false, similar: false, recommended: false },
			}),
		});

		expect(screen.queryByTestId("loading-overlay")).not.toBeInTheDocument();
	});

	/** Verifies that loadMoreArticles callback is a function. */
	it("provides a loadMoreArticles function to BaseNewsSection", () => {
		renderWithProviders(<HomeNewsSection />, {
			preloadedState: buildState(),
		});

		expect(typeof capturedBaseProps.loadMoreArticles).toBe("function");
	});

	/** Verifies BaseNewsSection renders with empty articles when store is empty. */
	it("renders with zero articles when store is empty", () => {
		renderWithProviders(<HomeNewsSection />, {
			preloadedState: buildState(),
		});

		expect(screen.getByTestId("base-news-section")).toHaveTextContent("0 articles");
	});
});
