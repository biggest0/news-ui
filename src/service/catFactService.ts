import { fetchCatFacts } from "@/api/catFactApi";
import { mapDTOtoCatFact } from "@/mappers/catFactMapper";
import type { CatFact } from "@/types/catFactTypes";

/**
 * Fetches the server-decided cat facts (localized) and maps them to domain types.
 * @returns The cat facts, or an empty array on failure
 */
export async function getCatFacts(): Promise<CatFact[]> {
	try {
		const data = await fetchCatFacts();
		return data.facts.map(mapDTOtoCatFact);
	} catch (error) {
		console.error("[Error fetching cat facts]:", error);
		return [];
	}
}
