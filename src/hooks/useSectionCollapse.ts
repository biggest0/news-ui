import { useAppSettings } from "@/contexts/AppSettingContext";
import type { SectionToggleState } from "@/types/localStorageTypes";

/** Returns whether the given home section is expanded (per app settings). */
export function useSectionCollapse(section: keyof SectionToggleState) {
	const { appSetting } = useAppSettings();
	return appSetting.homeLayout.expanded[section];
}

/** Returns whether the given home section is visible (per app settings). */
export function useSectionVisible(section: keyof SectionToggleState) {
	const { appSetting } = useAppSettings();
	return appSetting.homeLayout.visible[section];
}

/** True when every home section is hidden — drives the global empty state. */
export function useAllSectionNotVisible() {
	const { appSetting } = useAppSettings();
	const visibility = appSetting.homeLayout.visible;
	return (
		!visibility.newsSection &&
		!visibility.editorsSection &&
		!visibility.catFactsSection &&
		!visibility.staffPicksSection &&
		!visibility.popularSection &&
		!visibility.recommendedSection
	);
}