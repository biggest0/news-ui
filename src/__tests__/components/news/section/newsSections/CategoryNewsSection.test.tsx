/**
 * Component tests for CategoryNewsSection.
 *
 * CategoryNewsSection reads the current category from the URL pathname,
 * filters Redux articles by `mainCategory`, and passes the filtered list
 * to BaseNewsSection. Its `loadMoreArticles` callback dispatches
 * `loadArticlesInfoByCategory` with the URL-derived category.
 *
 * Key behaviors tested:
 * - Filters articles by the URL category before passing to BaseNewsSection
 * - Passes articlesCount as totalCount
 * - Uses the URL category as resetKey
 * - loadMoreArticles is a function passed to BaseNewsSection
 * - Only articles matching the current category are forwarded
 *
 * Dependencies mocked:
 * - BaseNewsSection             — stub that exposes received props
 * - @/service/articleService    — all exports (needed by articlesSlice thunks)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/__tests__/helpers/renderWithProviders";
import { CategoryNewsSection } from "@/components/news/section/newsSections/CategoryNewsSection";
import type { ArticleInfo } from "@/types/articleTypes";
import type { RootState } from "@/store/store";

// ── Mocks ────────────────────────────────────────────────────────────

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

vi.mock("@/service/articleService", () => ({
	getArticlesInfo: vi.fn().mockResolvedValue({ articles: [], count: 0 }),
	getArticleDetail: vi.fn(),
	getArticlesByCategory: vi.fn().mockResolvedValue({ articles: [], count: 0 }),
	getArticlesBySearch: vi.fn(),
	getArticlesBySubCategory: vi.fn(),
	getTopTenArticles: vi.fn(),
}));

// ── Setup ────────────────────────────────────────────────────────────

beforeEach(() => {
	vi.resetAllMocks();
	capturedBaseProps = {};
});

const politicsArticle: ArticleInfo = {
	id: "cat-1",
	title: "Cat Mayor Wins Re-election",
	summary: "Landslide victory",
	datePublished: "3/25/2026",
	mainCategory: "politics",
	subCategory: [],
	viewed: 500,
	likeCount: 50,
};

const scienceArticle: ArticleInfo = {
	id: "cat-2",
	title: "Cats Discover Gravity Is Optional",
	summary: "Physicists baffled",
	datePublished: "3/24/2026",
	mainCategory: "science",
	subCategory: [],
	viewed: 300,
	likeCount: 30,
};

const anotherPoliticsArticle: ArticleInfo = {
	id: "cat-3",
	title: "Parliament Introduces Mandatory Naps",
	summary: "New legislation",
	datePublished: "3/23/2026",
	mainCategory: "politics",
	subCategory: [],
	viewed: 400,
	likeCount: 40,
};

function buildState(overrides: Partial<RootState["article"]> = {}): { article: RootState["article"] } {
	return {
		article: {
			topTenArticles: [],
			homeArticles: [],
			homeArticlesCount: 0,
			articles: [],
			articlesCount: 0,
			articlesDetail: {},
			loading: { homePage: false, topTen: false, articles: false, detail: false },
			error: { homePage: undefined, topTen: undefined, articles: undefined, detail: undefined },
			...overrides,
		},
	};
}

// ── Tests ────────────────────────────────────────────────────────────

describe("CategoryNewsSection", () => {
	/** Verifies only articles matching the URL category are passed to BaseNewsSection. */
	it("filters articles by URL category", async () => {
		renderWithProviders(<CategoryNewsSection />, {
			route: "/politics",
			preloadedState: buildState({
				articles: [politicsArticle, scienceArticle, anotherPoliticsArticle],
				articlesCount: 3,
			}),
		});

		// The useEffect filter runs asynchronously after render
		// Wait for the filtered articles to appear
		await screen.findByText("2 articles");

		const passedArticles = capturedBaseProps.articles as ArticleInfo[];
		expect(passedArticles).toHaveLength(2);
		expect(passedArticles.every((a) => a.mainCategory === "politics")).toBe(true);
	});

	/** Verifies articlesCount from Redux is passed as totalCount. */
	it("passes articlesCount as totalCount", () => {
		renderWithProviders(<CategoryNewsSection />, {
			route: "/science",
			preloadedState: buildState({
				articles: [scienceArticle],
				articlesCount: 25,
			}),
		});

		expect(capturedBaseProps.totalCount).toBe(25);
	});

	/** Verifies the URL category is used as the resetKey for BaseNewsSection. */
	it("uses URL category as resetKey", () => {
		renderWithProviders(<CategoryNewsSection />, {
			route: "/technology",
			preloadedState: buildState(),
		});

		expect(capturedBaseProps.resetKey).toBe("technology");
	});

	/** Verifies loadMoreArticles is a function passed to BaseNewsSection. */
	it("provides loadMoreArticles function to BaseNewsSection", () => {
		renderWithProviders(<CategoryNewsSection />, {
			route: "/politics",
			preloadedState: buildState(),
		});

		expect(typeof capturedBaseProps.loadMoreArticles).toBe("function");
	});

	/** Verifies that when no articles match the category, an empty array is passed. */
	it("passes empty array when no articles match category", async () => {
		renderWithProviders(<CategoryNewsSection />, {
			route: "/lifestyle",
			preloadedState: buildState({
				articles: [politicsArticle, scienceArticle],
				articlesCount: 2,
			}),
		});

		// Initially shows the unfiltered articles, then useEffect filters them
		await screen.findByText("0 articles");

		const passedArticles = capturedBaseProps.articles as ArticleInfo[];
		expect(passedArticles).toHaveLength(0);
	});

	/** Verifies all articles are shown when they all match the category. */
	it("passes all articles when all match the category", async () => {
		renderWithProviders(<CategoryNewsSection />, {
			route: "/politics",
			preloadedState: buildState({
				articles: [politicsArticle, anotherPoliticsArticle],
				articlesCount: 2,
			}),
		});

		await screen.findByText("2 articles");

		const passedArticles = capturedBaseProps.articles as ArticleInfo[];
		expect(passedArticles).toHaveLength(2);
	});
});
