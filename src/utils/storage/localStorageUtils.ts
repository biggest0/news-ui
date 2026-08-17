import { ONBOARDING } from "@/constants/keys";
import type { AppSetting, OnboardingState } from "@/types/localStorageTypes";

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

/** Reads the persisted app settings, falling back to defaults on bad data. */
export function getAppSetting(): AppSetting {
	const appSetting = localStorage.getItem("appSetting");
	if (!appSetting) return DEFAULT_APP_SETTING;
	
	// Merge with defaults to handle missing fields from older localStorage data
	const parsed = JSON.parse(appSetting);
	return {
		...DEFAULT_APP_SETTING,
		...parsed,
		homeLayout: {
			...DEFAULT_APP_SETTING.homeLayout,
			...parsed.homeLayout,
			visible: {
				...DEFAULT_APP_SETTING.homeLayout.visible,
				...parsed.homeLayout?.visible,
			},
			expanded: {
				...DEFAULT_APP_SETTING.homeLayout.expanded,
				...parsed.homeLayout?.expanded,
			},
		},
	};
}

/** Writes the app settings object to localStorage. */
export function setAppSetting(setting: AppSetting) {
	localStorage.setItem("appSetting", JSON.stringify(setting));
}

const DEFAULT_ONBOARDING_STATE: OnboardingState = {
	seenVersion: 0,
	completedAt: "",
	dismissedVia: "closed",
};

/**
 * Reads the onboarding dismissal record.
 *
 * Deliberately total: a missing key, corrupt JSON, a non-object payload, or a
 * `localStorage` that throws outright (Safari private mode) all resolve to the
 * default. The worst outcome is showing a returning visitor the tour again —
 * far better than throwing on the home page render path.
 *
 * @returns The stored record merged over defaults, or the default record.
 */
export function getOnboardingState(): OnboardingState {
	try {
		const stored = localStorage.getItem(ONBOARDING);
		// Always hand back a fresh copy: the default is module-level, and a
		// caller mutating it would poison every later read.
		if (!stored) return { ...DEFAULT_ONBOARDING_STATE };

		// Reject anything that isn't a plain object — a bare string or number
		// would otherwise spread into junk keys.
		const parsed: unknown = JSON.parse(stored);
		if (typeof parsed !== "object" || parsed === null) {
			return { ...DEFAULT_ONBOARDING_STATE };
		}

		// Merge over defaults so a partial or hand-edited record can't leave
		// undefined fields for callers to trip over.
		const merged = { ...DEFAULT_ONBOARDING_STATE, ...parsed };

		// A non-numeric seenVersion would make every `< ONBOARDING_VERSION`
		// comparison false and silently suppress the tour forever.
		if (!Number.isFinite(merged.seenVersion)) {
			merged.seenVersion = DEFAULT_ONBOARDING_STATE.seenVersion;
		}

		return merged;
	} catch (error) {
		console.error("Error reading onboarding state from localStorage:", error);
		return { ...DEFAULT_ONBOARDING_STATE };
	}
}

/**
 * Writes the onboarding dismissal record.
 *
 * Write failures (quota, private mode) are swallowed on purpose: a failed
 * persist must never stop the tour dialog from closing.
 */
export function setOnboardingState(state: OnboardingState) {
	try {
		localStorage.setItem(ONBOARDING, JSON.stringify(state));
	} catch (error) {
		console.error("Error writing onboarding state to localStorage:", error);
	}
}
