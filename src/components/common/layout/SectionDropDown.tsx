import { useEffect, useRef, useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

export interface DropDownOption {
	label: string;
	onClick: () => void;
	icon?: React.ReactNode;
	className?: string;
	isDivider?: boolean;
}

export interface SectionDropDownProps {
	options: DropDownOption[];
}

export const SectionDropDown = ({ options = [{label: 'hello', onClick: ()=> console.log('hello world')}] }: SectionDropDownProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
					className={`absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50`}
				>
					<div className="py-1">
						{options.map((option, index) =>
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
	);
};
