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
