import type { CatFact } from "@/types/catFactTypes";
import type { CatFactDTO } from "@/types/catFactDto";

/**
 * Converts a cat fact DTO from the API into the domain type used by the UI.
 * @param dto - Raw cat fact document from the backend
 * @returns The camelCase domain representation
 */
export function mapDTOtoCatFact(dto: CatFactDTO): CatFact {
	return {
		id: dto._id,
		title: dto.title,
		fact: dto.fact,
	};
}
