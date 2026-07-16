import { AppLogo } from "@/components/common/brand/AppLogo";
import { AppTitle } from "@/components/layout/navBar/AppTitle";
import { HamburgerButton } from "@/components/layout/navBar/HamburgerButton";

interface MobileNavigationProps {
	menuOpen: boolean;
	onMenuToggle: () => void;
	/** Forwarded to the hamburger so the drawer can return focus to it. */
	menuButtonRef?: React.Ref<HTMLButtonElement>;
}

export const MobileNavigation = ({
	menuOpen,
	onMenuToggle,
	menuButtonRef,
}: MobileNavigationProps) => {
	return (
		<div className="md:hidden w-full flex items-center justify-between">
			{/* Left - Logo */}
			<AppLogo size="sm" />

			{/* Center - App Title */}
			<AppTitle variant="mobile" />

			{/* Right - Hamburger */}
			<HamburgerButton ref={menuButtonRef} isOpen={menuOpen} onClick={onMenuToggle} />
		</div>
	);
};
