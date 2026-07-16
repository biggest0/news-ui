import { useTranslation } from "react-i18next";

import { useAppSettings } from "@/contexts/AppSettingContext";
import type { ThemeMode } from "@/types/localStorageTypes";
import { HiSun, HiMoon, HiDesktopComputer } from "react-icons/hi";

interface ThemeSelectorProps {
	className?: string;
}

// `as const` keeps the label keys as literals so the typed t() accepts them
const themes = [
	{ mode: "light", icon: HiSun, labelKey: "THEME.LIGHT" },
	{ mode: "dark", icon: HiMoon, labelKey: "THEME.DARK" },
	{ mode: "system", icon: HiDesktopComputer, labelKey: "THEME.SYSTEM" },
] as const satisfies readonly { mode: ThemeMode; icon: typeof HiSun; labelKey: string }[];

/**
 * Segmented light/dark/system control. Kept hand-rolled by design (M5.5
 * keep-native verdict): plain buttons with aria-pressed are already
 * accessible — no popup/focus machinery needed. Labels localized in M5.5.
 */
export default function ThemeSelector({ className = "" }: ThemeSelectorProps) {
	const { t } = useTranslation();
	const { appSetting, setThemeMode } = useAppSettings();
	const currentMode = appSetting.themeMode ?? "light";

	return (
		<div className={`flex items-center gap-1 p-1 rounded-lg bg-muted ${className}`}>
			{themes.map(({ mode, icon: Icon, labelKey }) => (
				<button
					key={mode}
					onClick={() => setThemeMode(mode)}
					className={`
						flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
						transition-all duration-200 ease-in-out
						focus:outline-none focus:ring-2 focus:ring-brand
						${currentMode === mode
							? "bg-control-active text-foreground shadow-sm"
							: "text-muted-foreground hover:text-foreground"
						}
					`}
					aria-label={t("THEME.SWITCH_TO", { mode: t(labelKey) })}
					aria-pressed={currentMode === mode}
				>
					<Icon className="w-4 h-4" />
					<span className="hidden sm:inline">{t(labelKey)}</span>
				</button>
			))}
		</div>
	);
}
