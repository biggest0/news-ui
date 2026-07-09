import { FaChevronDown } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import { SectionHeader } from "@/components/common/layout/SectionHeader";

interface ExpandableSectionProps {
	title: string;
	isExpanded: boolean;
	onToggle: () => void;
	children: React.ReactNode;
	contentClassName?: string;
}

/**
 * Mobile-only collapsible section with a header and chevron toggle. The
 * toggle is a real button (keyboard-operable, aria-expanded) — previously it
 * was an onClick on a bare SVG.
 */
export function ExpandableSection({
	title,
	isExpanded,
	onToggle,
	children,
	contentClassName = "",
}: ExpandableSectionProps) {
	const { t } = useTranslation();

	return (
		<section className="md:hidden pb-6 border-b border-border">
			<div className="flex flex-row items-center space-x-4">
				<SectionHeader title={title} />
				<button
					type="button"
					aria-expanded={isExpanded}
					aria-label={isExpanded ? t("DROPDOWN.COLLAPSE") : t("DROPDOWN.EXPAND")}
					onClick={onToggle}
					className="mb-4 cursor-pointer rounded text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
				>
					<FaChevronDown
						className={`h-4 w-4 fill-current transition-transform duration-200 ${
							isExpanded ? "rotate-180" : ""
						}`}
					/>
				</button>
			</div>
			<div
				className={`grid transition-all duration-500 ease-in-out ${
					isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				}`}
			>
				<div className={contentClassName}>{children}</div>
			</div>
		</section>
	);
}
