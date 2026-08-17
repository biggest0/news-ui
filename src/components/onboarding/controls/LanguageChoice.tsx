import { useTranslation } from "react-i18next";

import type { Language } from "@/i18n/types";

// `as const` keeps the label keys as literals so the typed t() accepts them
const languages = [
	{ code: "en", labelKey: "LANGUAGE.EN" },
	{ code: "fr", labelKey: "LANGUAGE.FR" },
] as const satisfies readonly { code: Language; labelKey: string }[];

/**
 * Segmented EN/FR switch used inside the onboarding tour.
 *
 * Hand-rolled on native buttons with `aria-pressed`, mirroring ThemeSelector —
 * the header's language control is a dropdown, which reads oddly inside a
 * dialog, and base-ui is reserved for primitives the platform lacks.
 *
 * Switching here does the real thing: every article query carries `lang`, so
 * the page refetches in place behind the dialog.
 */
export default function LanguageChoice() {
	const { i18n, t } = useTranslation();
	const currentLanguage = i18n.language as Language;

	return (
		<div className="flex items-center gap-1 rounded-lg bg-muted p-1">
			{languages.map(({ code, labelKey }) => (
				<button
					key={code}
					type="button"
					onClick={() => i18n.changeLanguage(code)}
					aria-pressed={currentLanguage === code}
					className={`
						flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium
						transition-all duration-200 ease-in-out
						focus:ring-2 focus:ring-brand focus:outline-none
						${
							currentLanguage === code
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
