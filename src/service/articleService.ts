import {
	fetchArticleDetail,
	fetchArticlesByCategory,
	fetchArticlesBySearch,
	fetchArticlesInfo,
	fetchTopTenArticles,
} from "../api/articleApi";
import type { ArticleDetail } from "../types/articleTypes";
import type { ArticleInfoQueryDTO } from "@/types/articleDto";
import { mapDTOtoArticleDetail, mapDTOtoArticleInfo } from "@/mappers/articleMapper";

// -----------------------------------
// API functions with transformations
// -----------------------------------
export async function getArticlesByCategory(page: number, category: string) {
	try {
		const data = await fetchArticlesByCategory(page, category);
		return data.map(mapDTOtoArticleInfo);
	} catch (error) {
		console.error("[Error fetching articles by category]:", error);
	}
}

export async function getArticlesBySearch(page: number, search: string) {
	try {
		const data = await fetchArticlesBySearch(page, search);
		return data.map(mapDTOtoArticleInfo);
	} catch (error) {
		console.error("[Error fetching articles by search]:", error);
	}
}

export async function getArticlesInfo(request: ArticleInfoQueryDTO) {
	try {
		const data = await fetchArticlesInfo(request);
		return data.map(mapDTOtoArticleInfo);
	} catch (error) {
		console.error("[Error fetching article infos]:", error);
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
