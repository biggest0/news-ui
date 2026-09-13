import { cn } from "@/lib/utils";
import { useSectionCollapse } from "@/hooks/useSectionCollapse";
import type { SectionToggleState } from "@/types/localStorageTypes";

interface CollapsibleSectionProps {
	section: keyof SectionToggleState;
	/**
	 * Placement for the wrapper, e.g. a column span when the collapsing region
	 * is itself a grid item. Several instances may share one `section`, which
	 * is how a layout collapses parts that are not DOM siblings.
	 */
	className?: string;
	children: React.ReactNode;
}

const CollapsibleSection = ({ section, className, children }: CollapsibleSectionProps) => {
	const isExpanded = useSectionCollapse(section);
	return (
		<div
			className={cn(
				"grid transition-all duration-500 ease-in-out",
				isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
				className
			)}
		>
			<div className="overflow-hidden">{children}</div>
		</div>
	);
};

export default CollapsibleSection;
