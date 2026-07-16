/**
 * HomeNewsSection is a thin wrapper since M5 — data fetching lives in
 * BaseNewsSection's RTK Query hooks. These tests only pin the prop contract:
 * home = no category filter + initial-load overlay enabled.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomeNewsSection } from "@/components/news/section/newsSections/HomeNewsSection";

const baseNewsSectionSpy = vi.fn();
vi.mock("@/components/news/section/newsSections/BaseNewsSection", () => ({
	BaseNewsSection: (props: Record<string, unknown>) => {
		baseNewsSectionSpy(props);
		return <div data-testid="base-news-section" />;
	},
}));

describe("HomeNewsSection", () => {
	/** Home feed: no category (all articles) + overlay on initial load. */
	it("renders BaseNewsSection without a category and with the overlay", () => {
		render(<HomeNewsSection />);

		expect(screen.getByTestId("base-news-section")).toBeInTheDocument();
		expect(baseNewsSectionSpy).toHaveBeenCalledWith(
			expect.objectContaining({ overlayOnInitialLoad: true })
		);
		expect(baseNewsSectionSpy.mock.calls[0][0].category).toBeUndefined();
	});
});
