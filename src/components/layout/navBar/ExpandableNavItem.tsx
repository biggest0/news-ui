import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

import type { NavCategory } from "@/types/navBarTypes";
import { MobileNavLink } from "./MobileNavLink";

interface ExpandableNavItemProps {
	NavLinks: NavCategory;
	onLinkClick?: () => void;
}

export const ExpandableNavItem = ({
	NavLinks,
	onLinkClick,
}: ExpandableNavItemProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				className={`w-full flex items-center justify-between py-2 px-4 text-left hover:bg-gray-50 rounded-lg transition-colors
          ${isOpen ? "underline" : ""}`}
			>
				<span className="font-medium text-gray-700">{NavLinks.label}</span>
				<LuChevronDown
					className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			<div
				className={`overflow-hidden transition-all duration-200 ml-4 ${
					isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				{NavLinks.links.map((link) => (
					<MobileNavLink
						key={link.to}
						linkTo={link.to}
						linkLabel={link.label}
						onLinkClick={onLinkClick}
					/>
				))}
			</div>
		</div>
	);
};
