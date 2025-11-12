import { MobileNavLink } from "./MobileNavLink";
import type { NavCategory, NavLink } from "@/types/navBar";
import { ExpandableNavItem } from "./ExpandableNavItem";

interface NavigationLinksProps {
	onLinkClick?: () => void;
}

export const NavigationLinks = ({ onLinkClick }: NavigationLinksProps) => {
	const NewsItems: NavCategory = {
		label: "News",
		links: [
			{ to: "/world", label: "World" },
			{ to: "/lifestyle", label: "Lifestyle" },
			{ to: "/science", label: "Science" },
			{ to: "/technology", label: "Technology" },
			{ to: "/business", label: "Business" },
			{ to: "/sport", label: "Sport" },
			{ to: "/politics", label: "Politics" },
			{ to: "/other", label: "Other" },
		],
	};
	const NavHome: NavLink = { to: "/", label: "Home" };
	const NavItems: NavLink[] = [
		{ to: "/about", label: "About" },
		{ to: "/contact", label: "Contact" },
		{ to: "/search", label: "Search" },
	];

	return (
		<div className="space-y-4">
			<MobileNavLink
				key={NavHome.to}
				linkTo={NavHome.to}
				linkLabel={NavHome.label}
				onLinkClick={onLinkClick}
			/>
			<ExpandableNavItem NavLinks={NewsItems} onLinkClick={onLinkClick} />
			{NavItems.map((link) => (
				<MobileNavLink
					key={link.to}
					linkTo={link.to}
					linkLabel={link.label}
					onLinkClick={onLinkClick}
				/>
			))}
		</div>
	);
};
