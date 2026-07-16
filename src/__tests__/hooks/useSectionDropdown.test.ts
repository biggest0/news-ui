/**
 * Unit tests for useSectionDropdown (M7).
 *
 * Verifies the option list it builds per section: expand/collapse label
 * toggles on state, remove is always present, and only the news section gets
 * the divider + page/scroll view-mode toggle. Also checks each option's
 * onClick calls the right AppSettings mutator.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useSectionDropdown } from "@/hooks/useSectionDropdown";

const updateSectionExpansion = vi.fn();
const updateSectionVisibility = vi.fn();
const togglePagination = vi.fn();

let appSetting = {
	homeLayout: {
		expanded: { newsSection: true, editorsSection: true } as Record<string, boolean>,
		pagePagination: false,
	},
};

vi.mock("@/contexts/AppSettingContext", () => ({
	useAppSettings: () => ({
		appSetting,
		updateSectionExpansion,
		updateSectionVisibility,
		togglePagination,
	}),
}));

vi.mock("react-i18next", () => ({
	// echo the key back so labels are assertable
	useTranslation: () => ({ t: (key: string) => key }),
}));

beforeEach(() => {
	vi.clearAllMocks();
	appSetting = {
		homeLayout: {
			expanded: { newsSection: true, editorsSection: true },
			pagePagination: false,
		},
	};
});

describe("useSectionDropdown", () => {
	it("builds collapse + remove options for a non-news section", () => {
		const { result } = renderHook(() => useSectionDropdown("editorsSection"));

		const labels = result.current.map((o) => o.label);
		expect(labels).toEqual(["DROPDOWN.COLLAPSE", "DROPDOWN.REMOVE"]);
	});

	it("shows EXPAND when the section is collapsed", () => {
		appSetting.homeLayout.expanded.editorsSection = false;
		const { result } = renderHook(() => useSectionDropdown("editorsSection"));

		expect(result.current[0].label).toBe("DROPDOWN.EXPAND");
	});

	it("adds a divider and the view-mode toggle only for the news section", () => {
		const { result } = renderHook(() => useSectionDropdown("newsSection"));

		expect(result.current).toHaveLength(4);
		expect(result.current[2].isDivider).toBe(true);
		// pagePagination is false → offer PAGE_VIEW
		expect(result.current[3].label).toBe("DROPDOWN.PAGE_VIEW");
	});

	it("offers SCROLL_VIEW when already in page-pagination mode", () => {
		appSetting.homeLayout.pagePagination = true;
		const { result } = renderHook(() => useSectionDropdown("newsSection"));

		expect(result.current[3].label).toBe("DROPDOWN.SCROLL_VIEW");
	});

	it("wires option clicks to the correct AppSettings mutators", () => {
		const { result } = renderHook(() => useSectionDropdown("newsSection"));

		result.current[0].onClick(); // collapse toggle
		expect(updateSectionExpansion).toHaveBeenCalledWith("newsSection", false);

		result.current[1].onClick(); // remove
		expect(updateSectionVisibility).toHaveBeenCalledWith("newsSection", false);

		result.current[3].onClick(); // view mode
		expect(togglePagination).toHaveBeenCalledTimes(1);
	});
});
