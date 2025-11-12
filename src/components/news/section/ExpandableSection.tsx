import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { SectionHeader } from "@/components/common/layout/SectionHeader";

interface ExpandableSectionProps {
	title: string;
	isExpanded: boolean;
	onToggle: () => void;
	children: React.ReactNode;
	contentClassName?: string;
}

export function ExpandableSection({
	title,
	isExpanded,
	onToggle,
	children,
	contentClassName = "",
}: ExpandableSectionProps) {
	return (
		<section className="md:hidden pb-6 border-b border-gray-400">
			<div className="flex flex-row items-center space-x-4">
				<SectionHeader title={title} />
				{isExpanded ? (
					<FaChevronUp
						className="w-4 h-4 mb-4 fill-current text-gray-500 cursor-pointer"
						onClick={onToggle}
					/>
				) : (
					<FaChevronDown
						className="w-4 h-4 mb-4 fill-current text-gray-500 cursor-pointer"
						onClick={onToggle}
					/>
				)}
			</div>
			<div
				className={`grid transition-all duration-500 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
					}`}
			>
				<div className={contentClassName}>{children}</div>
			</div>
		</section>
	);
}

