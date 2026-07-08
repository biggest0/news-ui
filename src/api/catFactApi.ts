import type { CatFactsResponseDTO } from "@/types/catFactDto";
import { API_URL } from "@/config/config";
import { getApiLang } from "@/i18n/lang";

/**
 * Fetches a server-decided set of cat facts, localized to the active language.
 * GET /api/cat-facts
 * @returns The response containing the cat facts
 * @throws Error if the HTTP request fails
 */
export async function fetchCatFacts(): Promise<CatFactsResponseDTO> {
	const response = await fetch(`${API_URL}/api/cat-facts?lang=${getApiLang()}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	return response.json();
}
