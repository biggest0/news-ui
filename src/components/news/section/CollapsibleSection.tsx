import { useSectionCollapse } from "@/hooks/useSectionCollapse";
import type { SectionToggleState } from "@/types/localStorageTypes";

interface CollapsibleSectionProps {
	section: keyof SectionToggleState;
	children: React.ReactNode;
}

const CollapsibleSection = ({ section, children }: CollapsibleSectionProps) => {
	const isExpanded = useSectionCollapse(section);
	return (
		<div
			className={`grid transition-all duration-500 ease-in-out ${
				isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
		>
			<div className="overflow-hidden">{children}</div>
		</div>
	);
};

export default CollapsibleSection;
