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

/**
 * True when every home section is hidden — drives the global empty state.
 *
 * `featuredSection` is deliberately not counted. It renders only at md and up,
 * so its options menu is unreachable on a phone: including it would mean a
 * mobile visitor who hid every section they *can* hide would never see the
 * empty state, because a section they cannot reach is still marked visible.
 * The cost is that a desktop visitor who hides the other six still sees the
 * featured band alongside the empty-state message.
 */
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