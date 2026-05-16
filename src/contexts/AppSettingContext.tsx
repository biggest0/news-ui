import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	type ReactNode,
} from "react";
import type {
	AppSetting,
	SectionToggleState,
	ThemeMode,
} from "@/types/localStorageTypes";
import {
	getAppSetting,
	setAppSetting,
} from "@/utils/storage/localStorageUtils";

interface AppSettingContextType {
	appSetting: AppSetting;
	updateSectionVisibility: (key: keyof SectionToggleState, value: boolean) => void;
	updateSectionExpansion: (key: keyof SectionToggleState, value: boolean) => void;
	resetSectionVisibility: () => void;
	toggleDarkMode: () => void;
	setThemeMode: (mode: ThemeMode) => void;
	togglePagination: () => void;
	isDarkMode: boolean;
}

const AppSettingContext = createContext<AppSettingContextType | undefined>(
	undefined
);

// Helper to determine if dark mode should be active
const shouldUseDarkMode = (themeMode: ThemeMode): boolean => {
	if (themeMode === "dark") return true;
	if (themeMode === "light") return false;
	// system preference
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Apply dark class to HTML element
const applyDarkClass = (isDark: boolean) => {
	if (isDark) {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
};


/**
 * Provides app-wide UI settings (theme, home layout, pagination mode) to the
 * component tree. State is persisted to `localStorage` under the `appSetting`
 * key and synced across browser tabs via the `storage` event. Dark mode is
 * applied by toggling the `dark` class on `<html>`.
 */
export const AppSettingProvider = ({ children }: { children: ReactNode }) => {
	const [appSetting, setAppSettingState] = useState<AppSetting>(() =>
		getAppSetting()
	);

	// Compute actual dark mode state based on themeMode setting
	const isDarkMode = shouldUseDarkMode(appSetting.themeMode ?? "light");

	// Apply dark mode class on mount and when settings change
	useEffect(() => {
		applyDarkClass(isDarkMode);
	}, [isDarkMode]);

	// Listen for system preference changes when in "system" mode
	useEffect(() => {
		if (appSetting.themeMode !== "system") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			applyDarkClass(mediaQuery.matches);
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [appSetting.themeMode]);

	// Sync with localStorage changes (cross-tab)
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "appSetting") {
				const newSettings = getAppSetting();
				setAppSettingState(newSettings);
				applyDarkClass(shouldUseDarkMode(newSettings.themeMode ?? "light"));
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	/**
	 * Shows or hides a named home-page section. The change is written to
	 * `localStorage` immediately so it survives a page refresh.
	 * @param key - The section identifier (e.g. `"newsSection"`)
	 * @param value - `true` to show, `false` to hide
	 */
	const updateSectionVisibility = (
		key: keyof SectionToggleState,
		value: boolean
	) => {
		const updatedSetting = {
			...appSetting,
			homeLayout: {
				...appSetting.homeLayout,
				visible: {
					...appSetting.homeLayout.visible,
					[key]: value,
				},
			},
		};
		setAppSetting(updatedSetting);
		setAppSettingState(updatedSetting);
	};

	/**
	 * Expands or collapses a named home-page section. Persisted to
	 * `localStorage` so the user's open/closed state is restored on revisit.
	 * @param key - The section identifier (e.g. `"editorsSection"`)
	 * @param value - `true` to expand, `false` to collapse
	 */
	const updateSectionExpansion = (
		key: keyof SectionToggleState,
		value: boolean
	) => {
		const updatedSetting: AppSetting = {
			...appSetting,
			homeLayout: {
				...appSetting.homeLayout,
				expanded: {
					...appSetting.homeLayout.expanded,
					[key]: value,
				},
			},
		};
		setAppSetting(updatedSetting);
		setAppSettingState(updatedSetting);
	};

	/**
	 * Resets section visibility back to fully visible.
	 * - Called with a `key`: restores only that section to visible.
	 * - Called with no argument: restores all sections to visible at once.
	 * @param key - Optional section to restore; omit to reset everything
	 */
	const resetSectionVisibility = (key?: keyof SectionToggleState) => {
		if (key) {
			updateSectionVisibility(key, true);
			return;
		}
		
		const updatedSetting: AppSetting = {
			...appSetting,
			homeLayout: {
				...appSetting.homeLayout,
				visible: {
					newsSection: true,
					editorsSection: true,
					catFactsSection: true,
					staffPicksSection: true,
					popularSection: true,
					recommendedSection: true,
				},
			},
		};
		setAppSetting(updatedSetting);
		setAppSettingState(updatedSetting);
	};

	/**
	 * Flips between `light` and `dark` theme mode. Intended for simple
	 * toggle buttons — use `setThemeMode` when offering a three-way picker
	 * (light / dark / system).
	 */
	// Toggle between light and dark (for simple toggle button)
	const toggleDarkMode = useCallback(() => {
		const newMode: ThemeMode = isDarkMode ? "light" : "dark";
		const updatedSetting: AppSetting = {
			...appSetting,
			themeMode: newMode,
			darkMode: newMode === "dark", // Keep legacy field in sync
		};
		setAppSetting(updatedSetting);
		setAppSettingState(updatedSetting);
	}, [appSetting, isDarkMode]);

	/**
	 * Sets the theme to a specific mode and persists it. When set to
	 * `"system"`, dark mode tracks the OS preference via a `matchMedia`
	 * listener (see the effect above) rather than being hard-coded.
	 * @param mode - `"light"` | `"dark"` | `"system"`
	 */
	// Set specific theme mode (light, dark, or system)
	const setThemeMode = useCallback((mode: ThemeMode) => {
		const updatedSetting: AppSetting = {
			...appSetting,
			themeMode: mode,
			darkMode: mode === "dark" || (mode === "system" && shouldUseDarkMode("system")),
		};
		setAppSetting(updatedSetting);
		setAppSettingState(updatedSetting);
	}, [appSetting]);

	/**
	 * Switches the home-page feed between infinite scroll and page-based
	 * pagination. The chosen mode is persisted so it is restored on next visit.
	 */
	const togglePagination = () => {
		const updatedSetting: AppSetting = {
			...appSetting,
			homeLayout: {
				...appSetting.homeLayout,
				pagePagination: !appSetting.homeLayout.pagePagination,
			},
		};
		setAppSetting(updatedSetting);
		setAppSettingState(updatedSetting);
	};

	return (
		<AppSettingContext.Provider
			value={{
				appSetting,
				updateSectionVisibility,
				updateSectionExpansion,
				resetSectionVisibility,
				toggleDarkMode,
				setThemeMode,
				togglePagination,
				isDarkMode,
			}}
		>
			{children}
		</AppSettingContext.Provider>
	);
};

/**
 * Hook for consuming `AppSettingContext`. Must be called inside
 * `AppSettingProvider` — throws if used outside the tree.
 */
// Custom hook to use the context
export const useAppSettings = () => {
	const context = useContext(AppSettingContext);
	if (!context) {
		throw new Error("useAppSettings must be used within AppSettingProvider");
	}
	return context;
};
