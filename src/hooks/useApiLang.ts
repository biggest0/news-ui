import { useTranslation } from "react-i18next";

import type { Language } from "@/i18n/types";

/**
 * Reactive version of getApiLang(): returns the active API content language
 * ("en" | "fr") AND subscribes the component to i18next language changes, so
 * RTK Query args built from it change on EN↔FR toggle and trigger automatic
 * refetches — this is what replaced the old <main key={lang}> remount hack.
 */
export function useApiLang(): Language {
	const { i18n } = useTranslation();
	return i18n.resolvedLanguage === "fr" ? "fr" : "en";
}
