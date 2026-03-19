import { useAppSettings } from "@/contexts/AppSettingContext";
import { HiSun, HiMoon } from "react-icons/hi";

interface ThemeToggleProps {
	showLabel?: boolean;
	className?: string;
}

export default function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
	const { isDarkMode, toggleDarkMode } = useAppSettings();

	if (showLabel) {
		return (
			<button
				onClick={toggleDarkMode}
				className={`flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-hover-bg text-secondary ${className}`}
				aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
				title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
			>
				{isDarkMode ? (
					<HiMoon className="w-5 h-5" />
				) : (
					<HiSun className="w-5 h-5" />
				)}
				<span className="text-sm font-medium">
					{isDarkMode ? "Light" : "Dark"}
				</span>
			</button>
		);
	}

	return (
		<button
			onClick={toggleDarkMode}
			className={`cursor-pointer transition-colors hover:text-primary ${className}`}
			aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
			title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
		>
			{isDarkMode ? (
				<HiMoon className="w-6 h-6" />
			) : (
				<HiSun className="w-6 h-6" />
			)}
		</button>
	);
}
