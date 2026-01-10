export interface UserInfo {
	name?: string;
	biography?: string;
}

export interface AppSetting {
	darkMode: boolean;
	homeLayout: HomeLayout;
}

export interface HomeLayout {
	visible: VisibleSections;
	expanded: ExpandedSections;
}

export interface VisibleSections {
	newsSection: boolean;
}

export interface ExpandedSections {
	newsSection: boolean;
}
