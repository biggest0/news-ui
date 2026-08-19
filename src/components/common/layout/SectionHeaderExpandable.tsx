import { SectionHeader } from "@/components/common/layout/SectionHeader";
import { SectionDropDown } from "@/components/common/layout/SectionDropDown";
import type { SectionToggleState } from "@/types/localStorageTypes";

interface SectionHeaderExpandableProps {
	title: string;
	section: keyof SectionToggleState;
	/** Forwarded to SectionHeader — `h1` when this section is the whole page. */
	as?: "h1" | "h2";
}

/**
 * Section header with its per-section options menu — composes SectionHeader
 * and SectionDropDown (previously this file inlined a verbatim copy of the
 * dropdown; it now has a single source).
 */
export const SectionHeaderExpandable = ({
	title,
	section,
	as,
}: SectionHeaderExpandableProps) => {
	return (
		<div className="flex flex-row items-center space-x-4">
			<SectionHeader title={title} as={as} />
			<SectionDropDown section={section} />
		</div>
	);
};
