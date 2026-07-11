import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";
import { MobileMenu } from "./MobileMenu";

export default function NavBar() {
	const navigate = useNavigate();

	const [searchClicked, setSearchClicked] = useState(false);
	const [query, setQuery] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);
	// drawer returns focus here on close (finalFocus)
	const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle search submit
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (menuOpen) {
			setMenuOpen(false);
		}

		if (query.trim()) {
			// navigation is enough — SearchPage's RTK Query hook fetches from the URL
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
		returnFocusRef: menuButtonRef,
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
				menuButtonRef={menuButtonRef}
			/>
			<MobileMenu {...mobileMenuProps} />
		</nav>
	);
}
