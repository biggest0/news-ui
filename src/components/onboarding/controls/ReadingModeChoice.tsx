import { useTranslation } from "react-i18next";

import { useAppSettings } from "@/contexts/AppSettingContext";

/**
 * Segmented endless-scroll / numbered-pages switch used inside the onboarding
 * tour. Same segmented pattern as ThemeSelector, on native buttons.
 *
 * Writes through `togglePagination()` on AppSettingContext — the same call the
 * section `⌄` menu makes — so the Mews feed and every category page update
 * behind the dialog. Note `service/localStorageService.ts` has a lookalike
 * `togglePagePagination()`: it is dead code with no subscribers, so it must
 * not be used here.
 */
export default function ReadingModeChoice() {
	const { t } = useTranslation();
	const { appSetting, togglePagination } = useAppSettings();

	const isPaginated = appSetting.homeLayout.pagePagination;

	const modes = [
		{ key: "scroll", labelKey: "ONBOARDING.READING.SCROLL", isActive: !isPaginated },
		{ key: "pages", labelKey: "ONBOARDING.READING.PAGES", isActive: isPaginated },
	] as const;

	return (
		<div className="flex items-center gap-1 rounded-lg bg-muted p-1">
			{modes.map(({ key, labelKey, isActive }) => (
				<button
					key={key}
					type="button"
					// togglePagination flips the flag, so only act on the inactive one
					onClick={() => !isActive && togglePagination()}
					aria-pressed={isActive}
					className={`
						flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium
						transition-all duration-200 ease-in-out
						focus:ring-2 focus:ring-brand focus:outline-none
						${
							isActive
								? "bg-control-active text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						}
					`}
				>
					{t(labelKey)}
				</button>
			))}
		</div>
	);
}
