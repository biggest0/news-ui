import { useEffect } from "react";
import { LuSearch } from "react-icons/lu";
import { useLocation } from "react-router-dom";

interface MobileSearchBarProps {
	query: string;
	onQueryChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
}

export const MobileSearchBar = ({
	query,
	onQueryChange,
	onSubmit,
}: MobileSearchBarProps) => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const urlQuery = params.get("q") || "";

	useEffect(() => {
		onQueryChange(urlQuery);
	}, [urlQuery]);

	return (
		<div className="mb-6">
			<form
				onSubmit={onSubmit}
				className="flex items-center border rounded-md px-3 py-2"
			>
				<LuSearch className="w-4 h-4 text-gray-400 mr-2" />
				<input
					type="text"
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					placeholder="Search..."
					className="flex-1 outline-none text-gray-700 placeholder-gray-400"
				/>
			</form>
		</div>
	);
};
