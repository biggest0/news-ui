import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import type {
	AppSetting,
	SectionToggleState
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
	togglePagination: () => void;
}

const AppSettingContext = createContext<AppSettingContextType | undefined>(
	undefined
);

export const AppSettingProvider = ({ children }: { children: ReactNode }) => {
	const [appSetting, setAppSettingState] = useState<AppSetting>(() =>
		getAppSetting()
	);

	// Sync with localStorage changes (cross-tab)
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "appSetting") {
				setAppSettingState(getAppSetting());
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

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
				},
			},
		};
		setAppSetting(updatedSetting);
		setAppSettingState(updatedSetting);
	};

	const toggleDarkMode = () => {
		const updatedSetting: AppSetting = {
			...appSetting,
			darkMode: !appSetting.darkMode,
		};
		setAppSetting(updatedSetting);
		setAppSettingState(updatedSetting);
	};

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
				togglePagination,
			}}
		>
			{children}
		</AppSettingContext.Provider>
	);
};

// Custom hook to use the context
export const useAppSettings = () => {
	const context = useContext(AppSettingContext);
	if (!context) {
		throw new Error("useAppSettings must be used within AppSettingProvider");
	}
	return context;
};
