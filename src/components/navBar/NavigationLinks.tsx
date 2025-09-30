import { MobileNavLink } from "@/components/navBar/MobileNavLink";

interface NavigationLinksProps {
	onLinkClick?: () => void;
}

export const NavigationLinks = ({ onLinkClick }: NavigationLinksProps) => {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/about", label: "About" },
		{ to: "/contact", label: "Contact" },
		{ to: "/search", label: "Search" },
	];

	return (
		<div className="space-y-4">
			{links.map((link) => (
				<MobileNavLink
					key={link.to}
					linkTo={link.to}
					linkLabel={link.label}
					onClick={onLinkClick}
				/>
			))}
		</div>
	);
};
