import { useTranslation } from "react-i18next";
import { BsChevronDown } from "react-icons/bs";
import type { SearchType } from "@/utils/search/searchUrlUtils";

interface SearchTypeFilterProps {
	value: SearchType;
	onChange: (value: SearchType) => void;
}

export default function SearchTypeFilter({ value, onChange }: SearchTypeFilterProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-1">
			<div className="relative">
				<select
					value={value}
					className="py-1 font-medium text-secondary bg-transparent appearance-none pr-6"
					onChange={(e) => onChange(e.target.value as SearchType)}
				>
				<option value="" disabled>
					{t("FILTER.SEARCH_TYPE")}
				</option>
					<option value="keyword">{t("FILTER.KEYWORD")}</option>
					<option value="semantic">{t("FILTER.SEMANTIC")}</option>
				</select>
				<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
					<BsChevronDown className="w-3 h-3 fill-current text-muted" />
				</div>
			</div>
		</div>
	);
}
