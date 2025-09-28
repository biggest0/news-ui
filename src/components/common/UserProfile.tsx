import { LuUserRound } from "react-icons/lu";

import { MobileNavLink } from "@/components/navBar/MobileNavLink";

interface UserProfileProps {
	variant?: "icon" | "full";
	onLinkClick?: () => void;
}

export const UserProfile = ({
	variant = "icon",
	onLinkClick,
}: UserProfileProps) => {
	if (variant === "icon") {
		// Icon display
		return (
			<LuUserRound
				className="w-5 h-5 hover:text-black cursor-pointer transition-colors"
				onClick={onLinkClick}
			/>
		);
	}

	// Text display
	return (
		<MobileNavLink
			key="/profile"
			linkTo="/profile"
			linkLabel="Profile"
			onClick={onLinkClick}
		/>
	);
};
