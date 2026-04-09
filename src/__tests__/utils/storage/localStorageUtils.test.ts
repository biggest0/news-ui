import { describe, it, expect, beforeEach } from "vitest";
import { getAppSetting, setAppSetting } from "@/utils/storage/localStorageUtils";
import type { AppSetting } from "@/types/localStorageTypes";

// ── Setup ────────────────────────────────────────────────────────────

const DEFAULT_APP_SETTING: AppSetting = {
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
});

// ── getAppSetting ────────────────────────────────────────────────────

describe("getAppSetting", () => {
	it("returns full defaults when localStorage is empty", () => {
		const result = getAppSetting();
		expect(result).toEqual(DEFAULT_APP_SETTING);
	});

	it("returns stored settings when present", () => {
		const custom: AppSetting = {
			...DEFAULT_APP_SETTING,
			darkMode: true,
			themeMode: "dark",
		};
		localStorage.setItem("appSetting", JSON.stringify(custom));
		const result = getAppSetting();
		expect(result.darkMode).toBe(true);
		expect(result.themeMode).toBe("dark");
	});

	it("deep-merges with defaults when stored data is missing nested fields", () => {
		// Simulate old localStorage data missing 'expanded' and 'pagePagination'
		const partial = {
			darkMode: true,
			homeLayout: {
				visible: {
					newsSection: false,
					editorsSection: true,
					catFactsSection: true,
					staffPicksSection: true,
					popularSection: true,
				},
			},
		};
		localStorage.setItem("appSetting", JSON.stringify(partial));
		const result = getAppSetting();

		// Should have the custom value
		expect(result.darkMode).toBe(true);
		expect(result.homeLayout.visible.newsSection).toBe(false);

		// Should fill in defaults for missing nested fields
		expect(result.homeLayout.expanded.newsSection).toBe(true);
		expect(result.homeLayout.pagePagination).toBe(true);
	});

	it("merges defaults when homeLayout is completely missing", () => {
		localStorage.setItem("appSetting", JSON.stringify({ darkMode: true }));
		const result = getAppSetting();
		expect(result.darkMode).toBe(true);
		// homeLayout should come from defaults
		expect(result.homeLayout.pagePagination).toBe(true);
		expect(result.homeLayout.visible.newsSection).toBe(true);
	});

	it("preserves extra top-level fields from stored data", () => {
		const stored = { ...DEFAULT_APP_SETTING, darkMode: true };
		localStorage.setItem("appSetting", JSON.stringify(stored));
		const result = getAppSetting();
		expect(result.darkMode).toBe(true);
	});
});

// ── setAppSetting ────────────────────────────────────────────────────

describe("setAppSetting", () => {
	it("writes to localStorage under 'appSetting' key", () => {
		setAppSetting(DEFAULT_APP_SETTING);
		const stored = localStorage.getItem("appSetting");
		expect(stored).not.toBeNull();
		expect(JSON.parse(stored!)).toEqual(DEFAULT_APP_SETTING);
	});

	it("overwrites existing value", () => {
		setAppSetting(DEFAULT_APP_SETTING);
		const updated = { ...DEFAULT_APP_SETTING, darkMode: true };
		setAppSetting(updated);
		const stored = JSON.parse(localStorage.getItem("appSetting")!);
		expect(stored.darkMode).toBe(true);
	});
});

// ── Round-trip ───────────────────────────────────────────────────────

describe("round-trip: set → get", () => {
	it("returns the same object after set then get", () => {
		const custom: AppSetting = {
			darkMode: true,
			themeMode: "system",
			homeLayout: {
				visible: {
					newsSection: false,
					editorsSection: false,
					catFactsSection: true,
					staffPicksSection: true,
					popularSection: false,
					recommendedSection: true,
				},
				expanded: {
					newsSection: true,
					editorsSection: false,
					catFactsSection: false,
					staffPicksSection: true,
					popularSection: true,
					recommendedSection: true,
				},
				pagePagination: false,
			},
		};
		setAppSetting(custom);
		const result = getAppSetting();
		expect(result).toEqual(custom);
	});
});
