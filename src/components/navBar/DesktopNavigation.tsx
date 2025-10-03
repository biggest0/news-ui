import { Logo } from "@/components/common/Logo";
import { AppTitle } from "./AppTitle";
import { SearchBar } from "./SearchBar";
import { UserAccount } from "@/components/common/UserAccount";
import type { SearchProps } from "@/types/navBar";

export const DesktopNavigation = (props: SearchProps) => {
	return (
		<div className="hidden md:flex w-full items-center justify-between">
			{/* Left - Logo */}
			<Logo size="md" />

			{/* Center - App Title */}
			<AppTitle variant="desktop" />

			{/* Right - Search and User */}
			<div className="flex gap-4 items-center text-gray-600">
				<SearchBar {...props} />
				<UserAccount variant="icon" />
			</div>
		</div>
	);
};
