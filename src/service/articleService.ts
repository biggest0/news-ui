import {
	fetchArticleDetail,
	fetchArticlesByCategory,
	fetchArticlesBySearch,
	fetchArticlesInfo,
	fetchTopTenArticles,
} from "../api/articleApi";
import type { ArticleDetail, ArticleInfo } from "../types/articleTypes";
import type { ArticleInfoQueryDTO } from "@/types/articleDto";
import type { ArticleInfoDTO, ArticleDetailDTO } from "../types/articleDto";

// -----------------------------------
// API functions with transformations
// -----------------------------------
export async function getArticlesByCategory(page: number, category: string) {
	try {
		const data = await fetchArticlesByCategory(page, category);
		return data.map(articleInfoTransform);
	} catch (error) {
		console.error("[Error fetching articles by category]:", error);
	}
}

export async function getArticlesBySearch(page: number, search: string) {
	try {
		const data = await fetchArticlesBySearch(page, search);
		return data.map(articleInfoTransform);
	} catch (error) {
		console.error("[Error fetching articles by search]:", error);
	}
}

export async function getArticlesInfo(request: ArticleInfoQueryDTO) {
	try {
		const data = await fetchArticlesInfo(request);
		return data.map(articleInfoTransform);
	} catch (error) {
		console.error("[Error fetching article infos]:", error);
	}
}

export async function getArticleDetail(articleId: string) {
	try {
		const data = await fetchArticleDetail(articleId);
		return articleDetailTransform(data);
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
		return data.map(articleInfoTransform);
	} catch (error) {
		console.error("[Error fetching top 10 articles]:", error);
	}
}

// ------------------------------
// Data transformation functions
// ------------------------------
export function articleInfoTransform(
	articleInfoResponse: ArticleInfoDTO
): ArticleInfo {
	return {
		id: articleInfoResponse._id,
		title: articleInfoResponse.title,
		summary: articleInfoResponse.summary,
		datePublished: new Date(
			articleInfoResponse.date_published
		).toLocaleDateString(),
		mainCategory: articleInfoResponse.main_category,
		viewed: articleInfoResponse.viewed,
	};
}

export function articleDetailTransform(
	articleDetailResponse: ArticleDetailDTO
): ArticleDetail {
	return {
		id: articleDetailResponse._id,
		datePublished: new Date(
			articleDetailResponse.date_published
		).toLocaleDateString(),
		title: articleDetailResponse.title,
		summary: articleDetailResponse.summary,
		paragraphs: articleDetailResponse.paragraphs,
		mainCategory: articleDetailResponse.main_category,
		subCategory: articleDetailResponse.sub_category,
		source: articleDetailResponse.source,
		url: articleDetailResponse.url,
	};
}
