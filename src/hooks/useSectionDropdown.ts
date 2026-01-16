import type { DropDownOption } from "@/components/common/layout/SectionDropDown";
import { useAppSettings } from "@/contexts/AppSettingContext";
import type {
	SectionToggleState
} from "@/types/localStorageTypes";
import { useMemo } from "react";

type SectionKey = Extract<
	keyof SectionToggleState,
	"newsSection" | "editorsSection" | "catFactsSection"
>;

export function useSectionDropdown(sectionKey: SectionKey): DropDownOption[] {
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
			label: isExpanded ? "Collapse" : "Expand",
			onClick: () => {
				updateSectionExpansion(sectionKey, !isExpanded);
			},
		});

		options.push({
			label: "Remove",
			onClick: () => {
				updateSectionVisibility(sectionKey, false);
			},
		});

		if (sectionKey === "newsSection") {
			options.push({ isDivider: true, label: "", onClick: () => {} });

			options.push({
				label: isPaginated ? "Scroll View" : "Page View",
				onClick: () => {
					togglePagination();
				},
			});
		}

		return options;
	}, [appSetting]);

	return dropdownOptions;
}
