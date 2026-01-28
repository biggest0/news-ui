import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useAppSettings } from "@/contexts/AppSettingContext";
import type {
	SectionToggleState
} from "@/types/localStorageTypes";

type SectionKey = Extract<
	keyof SectionToggleState,
	"newsSection" | "editorsSection" | "catFactsSection" | "staffPicksSection" | "popularSection"
>;

export interface DropDownOption {
	label: string;
	onClick: () => void;
	icon?: React.ReactNode;
	className?: string;
	isDivider?: boolean;
}

export function useSectionDropdown(sectionKey: SectionKey): DropDownOption[] {
	const { t } = useTranslation();
	const {
		appSetting,
		updateSectionExpansion,
		updateSectionVisibility,
		togglePagination,
	} = useAppSettings();

	const dropdownOptions = useMemo(() => {
		// const isVisible = appSetting.homeLayout.visible[sectionKey];
		const isExpanded = appSetting.homeLayout.expanded[sectionKey];
		const isPaginated = appSetting.homeLayout.pagePagination;

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

		return options;
	}, [appSetting, t]);

	return dropdownOptions;
}
