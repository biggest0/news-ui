import { useAppSettings } from "@/contexts/AppSettingContext";

/**
 * Hook to manage page pagination setting with reactive updates.
 * Keeps component in sync when togglePagePagination is called from anywhere.
 */
export function usePagePagination() {
	const { appSetting } = useAppSettings();
	return appSetting.homeLayout.pagePagination;
}
