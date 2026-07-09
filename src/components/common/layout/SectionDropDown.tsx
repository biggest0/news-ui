import { FaChevronDown } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSectionDropdown } from "@/hooks/useSectionDropdown";
import type { SectionToggleState } from "@/types/localStorageTypes";

export interface SectionDropDownProps {
	section: keyof SectionToggleState;
}

/**
 * Per-section options menu (collapse/expand, remove, view mode) rendered as a
 * chevron trigger next to the section header. Built on the accessible
 * DropdownMenu primitive: the trigger is a real button with aria-haspopup /
 * aria-expanded, the menu handles arrow-key navigation, Escape, and focus
 * return for free. Options come from `useSectionDropdown(section)`.
 */
export const SectionDropDown = ({ section }: SectionDropDownProps) => {
	const { t } = useTranslation();
	const dropDownOptions = useSectionDropdown(section);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={t("DROPDOWN.SECTION_OPTIONS")}
				className="group mb-4 cursor-pointer rounded text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
			>
				<FaChevronDown className="h-4 w-4 fill-current transition-transform duration-200 group-data-popup-open:rotate-180" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{dropDownOptions.map((option, index) =>
					option.isDivider ? (
						<DropdownMenuSeparator key={`divider-${index}`} />
					) : (
						<DropdownMenuItem
							key={`${option.label}-${index}`}
							className={option.className}
							onClick={option.onClick}
						>
							{option.icon && <span className="h-4 w-4">{option.icon}</span>}
							{option.label}
						</DropdownMenuItem>
					)
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
