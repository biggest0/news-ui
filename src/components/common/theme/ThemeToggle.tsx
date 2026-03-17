import { useAppSettings } from "@/contexts/AppSettingContext";
import { HiSun, HiMoon } from "react-icons/hi";

interface ThemeToggleProps {
	showLabel?: boolean;
	className?: string;
}

export default function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
	const { isDarkMode, toggleDarkMode } = useAppSettings();

	return (
		<button
			onClick={toggleDarkMode}
			className={`
				flex items-center gap-2 p-2 rounded-lg
				transition-all duration-200 ease-in-out
				hover:bg-hover-bg
				text-secondary
				focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
				dark:focus:ring-offset-slate-800
				${className}
			`}
			aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
			title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
		>
			{isDarkMode ? (
				<HiMoon className="w-5 h-5 text-secondary" />
			) : (
				<HiSun className="w-5 h-5 text-accent-bg" />
			)}
			{showLabel && (
				<span className="text-sm font-medium">
					{isDarkMode ? "Light" : "Dark"}
				</span>
			)}
		</button>
	);
}


