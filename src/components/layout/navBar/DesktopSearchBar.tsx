import { useTranslation } from "react-i18next";
import { LuSearch, LuX } from "react-icons/lu";

import type { SearchProps } from "@/types/navBarTypes";

export const DesktopSearchBar = ({
	searchClicked,
	query,
	onSearchToggle,
	onQueryChange,
	onSubmit,
}: SearchProps) => {
	const { t } = useTranslation();

	return (
		<div className="relative flex items-center">
			{/* Search form trigger — a real button (keyboard-operable) */}
			{!searchClicked && (
				<button
					type="button"
					aria-label={t("NAVIGATION.SEARCH_PLACEHOLDER")}
					aria-expanded={false}
					onClick={() => onSearchToggle(true)}
					className="cursor-pointer rounded outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
				>
					<LuSearch className="w-6 h-6" />
				</button>
			)}

			{/* Expanded search form */}
			<form
				onSubmit={onSubmit}
				className={`flex items-center overflow-hidden bg-card border border-border-subtle rounded-md transition-all duration-300 ease-in-out ${
					searchClicked ? "w-64 px-2 opacity-100" : "w-0 px-0 opacity-0 border-transparent"
				}`}
			>
				<button type="submit" aria-label={t("NAVIGATION.SEARCH_PLACEHOLDER")}>
					<LuSearch className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground flex-shrink-0" />
				</button>
				<input
					id="desktop-search"
					name="q"
					aria-label={t("NAVIGATION.SEARCH_PLACEHOLDER")}
					type="text"
					value={query}
					onChange={(e) => onQueryChange(e.target.value)}
					placeholder={t("NAVIGATION.SEARCH_PLACEHOLDER")}
					className="min-w-0 flex-1 px-2 py-1 outline-none bg-transparent text-foreground-secondary placeholder:text-muted-foreground"
					autoFocus={searchClicked}
				/>
				<LuX
					className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground flex-shrink-0"
					onClick={() => {
						onSearchToggle(false);
						onQueryChange("");
					}}
				/>
			</form>
		</div>
	);
};
