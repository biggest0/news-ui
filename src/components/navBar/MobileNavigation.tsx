import { Logo } from "@/components/common/Logo";
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
			<Logo size="sm" />

			{/* Center - App Title */}
			<AppTitle variant="mobile" />

			{/* Right - Hamburger */}
			<HamburgerButton isOpen={menuOpen} onClick={onMenuToggle} />
		</div>
	);
};
