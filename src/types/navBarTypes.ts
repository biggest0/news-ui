export interface SearchProps {
	searchClicked: boolean;
	query: string;
	onSearchToggle: (value: boolean) => void;
	onQueryChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
}

export interface MobileMenuProps {
	menuOpen: boolean;
	/** Element to return focus to when the drawer closes (the hamburger). */
	returnFocusRef?: React.RefObject<HTMLElement | null>;
	onMenuToggle: () => void;
	onMenuClose: () => void;
	query: string;
	onQueryChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
}

export interface NavLink {
	to: string;
	label: string;
}

export interface NavCategory {
	label: string;
	links: NavLink[];
}
