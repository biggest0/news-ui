import { SectionHeader } from "./SectionHeader";
import { SectionDropDown } from "./SectionDropDown";
import type { SectionToggleState } from "@/types/localStorageTypes";

interface SectionHeaderExpandableProps {
	title: string;
	section: keyof SectionToggleState;
}

/**
 * Section header with its per-section options menu — composes SectionHeader
 * and SectionDropDown (previously this file inlined a verbatim copy of the
 * dropdown; it now has a single source).
 */
export const SectionHeaderExpandable = ({
	title,
	section,
}: SectionHeaderExpandableProps) => {
	return (
		<div className="flex flex-row items-center space-x-4">
			<SectionHeader title={title} />
			<SectionDropDown section={section} />
		</div>
	);
};
