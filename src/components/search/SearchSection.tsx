import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuSearch } from "react-icons/lu";

import { buildSearchUrl, type SearchType } from "@/utils/search/searchUrlUtils";
import DateRangeFilter from "./DateRangeFilter";
import SortByFilter from "./SortByFilter";
import SearchTypeFilter from "./SearchTypeFilter";

interface SearchSectionProps {
	query: string;
	dateRange: string;
	sortBy: string;
	searchType: SearchType;
}

export default function SearchSection({
	query,
	dateRange,
	sortBy,
	searchType,
}: SearchSectionProps) {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [input, setInput] = useState(query ?? "");

	useEffect(() => {
		setInput(query);
	}, [query]);

	const updateUrl = (q: string, dr: string, sort: string, type: SearchType) => {
		navigate(buildSearchUrl({ query: q, dateRange: dr, sortBy: sort, searchType: type }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			navigate(
				buildSearchUrl({
					query: input,
					dateRange,
					sortBy,
					searchType,
				})
			);
		}
	};

	return (
		<section className="w-full flex flex-col justify-center items-center py-4 h-48 bg-surface">
			{/* Search bar */}
			<form
				onSubmit={handleSubmit}
				className="flex items-center w-full max-w-md border-b border-border overflow-hidden mb-4"
			>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={t("FILTER.SEARCH_ARTICLES_PLACEHOLDER")}
					className="flex-grow py-2 outline-none text-secondary bg-transparent text-2xl"
				/>
				<button
					type="submit"
					className="text-muted px-4 py-2 hover:text-primary transition cursor-pointer"
				>
					<LuSearch />
				</button>
			</form>

			{/* Filter bar */}
			<div className="flex justify-start gap-8 w-full max-w-md text-sm text-secondary">
				<SearchTypeFilter
					value={searchType}
					onChange={(value) => updateUrl(query, dateRange, sortBy, value)}
				/>
				<DateRangeFilter
					value={dateRange}
					onChange={(value) => updateUrl(query, value, sortBy, searchType)}
				/>
				<SortByFilter
					value={sortBy}
					onChange={(value) => updateUrl(query, dateRange, value, searchType)}
				/>
			</div>
		</section>
	);
}
