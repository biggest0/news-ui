import { useSectionCollapse } from "@/hooks/useSectionCollapse";
import type { SectionToggleState } from "@/types/localStorageTypes";

interface CollapsibleSectionProps {
	section: keyof SectionToggleState;
	children: React.ReactNode;
}

const CollapsibleSection = ({ section, children }: CollapsibleSectionProps) => {
	const isCollapsed = useSectionCollapse(section);
	const isHidden = false; // Placeholder for future implementation

	return (
		<div
			className={`grid transition-all duration-500 ease-in-out ${
				isCollapsed ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} ${
        isHidden ? "hidden" : ""}`}
		>
			<div className="overflow-hidden">{children}</div>
		</div>
	);
};

export default CollapsibleSection;
