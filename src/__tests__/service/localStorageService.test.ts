/**
 * Unit tests for src/service/localStorageService.ts
 *
 * Tests the localStorage-backed UI preference services: section visibility,
 * section expansion (with CustomEvent dispatch), dark mode toggle, and
 * page pagination toggle (with CustomEvent dispatch).
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	updateSectionVisibility,
	updateSectionExpansion,
	toggleDarkMode,
	togglePagePagination,
} from "@/service/localStorageService";
import { getAppSetting, setAppSetting } from "@/utils/storage/localStorageUtils";
import type { AppSetting } from "@/types/localStorageTypes";

/**
 * Seed localStorage with a fresh copy of the defaults before each test.
 *
 * Why not just localStorage.clear()?  When localStorage is empty,
 * getAppSetting() returns the module-level DEFAULT_APP_SETTING *reference*.
 * The service functions then mutate that object in-place, permanently
 * corrupting the defaults for subsequent tests. By always seeding a
 * value, getAppSetting() never returns the bare reference.
 */
const FRESH_DEFAULTS: AppSetting = {
	darkMode: false,
	themeMode: "light",
	homeLayout: {
		visible: {
			newsSection: true,
			editorsSection: true,
			catFactsSection: true,
			staffPicksSection: true,
			popularSection: true,
			recommendedSection: true,
		},
		expanded: {
			newsSection: true,
			editorsSection: true,
			catFactsSection: true,
			staffPicksSection: true,
			popularSection: true,
			recommendedSection: true,
		},
		pagePagination: true,
	},
};

beforeEach(() => {
	localStorage.clear();
	setAppSetting(structuredClone(FRESH_DEFAULTS));
});

// ── updateSectionVisibility ──────────────────────────────────────────

describe("updateSectionVisibility", () => {
	it("sets a section to hidden in localStorage", () => {
		updateSectionVisibility("newsSection", false);

		const setting = getAppSetting();
		expect(setting.homeLayout.visible.newsSection).toBe(false);
	});

	it("sets a section to visible in localStorage", () => {
		updateSectionVisibility("newsSection", false);
		updateSectionVisibility("newsSection", true);

		const setting = getAppSetting();
		expect(setting.homeLayout.visible.newsSection).toBe(true);
	});

	it("only affects the targeted section — others remain default", () => {
		updateSectionVisibility("catFactsSection", false);

		const setting = getAppSetting();
		expect(setting.homeLayout.visible.catFactsSection).toBe(false);
		expect(setting.homeLayout.visible.newsSection).toBe(true);
		expect(setting.homeLayout.visible.editorsSection).toBe(true);
	});
});

// ── updateSectionExpansion ───────────────────────────────────────────

describe("updateSectionExpansion", () => {
	it("sets a section to collapsed in localStorage", () => {
		updateSectionExpansion("editorsSection", false);

		const setting = getAppSetting();
		expect(setting.homeLayout.expanded.editorsSection).toBe(false);
	});

	it("dispatches a 'newsSectionChange' CustomEvent with the new value", () => {
		const listener = vi.fn();
		window.addEventListener("newsSectionChange", listener);

		updateSectionExpansion("newsSection", false);

		expect(listener).toHaveBeenCalledTimes(1);
		expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe(false);

		window.removeEventListener("newsSectionChange", listener);
	});

	it("dispatches event with true when expanding", () => {
		const listener = vi.fn();
		window.addEventListener("newsSectionChange", listener);

		updateSectionExpansion("newsSection", true);

		expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe(true);

		window.removeEventListener("newsSectionChange", listener);
	});
});

// ── toggleDarkMode ───────────────────────────────────────────────────

describe("toggleDarkMode", () => {
	it("toggles darkMode from false to true", () => {
		// Default is false
		toggleDarkMode();

		const setting = getAppSetting();
		expect(setting.darkMode).toBe(true);
	});

	it("toggles darkMode from true back to false", () => {
		toggleDarkMode(); // false → true
		toggleDarkMode(); // true → false

		const setting = getAppSetting();
		expect(setting.darkMode).toBe(false);
	});

	it("does not affect other settings", () => {
		toggleDarkMode();

		const setting = getAppSetting();
		expect(setting.homeLayout.pagePagination).toBe(true);
		expect(setting.homeLayout.visible.newsSection).toBe(true);
	});
});

// ── togglePagePagination ─────────────────────────────────────────────

describe("togglePagePagination", () => {
	it("toggles pagePagination from true to false", () => {
		// Default is true
		togglePagePagination();

		const setting = getAppSetting();
		expect(setting.homeLayout.pagePagination).toBe(false);
	});

	it("toggles pagePagination from false back to true", () => {
		togglePagePagination(); // true → false
		togglePagePagination(); // false → true

		const setting = getAppSetting();
		expect(setting.homeLayout.pagePagination).toBe(true);
	});

	it("dispatches a 'pagePaginationChange' CustomEvent with the new value", () => {
		const listener = vi.fn();
		window.addEventListener("pagePaginationChange", listener);

		togglePagePagination(); // true → false

		expect(listener).toHaveBeenCalledTimes(1);
		expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe(false);

		window.removeEventListener("pagePaginationChange", listener);
	});

	it("does not affect dark mode setting", () => {
		togglePagePagination();

		const setting = getAppSetting();
		expect(setting.darkMode).toBe(false);
	});
});
