import { useTranslation } from "react-i18next";
import { BsChevronDown } from "react-icons/bs";

interface SortByFilterProps {
	value: string;
	onChange: (value: string) => void;
}

export default function SortByFilter({ value, onChange }: SortByFilterProps) {
	const { t } = useTranslation();
	
	return (
		<div className="relative">
			<select
				value={value}
				className="py-1 font-medium text-gray-700 appearance-none pr-6"
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="" disabled>
					{t("FILTER.SORT_BY")}
				</option>
				<option value="newest">{t("FILTER.NEWEST")}</option>
				<option value="relevant">{t("FILTER.RELEVANT")}</option>
			</select>
			<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
				<BsChevronDown className="w-3 h-3 fill-current text-gray-600" />
			</div>
		</div>
	);
}
