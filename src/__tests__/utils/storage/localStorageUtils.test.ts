import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
	getAppSetting,
	setAppSetting,
	getOnboardingState,
	setOnboardingState,
} from "@/utils/storage/localStorageUtils";
import type { AppSetting, OnboardingState } from "@/types/localStorageTypes";

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

const DEFAULT_ONBOARDING_STATE: OnboardingState = {
	seenVersion: 0,
	completedAt: "",
	dismissedVia: "closed",
};

beforeEach(() => {
	localStorage.clear();
});

afterEach(() => {
	vi.restoreAllMocks();
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

// ── getOnboardingState ───────────────────────────────────────────────

describe("getOnboardingState", () => {
	it("returns defaults when localStorage is empty", () => {
		expect(getOnboardingState()).toEqual(DEFAULT_ONBOARDING_STATE);
	});

	it("returns the stored record when present", () => {
		const stored: OnboardingState = {
			seenVersion: 3,
			completedAt: "2026-08-16T12:00:00.000Z",
			dismissedVia: "completed",
		};
		localStorage.setItem("onboarding", JSON.stringify(stored));
		expect(getOnboardingState()).toEqual(stored);
	});

	it("merges over defaults when the stored record is partial", () => {
		// Only seenVersion was written (e.g. by an older build)
		localStorage.setItem("onboarding", JSON.stringify({ seenVersion: 2 }));
		const result = getOnboardingState();

		expect(result.seenVersion).toBe(2);
		expect(result.completedAt).toBe("");
		expect(result.dismissedVia).toBe("closed");
	});

	it("falls back to defaults on corrupt JSON", () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		localStorage.setItem("onboarding", "{not valid json");

		expect(getOnboardingState()).toEqual(DEFAULT_ONBOARDING_STATE);
	});

	it("falls back to defaults when the stored value is not an object", () => {
		localStorage.setItem("onboarding", JSON.stringify("nope"));
		expect(getOnboardingState()).toEqual(DEFAULT_ONBOARDING_STATE);
	});

	it("falls back to defaults when localStorage itself throws", () => {
		// Safari private mode: reads can reject outright
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
			throw new Error("access denied");
		});

		expect(getOnboardingState()).toEqual(DEFAULT_ONBOARDING_STATE);
	});

	it("returns a fresh object each call so callers can't poison the default", () => {
		const first = getOnboardingState();
		first.seenVersion = 99;

		expect(getOnboardingState().seenVersion).toBe(0);
	});

	it("normalizes a non-numeric seenVersion so the tour can't be suppressed forever", () => {
		localStorage.setItem(
			"onboarding",
			JSON.stringify({ seenVersion: "999", completedAt: "", dismissedVia: "closed" })
		);

		// "999" < 1 is false, which would silently hide the tour for good
		expect(getOnboardingState().seenVersion).toBe(0);
	});
});

// ── setOnboardingState ───────────────────────────────────────────────

describe("setOnboardingState", () => {
	it("writes to localStorage under the 'onboarding' key", () => {
		const state: OnboardingState = {
			seenVersion: 1,
			completedAt: "2026-08-16T12:00:00.000Z",
			dismissedVia: "skipped",
		};
		setOnboardingState(state);

		const stored = localStorage.getItem("onboarding");
		expect(stored).not.toBeNull();
		expect(JSON.parse(stored!)).toEqual(state);
	});

	it("overwrites an existing record", () => {
		setOnboardingState({ ...DEFAULT_ONBOARDING_STATE, seenVersion: 1 });
		setOnboardingState({ ...DEFAULT_ONBOARDING_STATE, seenVersion: 2 });

		expect(JSON.parse(localStorage.getItem("onboarding")!).seenVersion).toBe(2);
	});

	it("swallows write failures so a failed persist can't block the dialog closing", () => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new Error("quota exceeded");
		});

		expect(() =>
			setOnboardingState({ ...DEFAULT_ONBOARDING_STATE, seenVersion: 1 })
		).not.toThrow();
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

	it("returns the same onboarding record after set then get", () => {
		const custom: OnboardingState = {
			seenVersion: 4,
			completedAt: "2026-08-16T09:30:00.000Z",
			dismissedVia: "completed",
		};
		setOnboardingState(custom);
		expect(getOnboardingState()).toEqual(custom);
	});
});
