import { BsChevronDown } from "react-icons/bs";

interface DateRangeFilterProps {
	value: string;
	onChange: (value: string) => void;
}

export default function DateRangeFilter({
	value,
	onChange,
}: DateRangeFilterProps) {
	return (
		<div className="relative">
			<select
				value={value}
				className="py-1 font-medium text-gray-700 appearance-none pr-6"
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="" disabled>
					Date Range
				</option>
				<option value="all">All Time</option>
				<option value="24h">Last 24 hours</option>
				<option value="7d">Last 7 days</option>
				<option value="30d">Last 30 days</option>
			</select>
			<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
				<BsChevronDown className="w-3 h-3 fill-current text-gray-600" />
			</div>
		</div>
	);
}
