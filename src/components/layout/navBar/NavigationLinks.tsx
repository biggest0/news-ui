import { useTranslation } from "react-i18next";

import { MobileNavLink } from "./MobileNavLink";
import type { NavCategory, NavLink } from "@/types/navBarTypes";
import { ExpandableNavItem } from "./ExpandableNavItem";

interface NavigationLinksProps {
	onLinkClick?: () => void;
}

export const NavigationLinks = ({ onLinkClick }: NavigationLinksProps) => {
	const { t } = useTranslation();

	const NewsItems: NavCategory = {
		label: t("NAVIGATION.NEWS"),
		links: [
			{ to: "/world", label: t("CATEGORY.WORLD") },
			{ to: "/lifestyle", label: t("CATEGORY.LIFESTYLE") },
			{ to: "/science", label: t("CATEGORY.SCIENCE") },
			{ to: "/technology", label: t("CATEGORY.TECHNOLOGY") },
			{ to: "/business", label: t("CATEGORY.BUSINESS") },
			{ to: "/sport", label: t("CATEGORY.SPORT") },
			{ to: "/politics", label: t("CATEGORY.POLITICS") },
			{ to: "/other", label: t("CATEGORY.OTHER") },
		],
	};
	const NavHome: NavLink = { to: "/", label: t("NAVIGATION.HOME") };
	const NavItems: NavLink[] = [
		{ to: "/about", label: t("NAVIGATION.ABOUT") },
		{ to: "/contact", label: t("NAVIGATION.CONTACT") },
		{ to: "/search", label: t("NAVIGATION.SEARCH") },
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
