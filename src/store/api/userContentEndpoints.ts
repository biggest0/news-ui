import { apiSlice } from "./apiSlice";
import { mapDTOtoArticleHistoryItem } from "@/mappers/articleMapper";
import type {
	ArticleHistoryResponse,
	ArticleLikeStatus,
} from "@/types/articleTypes";
import type {
	ArticleHistoryResponseDTO,
	ArticleLikeStatusDTO,
} from "@/types/articleDto";
import type { Language } from "@/i18n/types";

/**
 * Authenticated per-user endpoints (likes + reading history). All requests
 * ride cookies through baseQueryWithReauth (401 → refresh → retry).
 *
 * Like toggling updates the getLikeStatus cache directly from the mutation
 * response — the POST already returns the fresh status, so no re-fetch is
 * needed (no `invalidatesTags` round-trip).
 */
export const userContentEndpoints = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		getLikeStatus: build.query<ArticleLikeStatus, { articleId: string }>({
			query: ({ articleId }) => ({ url: `/api/articles/${articleId}/like` }),
			transformResponse: (response: ArticleLikeStatusDTO) => ({
				liked: response.liked,
				likeCount: response.like_count,
			}),
			providesTags: (_result, _error, { articleId }) => [
				{ type: "Like", id: articleId },
			],
		}),

		toggleLike: build.mutation<ArticleLikeStatus, { articleId: string }>({
			query: ({ articleId }) => ({
				url: `/api/articles/${articleId}/like`,
				method: "POST",
			}),
			transformResponse: (response: ArticleLikeStatusDTO) => ({
				liked: response.liked,
				likeCount: response.like_count,
			}),
			// write the returned status straight into the like-status cache
			async onQueryStarted({ articleId }, { dispatch, queryFulfilled }) {
				const { data } = await queryFulfilled;
				dispatch(
					userContentEndpoints.util.updateQueryData(
						"getLikeStatus",
						{ articleId },
						() => data
					)
				);
			},
		}),

		getHistory: build.query<
			ArticleHistoryResponse,
			{ page?: number; limit?: number; lang: Language }
		>({
			query: ({ page = 1, limit = 20, lang }) => ({
				url: "/api/user/history",
				params: { page, limit, lang },
			}),
			transformResponse: (response: ArticleHistoryResponseDTO) => ({
				articles: response.articles.map(mapDTOtoArticleHistoryItem),
				count: response.count,
			}),
			providesTags: ["History"],
		}),

		clearHistory: build.mutation<void, void>({
			query: () => ({ url: "/api/user/history", method: "DELETE" }),
			invalidatesTags: ["History"],
		}),

		removeFromHistory: build.mutation<void, { articleId: string }>({
			query: ({ articleId }) => ({
				url: `/api/user/history/${articleId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["History"],
		}),
	}),
});

export const {
	useGetLikeStatusQuery,
	useToggleLikeMutation,
	useGetHistoryQuery,
	useClearHistoryMutation,
	useRemoveFromHistoryMutation,
} = userContentEndpoints;
