import { apiSlice } from "@/store/api/apiSlice";
import { mapDTOtoRecommendedArticle } from "@/mappers/articleMapper";
import type { RecommendedArticle } from "@/types/articleTypes";
import type { RecommendedArticlesResponseDTO } from "@/types/articleDto";
import type { Language } from "@/i18n/types";

/**
 * Recommendation endpoints. `similar` is cached per {articleId, lang} —
 * replacing the slice's hand-rolled `similar[articleId]` map — and
 * `recommended` is an authenticated call (401 → refresh → retry handled by
 * baseQueryWithReauth); consumers skip it while logged out.
 */
export const recommendationEndpoints = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getSimilarArticles: build.query<
			RecommendedArticle[],
			{ articleId: string; lang: Language }
		>({
			query: ({ articleId, lang }) => ({
				url: `/api/articles/${articleId}/similar`,
				params: { lang },
			}),
			transformResponse: (response: RecommendedArticlesResponseDTO) =>
				response.articles.map(mapDTOtoRecommendedArticle),
		}),

		getRecommendedArticles: build.query<
			RecommendedArticle[],
			{ lang: Language }
		>({
			query: ({ lang }) => ({ url: "/api/recommendations", params: { lang } }),
			transformResponse: (response: RecommendedArticlesResponseDTO) =>
				response.articles.map(mapDTOtoRecommendedArticle),
		}),
	}),
});

export const { useGetSimilarArticlesQuery, useGetRecommendedArticlesQuery } =
	recommendationEndpoints;
