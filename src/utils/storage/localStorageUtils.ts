import type { AppSetting } from "@/types/localStorageTypes";

const DEFAULT_APP_SETTING: AppSetting = {
	darkMode: false,
	themeMode: "light", // Options: "light" | "dark" | "system"
	homeLayout: {
		visible: {
			newsSection: true,
			editorsSection: true,
			catFactsSection: true,
			staffPicksSection: true,
			popularSection: true,
		},
		expanded: {
			newsSection: true,
			editorsSection: true,
			catFactsSection: true,
			staffPicksSection: true,
			popularSection: true,
		},
		pagePagination: true,
	},
};

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

export function setAppSetting(setting: AppSetting) {
	localStorage.setItem("appSetting", JSON.stringify(setting));
}
