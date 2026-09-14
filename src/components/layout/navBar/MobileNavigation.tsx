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
			{/* Left - Logo. "sm" keeps the house glyph in scale with the hamburger
			    opposite it; AppLogo still occupies a 24px box, which is what keeps
			    the centred wordmark on the header's midline (with justify-between,
			    unequal end widths shift it by half the difference). */}
			<AppLogo size="sm" />

			{/* Center - App Title */}
			<AppTitle variant="mobile" />

			{/* Right - Hamburger */}
			<HamburgerButton ref={menuButtonRef} isOpen={menuOpen} onClick={onMenuToggle} />
		</div>
	);
};
