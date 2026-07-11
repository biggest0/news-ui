import { apiSlice } from "./apiSlice";
import {
	mapDTOtoArticleDetail,
	mapDTOtoArticleInfo,
	mapDTOtoRecommendedArticle,
} from "@/mappers/articleMapper";
import type {
	ArticleDetail,
	ArticleInfo,
	ArticleResponse,
	RecommendedArticle,
} from "@/types/articleTypes";
import type {
	ArticleDetailDTO,
	ArticleInfoDTO,
	ArticleInfoResponseDTO,
	SemanticSearchResponseDTO,
} from "@/types/articleDto";
import type { Language } from "@/i18n/types";

/** Shared arg for article-list endpoints. `lang` keys the cache per language. */
export interface ArticleListArg {
	category?: string;
	subCategory?: string;
	dateRange?: string;
	sortBy?: string;
	lang: Language;
}

export interface SearchArg {
	q: string;
	dateRange?: string;
	sortBy?: string;
	lang: Language;
}

const PAGE_LIMIT = 10;

/**
 * Returns the next page number while the server reports more rows than we
 * have accumulated, else undefined (stops fetchNextPage).
 */
function nextPageFromCount(
	lastPage: { count: number },
	allPages: { articles: unknown[] }[],
	lastPageParam: number
): number | undefined {
	const fetched = allPages.reduce((n, p) => n + p.articles.length, 0);
	return fetched < lastPage.count ? lastPageParam + 1 : undefined;
}

/**
 * Article endpoints. Lists use native RTK Query infinite queries (RTK ≥2.6):
 * all pages accumulate under one cache entry per arg, `fetchNextPage` drives
 * the scroll mode, and a language toggle (new `lang` in the arg) starts a
 * fresh entry — replacing the manual slice resets + <main key> remount.
 */
export const articleEndpoints = apiSlice.injectEndpoints({
	endpoints: (build) => ({
		/** Home / category / sub-category lists — infinite-scroll mode. */
		getArticles: build.infiniteQuery<ArticleResponse, ArticleListArg, number>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: nextPageFromCount,
			},
			query: ({ queryArg, pageParam }) => ({
				url: "/api/articles",
				params: {
					page: pageParam,
					limit: PAGE_LIMIT,
					...(queryArg.category && { category: queryArg.category }),
					...(queryArg.subCategory && { subCategory: queryArg.subCategory }),
					...(queryArg.dateRange && { dateRange: queryArg.dateRange }),
					...(queryArg.sortBy && { sortBy: queryArg.sortBy }),
					lang: queryArg.lang,
				},
			}),
			transformResponse: (response: ArticleInfoResponseDTO): ArticleResponse => ({
				articles: response.articles.map(mapDTOtoArticleInfo),
				count: response.count,
			}),
		}),

		/** Page-mode pagination — one cache entry per {page, limit, filters}. */
		getArticlesPage: build.query<
			ArticleResponse,
			ArticleListArg & { page: number; limit: number }
		>({
			query: ({ page, limit, category, subCategory, dateRange, sortBy, lang }) => ({
				url: "/api/articles",
				params: {
					page,
					limit,
					...(category && { category }),
					...(subCategory && { subCategory }),
					...(dateRange && { dateRange }),
					...(sortBy && { sortBy }),
					lang,
				},
			}),
			transformResponse: (response: ArticleInfoResponseDTO): ArticleResponse => ({
				articles: response.articles.map(mapDTOtoArticleInfo),
				count: response.count,
			}),
		}),

		/** Keyword search (title/category/paragraph matching, server-side). */
		searchKeyword: build.infiniteQuery<ArticleResponse, SearchArg, number>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: nextPageFromCount,
			},
			query: ({ queryArg, pageParam }) => ({
				url: "/api/articles/search/keyword",
				params: {
					q: queryArg.q,
					page: pageParam,
					...(queryArg.dateRange && { dateRange: queryArg.dateRange }),
					...(queryArg.sortBy && { sortBy: queryArg.sortBy }),
					lang: queryArg.lang,
				},
			}),
			transformResponse: (response: ArticleInfoResponseDTO): ArticleResponse => ({
				articles: response.articles.map(mapDTOtoArticleInfo),
				count: response.count,
			}),
		}),

		/** Semantic (vector) search — cosine similarity server-side. */
		searchSemantic: build.infiniteQuery<
			{ articles: RecommendedArticle[]; count: number },
			SearchArg,
			number
		>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: nextPageFromCount,
			},
			query: ({ queryArg, pageParam }) => ({
				url: "/api/articles/search/similar",
				params: {
					q: queryArg.q,
					page: pageParam,
					...(queryArg.dateRange && { dateRange: queryArg.dateRange }),
					...(queryArg.sortBy && { sortBy: queryArg.sortBy }),
					lang: queryArg.lang,
				},
			}),
			transformResponse: (response: SemanticSearchResponseDTO) => ({
				articles: response.articles.map(mapDTOtoRecommendedArticle),
				count: response.count,
			}),
		}),

		/** Full article body, cached per {id, lang}. */
		getArticleDetail: build.query<ArticleDetail, { id: string; lang: Language }>({
			query: ({ id, lang }) => ({ url: `/api/articles/${id}`, params: { lang } }),
			transformResponse: (response: ArticleDetailDTO) =>
				mapDTOtoArticleDetail(response),
		}),

		/** Most-viewed top ten. */
		getTopTen: build.query<ArticleInfo[], { lang: Language }>({
			query: ({ lang }) => ({ url: "/api/articles/top", params: { lang } }),
			transformResponse: (response: ArticleInfoDTO[]) =>
				response.map(mapDTOtoArticleInfo),
		}),

		/** Editor-curated featured articles (staff picks); co-mounted sections share the cache. */
		getFeatured: build.query<ArticleInfo[], { lang: Language }>({
			query: ({ lang }) => ({ url: "/api/articles/featured", params: { lang } }),
			transformResponse: (response: { articles: ArticleInfoDTO[] }) =>
				response.articles.map(mapDTOtoArticleInfo),
		}),
	}),
});

export const {
	useGetArticlesInfiniteQuery,
	useGetArticlesPageQuery,
	useSearchKeywordInfiniteQuery,
	useSearchSemanticInfiniteQuery,
	useGetArticleDetailQuery,
	useGetTopTenQuery,
	useGetFeaturedQuery,
} = articleEndpoints;
