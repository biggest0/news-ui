import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSearch } from "react-icons/lu";

import { buildSearchUrl } from "@/utils/search/searchUrlUtils";
import DateRangeFilter from "./DateRangeFilter";
import SortByFilter from "./SortByFilter";

interface SearchSectionProps {
	query: string;
	dateRange: string;
	sortBy: string;
}

export default function SearchSection({
	query,
	dateRange,
	sortBy,
}: SearchSectionProps) {
	const navigate = useNavigate();

	const [input, setInput] = useState(query ?? "");

	useEffect(() => {
		setInput(query);
	}, [query]);

	const updateUrl = (q: string, dateRange: string, sort: string) => {
		navigate(buildSearchUrl({ query: q, dateRange, sortBy: sort }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			// Navigate to new URL - useSearchArticles hook will handle the API call
			navigate(
				buildSearchUrl({
					query: input,
					dateRange,
					sortBy,
				})
			);
		}
	};

	return (
		<section className="w-full flex flex-col justify-center items-center py-4 h-48 bg-gray-50">
			{/* Search bar */}
			<form
				onSubmit={handleSubmit}
				className="flex items-center w-full max-w-md border-b overflow-hidden mb-4"
			>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Search articles..."
					className="flex-grow py-2 outline-none text-gray-700 text-2xl"
				/>
				<button
					type="submit"
					className="text-gray-400 px-4 py-2 hover:text-black transition cursor-pointer"
				>
					<LuSearch />
				</button>
			</form>

			{/* Filter bar */}
			<div className="flex justify-start gap-8 w-full max-w-md text-sm text-gray-600">
				<DateRangeFilter
					value={dateRange}
					onChange={(value) => updateUrl(query, value, sortBy)}
				/>
				<SortByFilter
					value={sortBy}
					onChange={(value) => updateUrl(query, dateRange, value)}
				/>
			</div>
		</section>
	);
}
