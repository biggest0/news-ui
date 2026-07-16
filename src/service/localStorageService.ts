import type {
	SectionToggleState
} from "@/types/localStorageTypes";
import {
	getAppSetting,
	setAppSetting,
} from "@/utils/storage/localStorageUtils";

/** Persists a section's visibility flag into the stored app settings. */
export function updateSectionVisibility(
	key: keyof SectionToggleState,
	value: boolean
) {
	try {
		const appSetting = getAppSetting();
		appSetting.homeLayout.visible[key] = value;
		setAppSetting(appSetting);
	} catch (error) {
		console.error("Error updating app setting in localStorage:", error);
	}
}

/** Persists a section's expanded/collapsed flag into the stored app settings. */
export function updateSectionExpansion(
	key: keyof SectionToggleState,
	value: boolean
) {
	try {
		const appSetting = getAppSetting();
		appSetting.homeLayout.expanded[key] = value;
		setAppSetting(appSetting);

		// Dispatch event so usePagePagination hook can update
		window.dispatchEvent(new CustomEvent("newsSectionChange", { detail: value }));
	} catch (error) {
		console.error("Error updating app setting in localStorage:", error);
	}
}

/** Flips the persisted theme mode between light and dark. */
export function toggleDarkMode() {
	try {
		const appSetting = getAppSetting();
		appSetting.darkMode = !appSetting.darkMode;
		setAppSetting(appSetting);
	} catch (error) {
		console.error("Error toggling dark mode in localStorage:", error);
	}
}

/** Flips the persisted news-list mode between pagination and infinite scroll. */
export function togglePagePagination() {
	try {
		const appSetting = getAppSetting();
		const newPagePagination = !appSetting.homeLayout.pagePagination;
		appSetting.homeLayout.pagePagination = newPagePagination;
		setAppSetting(appSetting);

		// Dispatch event so usePagePagination hook can update
		window.dispatchEvent(new CustomEvent("pagePaginationChange", { detail: newPagePagination }));
	} catch (error) {
		console.error("Error toggling news section view in localStorage:", error);
	}
}
