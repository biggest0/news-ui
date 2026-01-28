import type { AppSetting } from "@/types/localStorageTypes";

export function getAppSetting(): AppSetting {
	const appSetting = localStorage.getItem("appSetting");
	return appSetting
		? JSON.parse(appSetting)
		: {
				darkMode: false,
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
}

export function setAppSetting(setting: AppSetting) {
	localStorage.setItem("appSetting", JSON.stringify(setting));
}
