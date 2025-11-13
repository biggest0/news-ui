import { LuSearch, LuX } from "react-icons/lu";
import type { SearchProps } from "@/types/navBar";

export const DesktopSearchBar = ({
	searchClicked,
	query,
	onSearchToggle,
	onQueryChange,
	onSubmit,
}: SearchProps) => {
	return (
		<div className="relative flex items-center">
			{/* Search form trigger icon */}
			{!searchClicked && (
				<LuSearch
					className="w-6 h-6 cursor-pointer transition-colors duration-200 hover:text-black"
					onClick={() => onSearchToggle(true)}
				/>
			)}

			{/* Expanded search form */}
			<form
				onSubmit={onSubmit}
				className={`flex items-center border overflow-hidden bg-white transition-all duration-300 ease-in-out ${
					searchClicked ? "w-64 px-2 opacity-100" : "w-0 px-0 opacity-0"
				}`}
			>
				<button type="submit">
					<LuSearch className="w-4 h-4 text-gray-400 cursor-pointer hover:text-black flex-shrink-0" />
				</button>
				<input
					type="text"
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					placeholder="Search..."
					className="min-w-0 flex-1 px-2 py-1 outline-none text-gray-700 placeholder-gray-400"
					autoFocus={searchClicked}
				/>
				<LuX
					className="w-4 h-4 text-gray-400 cursor-pointer hover:text-black flex-shrink-0"
					onClick={() => {
						onSearchToggle(false);
						onQueryChange("");
					}}
				/>
			</form>
		</div>
	);
};
