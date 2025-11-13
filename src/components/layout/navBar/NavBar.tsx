import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

import { loadArticlesInfoBySearch } from "@/store/articlesSlice";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { MobileMenu } from "./MobileMenu";

export default function NavBar() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	const [searchClicked, setSearchClicked] = useState(false);
	const [query, setQuery] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);

  // Handle search submit
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (menuOpen) {
			setMenuOpen(false);
		}

		if (query.trim()) {
			dispatch(loadArticlesInfoBySearch({ page: 1, search: query }));
			navigate(`/search?q=${encodeURIComponent(query)}`);
			setSearchClicked(false);
		}
	};

	const searchProps = {
		searchClicked,
		query,
		onSearchToggle: setSearchClicked,
		onQueryChange: setQuery,
		onSubmit: handleSubmit,
	};

	const mobileMenuProps = {
		menuOpen,
		onMenuToggle: () => setMenuOpen(!menuOpen),
		onMenuClose: () => setMenuOpen(false),
		query,
		onQueryChange: setQuery,
		onSubmit: handleSubmit,
	};

	return (
		<nav className="w-full z-20 py-3 flex items-center justify-between relative">
			<DesktopNavigation {...searchProps} />
			<MobileNavigation
				menuOpen={menuOpen}
				onMenuToggle={() => setMenuOpen(!menuOpen)}
			/>
			<MobileMenu {...mobileMenuProps} />
		</nav>
	);
}
