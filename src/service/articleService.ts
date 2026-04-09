import {
	fetchArticleDetail,
	fetchArticlesByCategory,
	fetchArticlesBySearch,
	fetchArticlesBySubCategory,
	fetchArticlesInfo,
	fetchTopTenArticles,
	fetchSimilarArticles,
	fetchRecommendedArticles,
} from "../api/articleApi";
import type { ArticleDetail, ArticleResponse, RecommendedArticle } from "../types/articleTypes";
import type {
	ArticleInfoQueryDTO,
	ArticleInfoResponseDTO,
} from "@/types/articleDto";
import {
	mapDTOtoArticleDetail,
	mapDTOtoArticleInfo,
	mapDTOtoRecommendedArticle,
} from "@/mappers/articleMapper";

export async function getArticlesByCategory(
	page: number,
	category: string
): Promise<ArticleResponse> {
	try {
		const data: ArticleInfoResponseDTO = await fetchArticlesByCategory(
			page,
			category
		);
		return {
			articles: data.articles.map(mapDTOtoArticleInfo),
			count: data.count,
		};
	} catch (error) {
		console.error("[Error fetching articles by category]:", error);
		return { articles: [], count: 0 };
	}
}

export async function getArticlesBySearch(
	page: number,
	search: string
): Promise<ArticleResponse> {
	try {
		const data: ArticleInfoResponseDTO = await fetchArticlesBySearch(
			page,
			search
		);
		return {
			articles: data.articles.map(mapDTOtoArticleInfo),
			count: data.count,
		};
	} catch (error) {
		console.error("[Error fetching articles by search]:", error);
		return { articles: [], count: 0 };
	}
}

export async function getArticlesBySubCategory(
	page: number,
	subCategory: string
): Promise<ArticleResponse> {
	try {
		const data: ArticleInfoResponseDTO = await fetchArticlesBySubCategory(
			page,
			subCategory
		);
		return {
			articles: data.articles.map(mapDTOtoArticleInfo),
			count: data.count,
		};
	} catch (error) {
		console.error("[Error fetching articles by subcategory]:", error);
		return { articles: [], count: 0 };
	}
}

export async function getArticlesInfo(
	request: ArticleInfoQueryDTO
): Promise<ArticleResponse> {
	try {
		const data: ArticleInfoResponseDTO = await fetchArticlesInfo(request);
		return {
			articles: data.articles.map(mapDTOtoArticleInfo),
			count: data.count,
		};
	} catch (error) {
		console.error("[Error fetching article infos]:", error);
		return { articles: [], count: 0 };
	}
}

export async function getArticleDetail(articleId: string) {
	try {
		const data = await fetchArticleDetail(articleId);
		return mapDTOtoArticleDetail(data);
	} catch (error) {
		console.error("[Error fetching article detail]:", error);
		// have to return a ArticleDetail object or redux thunk will get angry
		return {
			id: articleId,
			datePublished: "",
			title: "",
			summary: "",
			paragraphs: ["Error loading article details."],
			mainCategory: "",
			subCategory: [],
			source: "",
			url: "",
		} as ArticleDetail;
	}
}

export async function getTopTenArticles() {
	try {
		const data = await fetchTopTenArticles();
		return data.map(mapDTOtoArticleInfo);
	} catch (error) {
		console.error("[Error fetching top 10 articles]:", error);
	}
}

export async function getSimilarArticles(
	articleId: string
): Promise<RecommendedArticle[]> {
	try {
		const data = await fetchSimilarArticles(articleId);
		return data.articles.map(mapDTOtoRecommendedArticle);
	} catch (error) {
		console.error("[Error fetching similar articles]:", error);
		return [];
	}
}

export async function getRecommendedArticles(
	accessToken: string
): Promise<RecommendedArticle[]> {
	try {
		const data = await fetchRecommendedArticles(accessToken);
		return data.articles.map(mapDTOtoRecommendedArticle);
	} catch (error) {
		console.error("[Error fetching recommended articles]:", error);
		return [];
	}
}
