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
			{/* Left - Logo. "md" (24px) rather than "sm" (20px) so it matches the
			    hamburger's 24px box on the right: with justify-between, unequal
			    end widths push the centred wordmark off the header's midline by
			    half the difference. */}
			<AppLogo size="md" />

			{/* Center - App Title */}
			<AppTitle variant="mobile" />

			{/* Right - Hamburger */}
			<HamburgerButton ref={menuButtonRef} isOpen={menuOpen} onClick={onMenuToggle} />
		</div>
	);
};
