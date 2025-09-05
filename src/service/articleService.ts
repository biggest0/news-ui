import {
	fetchArticleDetail,
	fetchArticlesByCategory,
	fetchArticlesBySearch,
	fetchArticlesInfo,
	fetchTopTenArticles,
} from "../api/articleApi";
import type { ArticleDetail } from "../types/articleTypes";

export async function getArticlesByCategory(page: number, category: string) {
	try {
		return await fetchArticlesByCategory(page, category);
	} catch (error) {
		console.log("[Error fetching articles by category]:", error);
	}
}

export async function getArticlesBySearch(page: number, search: string) {
	try {
		return await fetchArticlesBySearch(page, search);
	} catch (error) {
		console.log("[Error fetching articles by search]:", error);
	}
}

export async function getArticlesInfo() {
	try {
		return await fetchArticlesInfo();
	} catch (error) {
		console.log("[Error fetching article infos]:", error);
	}
}

export async function getArticleDetail(articleId: string) {
	try {
		return await fetchArticleDetail(articleId);
	} catch (error) {
		console.log("[Error fetching article detail]:", error);
		// have to return a ArticleDetail object or redux thunk will get angry
		return {
			id: articleId,
			paragraphs: ["Error loading article details."],
			subCategory: [],
			source: "",
			url: "",
		} as ArticleDetail;
	}
}

export async function getTopTenArticles() {
	try {
		return await fetchTopTenArticles();
	} catch (error) {
		console.log("[Error fetching top 10 articles]:", error);
	}
}
