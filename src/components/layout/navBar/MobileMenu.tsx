import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { LuX } from "react-icons/lu";

import type { MobileMenuProps } from "@/types/navBarTypes";
import { MobileSearchBar } from "./MobileSearchBar";
import { NavigationLinks } from "./NavigationLinks";
import { UserAccountIcon } from "@/components/common/user/UserAccountIcon";
import SocialMediaLinks from "@/components/common/social/SocialMediaLinks";
import { APP_VERSION } from "@/config/config";
import LanguageSwitcher from "./LanguageSwitcherMobile";

export const MobileMenu = ({
	menuOpen,
	onMenuClose,
	query,
	onQueryChange,
	onSubmit,
}: MobileMenuProps) => {
	const location = useLocation();
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState(0);

	// Minimum swipe distance (in px) to trigger close
	const minSwipeDistance = 100;
	// Left edge zone for browser back navigation (in px)
	const leftEdgeZone = 50;

	// Prevent body scroll when menu is open
	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [menuOpen]);

	// Close menu on browser back/forward navigation
	useEffect(() => {
		if (menuOpen) onMenuClose();
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
		<>
			{/* Menu Panel */}
			<div
				className={`fixed top-0 right-0 h-full w-full bg-white shadow-xl z-40 transform md:hidden ${isDragging ? "" : "transition-transform duration-300 ease-in-out"
					} ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
				style={{
					transform:
						isDragging && menuOpen ? `translateX(${dragOffset}px)` : undefined,
				}}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div className="p-4 h-full flex flex-col justify-between">
					<div>
						{/* Close button */}
						<div className="flex justify-end mb-6">
							<button
								onClick={onMenuClose}
								className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
							>
								<LuX className="w-5 h-5 text-gray-600" />
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
						{/* User profile */}
						<div className="border-t pt-4 mt-6">
							<UserAccountIcon variant="full" onLinkClick={onMenuClose} />
							<LanguageSwitcher />
						</div>
						{/* Social media links */}
						<div className="border-t pt-4 mt-6 flex justify-center">
							<SocialMediaLinks />
						</div>
					</div>

					{/* App version */}
					<div className="flex justify-end text-xs">{APP_VERSION}</div>
				</div>
			</div>
		</>
	);
};
