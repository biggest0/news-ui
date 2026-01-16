export interface UserInfo {
	name?: string;
	biography?: string;
}

export interface AppSetting {
	darkMode: boolean;
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
}
