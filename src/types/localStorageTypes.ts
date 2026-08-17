export interface UserInfo {
	name?: string;
	biography?: string;
}

export type ThemeMode = "light" | "dark" | "system";

export interface AppSetting {
	darkMode: boolean;
	themeMode?: ThemeMode; // Optional for backward compatibility
	homeLayout: HomeLayout;
}

export interface HomeLayout {
	visible: SectionToggleState;
	expanded: SectionToggleState;
	pagePagination: boolean;
}

/** How the user got out of the onboarding tour. Recorded for insight only. */
export type OnboardingDismissal = "completed" | "skipped" | "closed";

/**
 * Dismissal record for the first-visit "how to use" tour. Stored under its own
 * localStorage key rather than inside AppSetting: this is a one-shot flag, not
 * a user preference, and it has no business in the cross-tab settings sync.
 */
export interface OnboardingState {
	/** Highest ONBOARDING_VERSION the user has dismissed. 0 = never seen. */
	seenVersion: number;
	/** ISO timestamp of the dismissal; empty string when never seen. */
	completedAt: string;
	dismissedVia: OnboardingDismissal;
}

export interface SectionToggleState {
	newsSection: boolean;
	editorsSection: boolean;
	catFactsSection: boolean;
	staffPicksSection: boolean;
	popularSection: boolean;
	recommendedSection: boolean;
}
