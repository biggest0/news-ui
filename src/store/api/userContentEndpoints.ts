import { apiSlice } from "@/store/api/apiSlice";
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
			// Per-user data must not outlive its subscriber: retaining it for the
			// default 60s (a) served stale history when the user read an article
			// and returned to the account page quickly, and (b) kept an
			// error-poisoned entry around across a fast logout→login, which RTKQ
			// does not auto-retry on resubscribe.
			// Lose cache, re-fetch on every account page visit
			keepUnusedDataFor: 0,
		}),

		/**
		 * Fire-and-forget read recording. A mutation (not a bare fetch) so it
		 * invalidates the History tag — the account page refetches instead of
		 * serving a stale cache entry. Callers trigger it WITHOUT awaiting,
		 * preserving the fire-and-forget contract.
		 */
		recordArticleRead: build.mutation<void, string>({
			query: (articleId) => ({
				url: `/api/articles/${articleId}/read`,
				method: "POST",
			}),
			invalidatesTags: ["History"],
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
	useRecordArticleReadMutation,
} = userContentEndpoints;
