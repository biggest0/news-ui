/**
 * CategoryNewsSection is a thin wrapper since M5 — data fetching lives in
 * BaseNewsSection's RTK Query hooks (each category keys its own cache
 * entry). These tests only pin the prop contract: the route's first path
 * segment becomes the category prop.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CategoryNewsSection } from "@/components/news/section/newsSections/CategoryNewsSection";

const baseNewsSectionSpy = vi.fn();
vi.mock("@/components/news/section/newsSections/BaseNewsSection", () => ({
	BaseNewsSection: (props: Record<string, unknown>) => {
		baseNewsSectionSpy(props);
		return <div data-testid="base-news-section" />;
	},
}));

describe("CategoryNewsSection", () => {
	/** The URL category becomes BaseNewsSection's category prop. */
	it("passes the route category to BaseNewsSection", () => {
		render(
			<MemoryRouter initialEntries={["/science"]}>
				<CategoryNewsSection />
			</MemoryRouter>
		);

		expect(screen.getByTestId("base-news-section")).toBeInTheDocument();
		expect(baseNewsSectionSpy).toHaveBeenCalledWith(
			expect.objectContaining({ category: "science" })
		);
	});
});
