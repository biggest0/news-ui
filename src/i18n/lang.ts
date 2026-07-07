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

/**
 * Formats an article date for display in the active language.
 * en-CA/fr-CA both render via `toLocaleDateString` as "YYYY-MM-DD";
 * the dashes are swapped for slashes to get "YYYY/MM/DD".
 * @param date - a date string or Date to format
 * @returns the date formatted as "YYYY/MM/DD"
 */
export function formatArticleDate(date: string | Date): string {
	const parsed = typeof date === "string" ? new Date(date) : date;
	return parsed.toLocaleDateString(getDateLocale()).replace(/-/g, "/");
}
