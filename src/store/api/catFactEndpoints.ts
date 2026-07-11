import { apiSlice } from "./apiSlice";
import { mapDTOtoCatFact } from "@/mappers/catFactMapper";
import type { CatFact } from "@/types/catFactTypes";
import type { CatFactsResponseDTO } from "@/types/catFactDto";
import type { Language } from "@/i18n/types";

/**
 * Cat-facts endpoints (server-decided, localized). `lang` lives in the query
 * arg so a language switch is a cache-key change → automatic refetch.
 * Co-mounted desktop + mobile sections share one cache entry (this replaces
 * the old thunk-`condition` dedupe).
 */
export const catFactEndpoints = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getCatFacts: build.query<CatFact[], { lang: Language }>({
			query: ({ lang }) => ({ url: "/api/cat-facts", params: { lang } }),
			// DTO → domain at the cache boundary; components never see DTOs
			transformResponse: (response: CatFactsResponseDTO) =>
				response.facts.map(mapDTOtoCatFact),
		}),
	}),
});

export const { useGetCatFactsQuery } = catFactEndpoints;
