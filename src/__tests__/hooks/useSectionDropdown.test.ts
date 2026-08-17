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
const resetSectionVisibility = vi.fn();
const togglePagination = vi.fn();

/** Every section visible — the shape the hook reads for the restore option. */
const allVisible = () =>
	({
		newsSection: true,
		editorsSection: true,
		catFactsSection: true,
		staffPicksSection: true,
		popularSection: true,
		recommendedSection: true,
	}) as Record<string, boolean>;

let appSetting = {
	homeLayout: {
		visible: allVisible(),
		expanded: { newsSection: true, editorsSection: true } as Record<string, boolean>,
		pagePagination: false,
	},
};

vi.mock("@/contexts/AppSettingContext", () => ({
	useAppSettings: () => ({
		appSetting,
		updateSectionExpansion,
		updateSectionVisibility,
		resetSectionVisibility,
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
			visible: allVisible(),
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

// ── Restore hidden sections ──────────────────────────────────────────
// Removing any section other than Mews leaves no on-page trace, so this menu
// entry is the only route back. It appears only when something is hidden.

describe("useSectionDropdown — restore option", () => {
	it("is absent while every section is visible", () => {
		const { result } = renderHook(() => useSectionDropdown("editorsSection"));

		const labels = result.current.map((o) => o.label);
		expect(labels).not.toContain("DROPDOWN.RESTORE_SECTIONS");
	});

	it("appears when another section is hidden", () => {
		appSetting.homeLayout.visible.popularSection = false;
		const { result } = renderHook(() => useSectionDropdown("editorsSection"));

		const labels = result.current.map((o) => o.label);
		expect(labels).toContain("DROPDOWN.RESTORE_SECTIONS");
	});

	it("appears in a hidden section's own menu too", () => {
		// The side-column sections still render their header while hidden
		appSetting.homeLayout.visible.editorsSection = false;
		const { result } = renderHook(() => useSectionDropdown("editorsSection"));

		expect(result.current.map((o) => o.label)).toContain(
			"DROPDOWN.RESTORE_SECTIONS"
		);
	});

	it("sits last, behind its own divider", () => {
		appSetting.homeLayout.visible.popularSection = false;
		const { result } = renderHook(() => useSectionDropdown("editorsSection"));

		const last = result.current[result.current.length - 1];
		const beforeLast = result.current[result.current.length - 2];

		expect(last.label).toBe("DROPDOWN.RESTORE_SECTIONS");
		expect(beforeLast.isDivider).toBe(true);
	});

	it("restores everything at once (no section key passed)", () => {
		appSetting.homeLayout.visible.popularSection = false;
		const { result } = renderHook(() => useSectionDropdown("editorsSection"));

		const restore = result.current[result.current.length - 1];
		restore.onClick();

		expect(resetSectionVisibility).toHaveBeenCalledTimes(1);
		expect(resetSectionVisibility).toHaveBeenCalledWith();
	});

	it("still lands last for the news section, after the view-mode toggle", () => {
		appSetting.homeLayout.visible.catFactsSection = false;
		const { result } = renderHook(() => useSectionDropdown("newsSection"));

		// collapse, remove, divider, view mode, divider, restore
		expect(result.current).toHaveLength(6);
		expect(result.current[3].label).toBe("DROPDOWN.PAGE_VIEW");
		expect(result.current[4].isDivider).toBe(true);
		expect(result.current[5].label).toBe("DROPDOWN.RESTORE_SECTIONS");
	});
});
