import { SectionHeader } from "./SectionHeader";
import { useEffect, useRef, useState } from "react";
import { useSectionDropdown } from "@/hooks/useSectionDropdown";
import type { SectionToggleState } from "@/types/localStorageTypes";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

interface SectionHeaderExpandableProps {
	title: string;
	section: keyof SectionToggleState;
}

export interface DropDownOption {
	label: string;
	onClick: () => void;
	icon?: React.ReactNode;
	className?: string;
	isDivider?: boolean;
}

export const SectionHeaderExpandable = ({
	title,
	section,
}: SectionHeaderExpandableProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const dropDownOptions = useSectionDropdown(section);

	// Close dropdown when clicking outside dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsExpanded(false);
			}
		};

		if (isExpanded) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isExpanded]);

	const handleOptionClick = (option: DropDownOption) => {
		option.onClick();
		setIsExpanded(false);
	};

	return (
		<div className="flex flex-row items-center space-x-4">
			{/* Header */}
			<SectionHeader title={title} />

			{/* Dropdown options */}
			<div className="relative" ref={dropdownRef}>
				{isExpanded ? (
					<FaChevronUp
						className="w-4 h-4 mb-4 fill-current text-gray-500 cursor-pointer"
						onClick={() => setIsExpanded(false)}
					/>
				) : (
					<FaChevronDown
						className="w-4 h-4 mb-4 fill-current text-gray-500 cursor-pointer"
						onClick={() => setIsExpanded(true)}
					/>
				)}
				{isExpanded && (
					<div
						className={`absolute top-6 left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50`}
					>
						<div className="py-1">
							{dropDownOptions.map((option, index) =>
								option.isDivider ? (
									<div
										key={`divider-${index}`}
										className="border-t border-gray-200 my-1"
									/>
								) : (
									<button
										key={`${option.label}-${index}`}
										onClick={() => handleOptionClick(option)}
										className={
											option.className ||
											"w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
										}
									>
										{option.icon && (
											<span className="w-4 h-4">{option.icon}</span>
										)}
										{option.label}
									</button>
								)
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
