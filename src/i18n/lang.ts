import i18n from "@/i18n/config";
import type { Language } from "@/i18n/types";

/**
 * Returns the active content language, normalized to the values the API
 * accepts for its `lang` query param. Anything that isn't French resolves
 * to English (mirrors the server's own fallback behavior).
 * @returns "en" | "fr"
 */
export function getApiLang(): Language {
	return i18n.resolvedLanguage === "fr" ? "fr" : "en";
}

/**
 * Returns the BCP 47 locale used to format article dates
 * (`date_published`, `read_at`) for the active language.
 * @returns "fr-CA" when the UI language is French, otherwise "en-CA"
 */
export function getDateLocale(): string {
	return getApiLang() === "fr" ? "fr-CA" : "en-CA";
}
