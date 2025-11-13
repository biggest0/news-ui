import { AppLogo } from "@/components/common/brand/AppLogo";
import { AppTitle } from "./AppTitle";
import { HamburgerButton } from "./HamburgerButton";

interface MobileNavigationProps {
	menuOpen: boolean;
	onMenuToggle: () => void;
}

export const MobileNavigation = ({
	menuOpen,
	onMenuToggle,
}: MobileNavigationProps) => {
	return (
		<div className="md:hidden w-full flex items-center justify-between">
			{/* Left - Logo */}
			<AppLogo size="sm" />

			{/* Center - App Title */}
			<AppTitle variant="mobile" />

			{/* Right - Hamburger */}
			<HamburgerButton isOpen={menuOpen} onClick={onMenuToggle} />
		</div>
	);
};
