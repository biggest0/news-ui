/**
 * Component tests for ArticleTitleCard.
 *
 * ArticleTitleCard renders a numbered, clickable article title that links to
 * the article detail page. On click it fire-and-forgets a view increment and,
 * if authenticated, records the read in the user's history.
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
import { ArticleTitleCard } from "@/components/news/cards/ArticleTitleCard";

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

function setAuth(accessToken: string | null) {
	vi.mocked(useAuth).mockReturnValue({
		user: null,
		accessToken,
		isAuthenticated: !!accessToken,
		isLoading: false,
		login: vi.fn(),
		register: vi.fn(),
		logout: vi.fn(),
	});
}

const defaultProps = {
	articleId: "art-1",
	articleTitle: "Cat Takes Over Parliament",
	index: 0,
};

// ── Tests ────────────────────────────────────────────────────────────

describe("ArticleTitleCard", () => {
	/** Verifies the title is prefixed with the 1-based index number. */
	it("renders the article title with 1-based index prefix", () => {
		setAuth(null);
		renderWithProviders(<ArticleTitleCard {...defaultProps} />);

		expect(screen.getByText("1. Cat Takes Over Parliament")).toBeInTheDocument();
	});

	/** Verifies the index number matches the prop (0 → "1.", 4 → "5."). */
	it("formats index correctly for non-zero values", () => {
		setAuth(null);
		renderWithProviders(<ArticleTitleCard {...defaultProps} index={4} />);

		expect(screen.getByText("5. Cat Takes Over Parliament")).toBeInTheDocument();
	});

	/** Verifies the link navigates to /article/:id. */
	it("links to the article detail page", () => {
		setAuth(null);
		renderWithProviders(<ArticleTitleCard {...defaultProps} />);

		const link = screen.getByRole("link", { name: /Cat Takes Over Parliament/ });
		expect(link).toHaveAttribute("href", "/article/art-1");
	});

	/** Verifies incrementArticleViewed is always called on click, regardless of auth. */
	it("increments article view count on click (unauthenticated)", async () => {
		setAuth(null);
		renderWithProviders(<ArticleTitleCard {...defaultProps} />);

		await userEvent.click(screen.getByRole("link", { name: /Cat Takes Over Parliament/ }));

		expect(incrementArticleViewed).toHaveBeenCalledWith("art-1");
	});

	/** Verifies recordArticleRead is NOT called when the user is unauthenticated. */
	it("does not record article read when not authenticated", async () => {
		setAuth(null);
		renderWithProviders(<ArticleTitleCard {...defaultProps} />);

		await userEvent.click(screen.getByRole("link", { name: /Cat Takes Over Parliament/ }));

		expect(recordArticleRead).not.toHaveBeenCalled();
	});

	/** Verifies both incrementArticleViewed and recordArticleRead are called when authenticated. */
	it("records article read when authenticated", async () => {
		setAuth("test-token");
		renderWithProviders(<ArticleTitleCard {...defaultProps} />);

		await userEvent.click(screen.getByRole("link", { name: /Cat Takes Over Parliament/ }));

		expect(incrementArticleViewed).toHaveBeenCalledWith("art-1");
		expect(recordArticleRead).toHaveBeenCalledWith("art-1", "test-token");
	});
});
