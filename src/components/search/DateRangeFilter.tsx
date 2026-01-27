import { useTranslation } from "react-i18next";
import { BsChevronDown } from "react-icons/bs";

interface DateRangeFilterProps {
	value: string;
	onChange: (value: string) => void;
}

export default function DateRangeFilter({
	value,
	onChange,
}: DateRangeFilterProps) {
	const { t } = useTranslation();

	return (
		<div className="relative">
			<select
				value={value}
				className="py-1 font-medium text-gray-700 appearance-none pr-6"
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="" disabled>
					{t("FILTER.ALL_TIME")}
				</option>
				<option value="all">{t("FILTER.ALL_TIME")}</option>
				<option value="24h">{t("FILTER.LAST_24_HOURS")}</option>
				<option value="7d">{t("FILTER.LAST_7_DAYS")}</option>
				<option value="30d">{t("FILTER.LAST_30_DAYS")}</option>
			</select>
			<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
				<BsChevronDown className="w-3 h-3 fill-current text-gray-600" />
			</div>
		</div>
	);
}
