import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();

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
						{t("FILTER.DATE_RANGE")}
					</option>
					<option value="all">{t("FILTER.ALL_TIME")}</option>
					<option value="24h">{t("FILTER.LAST_24_HOURS")}</option>
					<option value="7d">{t("FILTER.LAST_7_DAYS")}</option>
					<option value="30d">{t("FILTER.LAST_30_DAYS")}</option>
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
						{t("FILTER.SORT_BY")}
					</option>
					<option value="newest">{t("FILTER.NEWEST")}</option>
					<option value="mostViewed">{t("FILTER.MOST_VIEWED")}</option>
				</select>
				<div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
					<BsChevronDown className="w-3 h-3 fill-current text-gray-600" />
				</div>
			</div>
		</div>
	);
}
