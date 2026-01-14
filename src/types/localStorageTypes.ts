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
	pagePagination: boolean;
}

export interface VisibleSections {
	newsSection: boolean;
	editorsSection: boolean;
}

export interface ExpandedSections {
	newsSection: boolean;
	editorsSection: boolean;
}
