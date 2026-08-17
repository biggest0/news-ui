import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAppSettings } from "@/contexts/AppSettingContext";
import type {
	SectionToggleState
} from "@/types/localStorageTypes";

type SectionKey = Extract<
	keyof SectionToggleState,
	"newsSection" | "editorsSection" | "catFactsSection" | "staffPicksSection" | "popularSection" | "recommendedSection"
>;

export interface DropDownOption {
	label: string;
	onClick: () => void;
	icon?: React.ReactNode;
	className?: string;
	isDivider?: boolean;
}

/**
 * Builds the option list for a section's dropdown menu (expand/collapse,
 * remove, — for the news section — page/scroll view toggle, and a restore
 * action whenever any section is currently hidden).
 * @param sectionKey - Which home section the menu controls
 * @returns Memoized DropDownOption[] for SectionDropDown
 */
export function useSectionDropdown(sectionKey: SectionKey): DropDownOption[] {
	const { t } = useTranslation();
	const {
		appSetting,
		updateSectionExpansion,
		updateSectionVisibility,
		resetSectionVisibility,
		togglePagination,
	} = useAppSettings();

	const dropdownOptions = useMemo(() => {
		// const isVisible = appSetting.homeLayout.visible[sectionKey];
		const isExpanded = appSetting.homeLayout.expanded[sectionKey];
		const isPaginated = appSetting.homeLayout.pagePagination;
		// Removing a section other than Mews leaves no trace on the page, so the
		// only way back is from a menu like this one. Read straight off the
		// appSetting we already hold rather than adding a second subscription.
		const hasHiddenSection = Object.values(appSetting.homeLayout.visible).some(
			(isSectionVisible) => !isSectionVisible
		);

		const options: DropDownOption[] = [];

		options.push({
			label: isExpanded ? t("DROPDOWN.COLLAPSE") : t("DROPDOWN.EXPAND"),
			onClick: () => {
				updateSectionExpansion(sectionKey, !isExpanded);
			},
		});

		options.push({
			label: t("DROPDOWN.REMOVE"),
			onClick: () => {
				updateSectionVisibility(sectionKey, false);
			},
		});

		if (sectionKey === "newsSection") {
			options.push({ isDivider: true, label: "", onClick: () => {} });

			options.push({
				label: isPaginated ? t("DROPDOWN.SCROLL_VIEW") : t("DROPDOWN.PAGE_VIEW"),
				onClick: () => {
					togglePagination();
				},
			});
		}

		// Last, behind its own divider: this one acts on the whole home layout,
		// not on this section, so it shouldn't read as another section toggle.
		if (hasHiddenSection) {
			options.push({ isDivider: true, label: "", onClick: () => {} });

			options.push({
				label: t("DROPDOWN.RESTORE_SECTIONS"),
				onClick: () => {
					resetSectionVisibility();
				},
			});
		}

		return options;
	}, [appSetting, t, sectionKey, togglePagination, updateSectionExpansion, updateSectionVisibility, resetSectionVisibility]);

	return dropdownOptions;
}
