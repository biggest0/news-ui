import { AppLogo } from "@/components/common/brand/AppLogo";
import { AppTitle } from "./AppTitle";
import { SearchBar } from "./SearchBar";
import { UserAccountIcon } from "@/components/common/user/UserAccountIcon";
import type { SearchProps } from "@/types/navBar";

export const DesktopNavigation = (props: SearchProps) => {
	return (
		<div className="hidden md:flex w-full items-center justify-between">
			{/* Left - Logo */}
			<AppLogo size="md" />

			{/* Center - App Title */}
			<AppTitle variant="desktop" />

			{/* Right - Search and User */}
			<div className="flex gap-4 items-center text-gray-600">
				<SearchBar {...props} />
				<UserAccountIcon variant="icon" />
			</div>
		</div>
	);
};
