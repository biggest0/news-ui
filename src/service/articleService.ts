import {
	fetchArticleDetail,
	fetchArticlesByCategory,
	fetchArticlesBySearch,
	fetchArticlesInfo,
	fetchTopTenArticles,
} from "../api/articleApi";
import type { ArticleDetail, ArticleResponse } from "../types/articleTypes";
import type {
	ArticleInfoQueryDTO,
	ArticleInfoResponseDTO,
} from "@/types/articleDto";
import {
	mapDTOtoArticleDetail,
	mapDTOtoArticleInfo,
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
