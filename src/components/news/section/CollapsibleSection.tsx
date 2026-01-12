import { useSectionCollapse } from "@/hooks/useSectionCollapse";

interface CollapsibleSectionProps {
	children: React.ReactNode;
}

const CollapsibleSection = ({ children }: CollapsibleSectionProps) => {
	const isCollapsed = useSectionCollapse();
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
