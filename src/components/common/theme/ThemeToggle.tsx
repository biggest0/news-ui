import { useTranslation } from "react-i18next";

import { useAppSettings } from "@/contexts/AppSettingContext";
import { HiSun, HiMoon } from "react-icons/hi";

interface ThemeToggleProps {
	showLabel?: boolean;
	className?: string;
}

/**
 * Light/dark toggle button. Kept hand-rolled by design (M5.5 keep-native
 * verdict): a plain button with aria-label is fully accessible. Labels
 * localized in M5.5.
 */
export default function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
	const { t } = useTranslation();
	const { isDarkMode, toggleDarkMode } = useAppSettings();

	const switchLabel = t("THEME.SWITCH_TO", {
		mode: isDarkMode ? t("THEME.LIGHT") : t("THEME.DARK"),
	});

	if (showLabel) {
		return (
			<button
				onClick={toggleDarkMode}
				className={`flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-muted text-foreground-secondary ${className}`}
				aria-label={switchLabel}
				title={switchLabel}
			>
				{isDarkMode ? (
					<HiMoon className="w-5 h-5" />
				) : (
					<HiSun className="w-5 h-5" />
				)}
				<span className="text-sm font-medium">
					{isDarkMode ? t("THEME.LIGHT") : t("THEME.DARK")}
				</span>
			</button>
		);
	}

	return (
		<button
			onClick={toggleDarkMode}
			className={`cursor-pointer transition-colors hover:text-foreground ${className}`}
			aria-label={switchLabel}
			title={switchLabel}
		>
			{isDarkMode ? (
				<HiMoon className="w-6 h-6" />
			) : (
				<HiSun className="w-6 h-6" />
			)}
		</button>
	);
}
