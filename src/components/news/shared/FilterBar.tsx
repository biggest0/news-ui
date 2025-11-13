import { BsChevronDown } from "react-icons/bs";

interface FilterBarProps {
	dateRange: string;
	sortBy: string;
	onDateRangeChange: (value: string) => void;
	onSortByChange: (value: string) => void;
}

export function FilterBar({
	dateRange,
	sortBy,
	onDateRangeChange,
	onSortByChange,
}: FilterBarProps) {
	return (
		<div className="flex gap-8 pb-4 text-sm text-gray-600">
			{/* Date Range */}
			<div className="relative">
				<select
					value={dateRange}
					className="py-1 font-medium text-gray-700 appearance-none pr-4"
					onChange={(e) => onDateRangeChange(e.target.value)}
				>
					<option value="" disabled>
						Date Range
					</option>
					<option value="all">All Time</option>
					<option value="24h">Last 24 hours</option>
					<option value="7d">Last 7 days</option>
					<option value="30d">Last 30 days</option>
				</select>
				<div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
					<BsChevronDown className="w-3 h-3 fill-current text-gray-600" />
				</div>
			</div>

			{/* Sort By */}
			<div className="relative">
				<select
					value={sortBy}
					className="py-1 font-medium text-gray-700 appearance-none pr-4"
					onChange={(e) => onSortByChange(e.target.value)}
				>
					<option value="" disabled>
						Sort By
					</option>
					<option value="newest">Newest</option>
					<option value="mostViewed">Most Viewed</option>
				</select>
				<div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
					<BsChevronDown className="w-3 h-3 fill-current text-gray-600" />
				</div>
			</div>
		</div>
	);
}
