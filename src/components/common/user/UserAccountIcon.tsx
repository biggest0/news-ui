import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";

import { MobileNavLink } from "@/components/layout/navBar/MobileNavLink";

interface UserAccountProps {
	variant?: "icon" | "full";
	onLinkClick?: () => void;
}

export const UserAccountIcon = ({
	variant = "icon",
	onLinkClick,
}: UserAccountProps) => {
	const { t } = useTranslation();

	if (variant === "icon") {
		// Icon display
		return (
			<Link to="/account">
				<LuUserRound
					className="w-6 h-6 hover:text-black cursor-pointer transition-colors"
					onClick={onLinkClick}
				/>
			</Link>
		);
	}

	// Text display
	return (
		<MobileNavLink
			key="/account"
			linkTo="/account"
			linkLabel={t("ACCOUNT.ACCOUNT_LABEL")}
			onLinkClick={onLinkClick}
		/>
	);
};
