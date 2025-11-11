import { BsChevronDown } from "react-icons/bs";

interface SortByFilterProps {
	value: string;
	onChange: (value: string) => void;
}

export default function SortByFilter({ value, onChange }: SortByFilterProps) {
	return (
		<div className="relative">
			<select
				value={value}
				className="py-1 font-medium text-gray-700 appearance-none pr-6"
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="" disabled>
					Sort By
				</option>
				<option value="relevant">Relevant</option>
				<option value="newest">Newest</option>
			</select>
			<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
				<BsChevronDown className="w-3 h-3 fill-current text-gray-600" />
			</div>
		</div>
	);
}

