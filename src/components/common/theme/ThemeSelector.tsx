import { useAppSettings } from "@/contexts/AppSettingContext";
import type { ThemeMode } from "@/types/localStorageTypes";
import { HiSun, HiMoon, HiDesktopComputer } from "react-icons/hi";

interface ThemeSelectorProps {
	className?: string;
}

const themes: { mode: ThemeMode; icon: typeof HiSun; label: string }[] = [
	{ mode: "light", icon: HiSun, label: "Light" },
	{ mode: "dark", icon: HiMoon, label: "Dark" },
	{ mode: "system", icon: HiDesktopComputer, label: "System" },
];

export default function ThemeSelector({ className = "" }: ThemeSelectorProps) {
	const { appSetting, setThemeMode } = useAppSettings();
	const currentMode = appSetting.themeMode ?? "light";

	return (
		<div className={`flex items-center gap-1 p-1 rounded-lg bg-hover-bg ${className}`}>
			{themes.map(({ mode, icon: Icon, label }) => (
				<button
					key={mode}
					onClick={() => setThemeMode(mode)}
					className={`
						flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
						transition-all duration-200 ease-in-out
						focus:outline-none focus:ring-2 focus:ring-accent
						${currentMode === mode
							? "bg-control-active text-primary shadow-sm"
							: "text-muted hover:text-primary"
						}
					`}
					aria-label={`Switch to ${label} mode`}
					aria-pressed={currentMode === mode}
				>
					<Icon className="w-4 h-4" />
					<span className="hidden sm:inline">{label}</span>
				</button>
			))}
		</div>
	);
}


