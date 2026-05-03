/**
 * Component tests for NewsHeroCard.
 *
 * NewsHeroCard renders an article title as a link to its detail page.
 * It has two modes controlled by the `small` prop:
 * - small=false (hero):  larger title + summary
 * - small=true  (compact): smaller title + date, no summary
 *
 * On click it fire-and-forgets a view increment and, if authenticated,
 * records the read in the user's history.
 *
 * Dependencies mocked:
 * - @/contexts/AuthContext  — controls accessToken per test
 * - @/api/articleApi        — spies on incrementArticleViewed
 * - @/service/userArticleService — spies on recordArticleRead
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/__tests__/helpers/renderWithProviders";
import NewsHeroCard from "@/components/news/cards/NewsHeroCard";
import type { ArticleInfo } from "@/types/articleTypes";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("@/contexts/AuthContext", () => ({
	useAuth: vi.fn(),
}));

vi.mock("@/api/articleApi", () => ({
	incrementArticleViewed: vi.fn(),
}));

vi.mock("@/service/userArticleService", () => ({
	recordArticleRead: vi.fn(),
}));

import { useAuth } from "@/contexts/AuthContext";
import { incrementArticleViewed } from "@/api/articleApi";
import { recordArticleRead } from "@/service/userArticleService";

// ── Setup ────────────────────────────────────────────────────────────

beforeEach(() => {
	vi.resetAllMocks();
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
	id: "hero-1",
	title: "Cat Economy Booms",
	summary: "Feline GDP hits record highs",
	datePublished: "3/20/2026",
	mainCategory: "business",
	subCategory: ["economy"],
	viewed: 999,
	likeCount: 42,
};

// ── Tests ────────────────────────────────────────────────────────────

describe("NewsHeroCard", () => {
	// ── Rendering ────────────────────────────────────────────────────

	/** Verifies the article title is rendered and links to /article/:id. */
	it("renders the title as a link to the article detail page", () => {
		setAuth(false);
		renderWithProviders(
			<NewsHeroCard articleInfo={sampleArticle} small={false} />
		);

		const link = screen.getByRole("link", { name: "Cat Economy Booms" });
		expect(link).toHaveAttribute("href", "/article/hero-1");
	});

	/** In hero mode (small=false), the summary is displayed. */
	it("shows the summary in hero mode (small=false)", () => {
		setAuth(false);
		renderWithProviders(
			<NewsHeroCard articleInfo={sampleArticle} small={false} />
		);

		expect(screen.getByText("Feline GDP hits record highs")).toBeInTheDocument();
	});

	/** In hero mode, the date is NOT shown. */
	it("does not show the date in hero mode", () => {
		setAuth(false);
		renderWithProviders(
			<NewsHeroCard articleInfo={sampleArticle} small={false} />
		);

		expect(screen.queryByText("3/20/2026")).not.toBeInTheDocument();
	});

	/** In compact mode (small=true), the date is shown instead of the summary. */
	it("shows the date in compact mode (small=true)", () => {
		setAuth(false);
		renderWithProviders(
			<NewsHeroCard articleInfo={sampleArticle} small={true} />
		);

		expect(screen.getByText("3/20/2026")).toBeInTheDocument();
	});

	/** In compact mode, the summary is NOT rendered. */
	it("does not show the summary in compact mode", () => {
		setAuth(false);
		renderWithProviders(
			<NewsHeroCard articleInfo={sampleArticle} small={true} />
		);

		expect(screen.queryByText("Feline GDP hits record highs")).not.toBeInTheDocument();
	});

	/** When the article has no summary, nothing extra is shown in hero mode. */
	it("handles missing summary gracefully in hero mode", () => {
		setAuth(false);
		const noSummary = { ...sampleArticle, summary: undefined };
		renderWithProviders(
			<NewsHeroCard articleInfo={noSummary} small={false} />
		);

		// Title should still render, no crash
		expect(screen.getByText("Cat Economy Booms")).toBeInTheDocument();
	});

	// ── Click behavior ───────────────────────────────────────────────

	/** Click always fires incrementArticleViewed, even when unauthenticated. */
	it("increments view count on click (unauthenticated)", async () => {
		setAuth(false);
		renderWithProviders(
			<NewsHeroCard articleInfo={sampleArticle} small={false} />
		);

		await userEvent.click(screen.getByRole("link"));

		expect(incrementArticleViewed).toHaveBeenCalledWith("hero-1");
		expect(recordArticleRead).not.toHaveBeenCalled();
	});

	/** When authenticated, click both increments views and records read history. */
	it("records article read when authenticated", async () => {
		setAuth(true);
		renderWithProviders(
			<NewsHeroCard articleInfo={sampleArticle} small={false} />
		);

		await userEvent.click(screen.getByRole("link"));

		expect(incrementArticleViewed).toHaveBeenCalledWith("hero-1");
		expect(recordArticleRead).toHaveBeenCalledWith("hero-1");
	});
});
