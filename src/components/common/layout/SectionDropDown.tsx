import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

export const SectionDropDown = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<div>
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
		</div>
	);
};
