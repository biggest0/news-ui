import { useAppSettings } from "@/contexts/AppSettingContext";

export function useSectionCollapse() {
	const { appSetting } = useAppSettings();
	return appSetting.homeLayout.expanded.newsSection;
}
