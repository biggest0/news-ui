import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";

import { MobileNavLink } from "@/components/layout/navBar/MobileNavLink";
import { useAuth } from "@/contexts/AuthContext";

interface UserAccountProps {
	variant?: "icon" | "full";
	onLinkClick?: () => void;
}

export const UserAccountIcon = ({
	variant = "icon",
	onLinkClick,
}: UserAccountProps) => {
	const { t } = useTranslation();
	const { isAuthenticated } = useAuth();

	const linkTo = isAuthenticated ? "/account" : "/login";

	if (variant === "icon") {
		return (
			<Link to={linkTo}>
				<LuUserRound
					className="w-6 h-6 hover:text-primary cursor-pointer transition-colors"
					onClick={onLinkClick}
				/>
			</Link>
		);
	}

	return (
		<MobileNavLink
			key={linkTo}
			linkTo={linkTo}
			linkLabel={isAuthenticated ? t("ACCOUNT.ACCOUNT_LABEL") : t("AUTH.LOGIN")}
			onLinkClick={onLinkClick}
		/>
	);
};
