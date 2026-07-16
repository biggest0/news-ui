import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LuX } from "react-icons/lu";

import type { MobileMenuProps } from "@/types/navBarTypes";
import { Sheet, SheetContent } from "@/components/ui/Sheet";
import { MobileSearchBar } from "@/components/layout/navBar/MobileSearchBar";
import { NavigationLinks } from "@/components/layout/navBar/NavigationLinks";
import { UserAccountIcon } from "@/components/common/user/UserAccountIcon";
import SocialMediaLinks from "@/components/common/social/SocialMediaLinks";
import { APP_VERSION } from "@/config/config";
import LanguageSwitcher from "@/components/layout/navBar/LanguageSwitcherMobile";
import ThemeToggle from "@/components/common/theme/ThemeToggle";

/**
 * Full-screen mobile navigation drawer. Built on the Sheet primitive
 * (base-ui Dialog) since M5.5 — focus trap, Escape close, aria-modal, body
 * scroll lock, and focus return come from the primitive. The swipe-right-to-
 * close gesture (with live drag offset) is preserved on top of it.
 */
export const MobileMenu = ({
	menuOpen,
	returnFocusRef,
	onMenuClose,
	query,
	onQueryChange,
	onSubmit,
}: MobileMenuProps) => {
	const { t } = useTranslation();
	const location = useLocation();
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState(0);

	// Minimum swipe distance (in px) to trigger close
	const minSwipeDistance = 100;
	// Left edge zone for browser back navigation (in px)
	const leftEdgeZone = 20;

	// Close menu on browser back/forward navigation. Deliberately keyed on
	// location ONLY: this is a "navigation happened" event — adding menuOpen
	// to the deps would re-fire when the menu opens and close it immediately.
	useEffect(() => {
		if (menuOpen) onMenuClose();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	const handleTouchStart = (e: React.TouchEvent) => {
		if (e.targetTouches[0].clientX < leftEdgeZone) {
			return;
		}

		setTouchStart(e.targetTouches[0].clientX);
		setTouchEnd(e.targetTouches[0].clientX);
		setIsDragging(true);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging) return;

		const currentTouch = e.targetTouches[0].clientX;
		setTouchEnd(currentTouch);

		// Calculate drag offset (only allow dragging to the right)
		const offset = currentTouch - touchStart;
		if (offset > 0) {
			setDragOffset(offset);
		}
	};

	const handleTouchEnd = () => {
		setIsDragging(false);

		const swipeDistance = touchEnd - touchStart;

		// If swiped right beyond threshold, close menu
		if (swipeDistance > minSwipeDistance) {
			onMenuClose();
		}

		// Reset drag offset
		setDragOffset(0);
	};

	return (
		<Sheet open={menuOpen} onOpenChange={(open) => !open && onMenuClose()}>
			<SheetContent
				side="right"
				showCloseButton={false}
				finalFocus={returnFocusRef}
				aria-label={t("NAVIGATION.MENU_LABEL")}
				className={`data-[side=right]:w-full data-[side=right]:sm:max-w-none border-l-0 bg-background text-foreground-secondary md:hidden ${
					isDragging ? "transition-none" : ""
				}`}
				style={{
					transform:
						isDragging && menuOpen ? `translateX(${dragOffset}px)` : undefined,
				}}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div className="p-4 h-full flex flex-col justify-between overflow-y-auto">
					<div>
						{/* Top bar: theme toggle left, close button right */}
						<div className="flex justify-between items-center mb-6">
							<ThemeToggle />
							<button
								onClick={onMenuClose}
								aria-label={t("COMMON.CLOSE")}
								className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
							>
								<LuX className="w-5 h-5 text-muted-foreground" />
							</button>
						</div>

						{/* Search */}
						<MobileSearchBar
							query={query}
							onQueryChange={onQueryChange}
							onSubmit={onSubmit}
						/>
						{/* Navigation links */}
						<NavigationLinks onLinkClick={onMenuClose} />
						{/* User profile and theme */}
						<div className="border-t border-border-subtle pt-4 mt-6">
							<UserAccountIcon variant="full" onLinkClick={onMenuClose} />
							<div className="mt-4">
								<LanguageSwitcher />
							</div>
						</div>
						{/* Social media links */}
						<div className="border-t border-border-subtle pt-4 mt-6 flex justify-center">
							<SocialMediaLinks />
						</div>
					</div>

					{/* App version */}
					<div className="flex justify-end text-xs text-muted-foreground">
						{APP_VERSION}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
