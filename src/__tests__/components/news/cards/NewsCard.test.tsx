/**
 * Component tests for NewsCard.
 *
 * NewsCard is the main expandable article card used throughout the app.
 * It renders title, date, category, and summary in collapsed state, and
 * fetches + displays full article paragraphs when expanded via "Read More".
 *
 * Key behaviors tested:
 * - Collapsed state: title, date, category, summary, "Read More" label
 * - Expand/collapse toggle via "Read More" / "Hide"
 * - Article detail is fetched from Redux on first expand
 * - View count is incremented and read is recorded on first expand
 * - LikeButton and ShareButton are rendered
 * - Category capitalization via capitalizeWord
 *
 * Dependencies mocked:
 * - @/contexts/AuthContext         — controls accessToken per test
 * - @/api/articleApi               — spies on incrementArticleViewed
 * - @/service/userArticleService   — spies on recordArticleRead; stubs getArticleLikeStatus
 * - @/store/articlesSlice          — spies on loadArticleDetail thunk
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/__tests__/helpers/renderWithProviders";
import NewsCard from "@/components/news/cards/NewsCard";
import type { ArticleInfo, ArticleDetail } from "@/types/articleTypes";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("@/contexts/AuthContext", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/api/articleApi", () => ({
	incrementArticleViewed: vi.fn(),
}));

vi.mock("@/service/articleService", () => ({
	getArticleDetail: vi.fn(),
	getArticlesByCategory: vi.fn(),
	getArticlesBySearch: vi.fn(),
	getArticlesBySubCategory: vi.fn(),
	getArticlesInfo: vi.fn(),
	getTopTenArticles: vi.fn(),
}));

vi.mock("@/service/userArticleService", () => ({
	recordArticleRead: vi.fn(),
	toggleArticleLike: vi.fn(),
	getArticleLikeStatus: vi.fn().mockResolvedValue({ liked: false, likeCount: 0 }),
}));

import { useAuth } from "@/contexts/AuthContext";
import { incrementArticleViewed } from "@/api/articleApi";
import {
	recordArticleRead,
	getArticleLikeStatus,
} from "@/service/userArticleService";
import { getArticleDetail } from "@/service/articleService";

// ── Setup ────────────────────────────────────────────────────────────

beforeEach(() => {
	vi.resetAllMocks();
	// Re-stub after reset since getArticleLikeStatus is called on mount by LikeButton
	vi.mocked(getArticleLikeStatus).mockResolvedValue({ liked: false, likeCount: 0 });
});

function setAuth(isAuthenticated: boolean) {
	vi.mocked(useAuth).mockReturnValue({
		user: null,
		isAuthenticated,
		isLoading: false,
		login: vi.fn(),
		register: vi.fn(),
		logout: vi.fn(),
		loginWithGoogle: vi.fn(),
	});
}

const sampleArticle: ArticleInfo = {
	id: "card-1",
	title: "Cat Takes Over Parliament",
	summary: "A tabby named Lord Whiskers seized control",
	datePublished: "3/20/2026",
	mainCategory: "politics",
	subCategory: ["government", "cats"],
	viewed: 1234,
	likeCount: 5,
};

const sampleDetail: ArticleDetail = {
	id: "card-1",
	title: "Cat Takes Over Parliament",
	summary: "A tabby named Lord Whiskers seized control",
	datePublished: "3/20/2026",
	mainCategory: "politics",
	subCategory: ["government", "cats"],
	paragraphs: ["Lord Whiskers entered the chamber.", "Parliament was stunned."],
	source: "Catire Press",
	url: "https://example.com/card-1",
};

// ── Tests ────────────────────────────────────────────────────────────

describe("NewsCard", () => {
	// ── Collapsed state rendering ────────────────────────────────────

	/** Verifies the article title is rendered. */
	it("renders the article title", () => {
		setAuth(false);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />);

		expect(screen.getByText("Cat Takes Over Parliament")).toBeInTheDocument();
	});

	/** Verifies the published date is displayed. */
	it("renders the published date", () => {
		setAuth(false);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />);

		expect(screen.getByText("3/20/2026")).toBeInTheDocument();
	});

	/** Verifies the category is capitalized via capitalizeWord. */
	it("renders the category capitalized", () => {
		setAuth(false);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />);

		expect(screen.getByText("Politics")).toBeInTheDocument();
	});

	/** Verifies the summary is visible when the card is collapsed. */
	it("shows the summary in collapsed state", () => {
		setAuth(false);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />);

		expect(
			screen.getByText("A tabby named Lord Whiskers seized control")
		).toBeInTheDocument();
	});

	/** Verifies the "Read More" toggle is shown initially. */
	it("shows 'Read More' label when collapsed", () => {
		setAuth(false);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />);

		expect(screen.getByText("Read More")).toBeInTheDocument();
	});

	/** Verifies the LikeButton component is present. */
	it("renders the LikeButton", () => {
		setAuth(false);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />);

		// LikeButton renders a button element
		const buttons = screen.getAllByRole("button");
		expect(buttons.length).toBeGreaterThanOrEqual(1);
	});

	// ── Expand / Collapse ────────────────────────────────────────────

	/** Clicking "Read More" toggles the label to "Hide". */
	it("toggles to 'Hide' label when expanded", async () => {
		setAuth(false);
		vi.mocked(getArticleDetail).mockResolvedValue(sampleDetail);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />, {
			preloadedState: {
				article: {
					topTenArticles: [],
					homeArticles: [],
					homeArticlesCount: 0,
					articles: [],
					articlesCount: 0,
					articlesDetail: { "card-1": sampleDetail },
					loading: { homePage: false, topTen: false, articles: false, detail: false },
					error: { homePage: undefined, topTen: undefined, articles: undefined, detail: undefined },
				},
			},
		});

		await userEvent.click(screen.getByText("Read More"));

		expect(screen.getByText("Hide")).toBeInTheDocument();
	});

	/** When expanded with preloaded detail, the article paragraphs are rendered. */
	it("displays article paragraphs when expanded with cached detail", async () => {
		setAuth(false);
		vi.mocked(getArticleDetail).mockResolvedValue(sampleDetail);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />, {
			preloadedState: {
				article: {
					topTenArticles: [],
					homeArticles: [],
					homeArticlesCount: 0,
					articles: [],
					articlesCount: 0,
					articlesDetail: { "card-1": sampleDetail },
					loading: { homePage: false, topTen: false, articles: false, detail: false },
					error: { homePage: undefined, topTen: undefined, articles: undefined, detail: undefined },
				},
			},
		});

		await userEvent.click(screen.getByText("Read More"));

		expect(await screen.findByText("Lord Whiskers entered the chamber.")).toBeInTheDocument();
		expect(screen.getByText("Parliament was stunned.")).toBeInTheDocument();
	});

	/** When expanded with cached detail, subcategory links are rendered. */
	it("displays subcategory links when expanded", async () => {
		setAuth(false);
		vi.mocked(getArticleDetail).mockResolvedValue(sampleDetail);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />, {
			preloadedState: {
				article: {
					topTenArticles: [],
					homeArticles: [],
					homeArticlesCount: 0,
					articles: [],
					articlesCount: 0,
					articlesDetail: { "card-1": sampleDetail },
					loading: { homePage: false, topTen: false, articles: false, detail: false },
					error: { homePage: undefined, topTen: undefined, articles: undefined, detail: undefined },
				},
			},
		});

		await userEvent.click(screen.getByText("Read More"));

		const govLink = await screen.findByRole("link", { name: "government" });
		expect(govLink).toHaveAttribute("href", "/subcategory/government");

		const catsLink = screen.getByRole("link", { name: "cats" });
		expect(catsLink).toHaveAttribute("href", "/subcategory/cats");
	});

	/** Clicking "Hide" after expanding collapses back and shows "Read More". */
	it("collapses back to 'Read More' on second click", async () => {
		setAuth(false);
		vi.mocked(getArticleDetail).mockResolvedValue(sampleDetail);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />, {
			preloadedState: {
				article: {
					topTenArticles: [],
					homeArticles: [],
					homeArticlesCount: 0,
					articles: [],
					articlesCount: 0,
					articlesDetail: { "card-1": sampleDetail },
					loading: { homePage: false, topTen: false, articles: false, detail: false },
					error: { homePage: undefined, topTen: undefined, articles: undefined, detail: undefined },
				},
			},
		});

		await userEvent.click(screen.getByText("Read More"));
		await userEvent.click(screen.getByText("Hide"));

		expect(screen.getByText("Read More")).toBeInTheDocument();
	});

	// ── Side effects on expand ───────────────────────────────────────

	/** Expanding the card increments the article view counter (fire-and-forget). */
	it("increments view count on first expand", async () => {
		setAuth(false);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />);

		await userEvent.click(screen.getByText("Read More"));

		await waitFor(() => {
			expect(incrementArticleViewed).toHaveBeenCalledWith("card-1");
		});
	});

	/** When authenticated, expanding records the read in the user's history. */
	it("records article read on expand when authenticated", async () => {
		setAuth(true);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />);

		await userEvent.click(screen.getByText("Read More"));

		await waitFor(() => {
			expect(recordArticleRead).toHaveBeenCalledWith("card-1");
		});
	});

	/** When unauthenticated, expanding does NOT record a read. */
	it("does not record article read when unauthenticated", async () => {
		setAuth(false);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />);

		await userEvent.click(screen.getByText("Read More"));

		await waitFor(() => {
			expect(incrementArticleViewed).toHaveBeenCalled();
		});
		expect(recordArticleRead).not.toHaveBeenCalled();
	});

	/** Expanding a second time does NOT re-trigger view increment or read recording. */
	it("does not re-fetch or re-record on subsequent expand/collapse cycles", async () => {
		setAuth(true);
		vi.mocked(getArticleDetail).mockResolvedValue(sampleDetail);
		renderWithProviders(<NewsCard articleInfo={sampleArticle} />, {
			preloadedState: {
				article: {
					topTenArticles: [],
					homeArticles: [],
					homeArticlesCount: 0,
					articles: [],
					articlesCount: 0,
					articlesDetail: { "card-1": sampleDetail },
					loading: { homePage: false, topTen: false, articles: false, detail: false },
					error: { homePage: undefined, topTen: undefined, articles: undefined, detail: undefined },
				},
			},
		});

		// First expand — triggers side effects
		await userEvent.click(screen.getByText("Read More"));
		await waitFor(() => {
			expect(incrementArticleViewed).toHaveBeenCalledTimes(1);
		});

		// Collapse and expand again — should NOT re-trigger
		await userEvent.click(screen.getByText("Hide"));
		await userEvent.click(screen.getByText("Read More"));

		expect(incrementArticleViewed).toHaveBeenCalledTimes(1);
		expect(recordArticleRead).toHaveBeenCalledTimes(1);
	});

	// ── Edge cases ───────────────────────────────────────────────────

	/** Handles articles with no summary. */
	it("renders without crashing when summary is undefined", () => {
		setAuth(false);
		const noSummary = { ...sampleArticle, summary: undefined };
		renderWithProviders(<NewsCard articleInfo={noSummary} />);

		expect(screen.getByText("Cat Takes Over Parliament")).toBeInTheDocument();
	});

	/** Handles articles with undefined mainCategory. */
	it("renders without crashing when mainCategory is undefined", () => {
		setAuth(false);
		const noCategory = { ...sampleArticle, mainCategory: undefined };
		renderWithProviders(<NewsCard articleInfo={noCategory} />);

		expect(screen.getByText("Cat Takes Over Parliament")).toBeInTheDocument();
	});
});
