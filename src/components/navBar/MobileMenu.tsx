import { LuX } from "react-icons/lu";
import type { MobileMenuProps } from "@/types/navBar";
import { MobileSearchBar } from "@/components/navBar/MobileSearchBar";
import { NavigationLinks } from "./NavigationLinks";
import { UserProfile } from "@/components/common/UserProfile";

export const MobileMenu = ({
	menuOpen,
	onMenuClose,
	query,
	onQueryChange,
	onSubmit,
}: MobileMenuProps) => {
	return (
		<>
			{/* Overlay */}
			{/* <div
				className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 md:hidden ${
					menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
				}`}
				onClick={onMenuClose}
			/> */}

			{/* Menu Panel */}
			<div
				className={`fixed top-0 right-0 h-full w-full bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
					menuOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="p-4">
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
						<UserProfile variant="full" onLinkClick={onMenuClose} />
					</div>
				</div>
			</div>
		</>
	);
};
