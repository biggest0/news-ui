import { useAppSettings } from "@/contexts/AppSettingContext";
import type { SectionToggleState } from "@/types/localStorageTypes";

export function useSectionCollapse(section: keyof SectionToggleState) {
	const { appSetting } = useAppSettings();
	return appSetting.homeLayout.expanded[section];
}

export function useSectionVisible(section: keyof SectionToggleState) {
	const { appSetting } = useAppSettings();
	return appSetting.homeLayout.visible[section];
}

export function useAllSectionNotVisible() {
	const { appSetting } = useAppSettings();
	const visibility = appSetting.homeLayout.visible;
	return (
		!visibility.newsSection &&
		!visibility.editorsSection &&
		!visibility.catFactsSection &&
		!visibility.staffPicksSection &&
		!visibility.popularSection
	);
}