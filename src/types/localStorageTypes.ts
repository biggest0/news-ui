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

export interface SectionToggleState {
	newsSection: boolean;
	editorsSection: boolean;
	catFactsSection: boolean;
	staffPicksSection: boolean;
	popularSection: boolean;
}
