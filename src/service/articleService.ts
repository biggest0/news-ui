import {
	fetchArticleDetail,
	fetchArticlesByCategory,
	fetchArticlesBySearch,
	fetchArticlesInfo,
	fetchTopTenArticles,
} from "../api/articleApi";
import type { ArticleDetail, ArticleInfo } from "../types/articleTypes";

// --------------
// API functions
// --------------
export async function getArticlesByCategory(page: number, category: string) {
	try {
		return await fetchArticlesByCategory(page, category);
	} catch (error) {
		console.error("[Error fetching articles by category]:", error);
	}
}

export async function getArticlesBySearch(page: number, search: string) {
	try {
		return await fetchArticlesBySearch(page, search);
	} catch (error) {
		console.error("[Error fetching articles by search]:", error);
	}
}

export async function getArticlesInfo(page: number) {
	try {
		return await fetchArticlesInfo(page);
	} catch (error) {
		console.error("[Error fetching article infos]:", error);
	}
}

export async function getArticleDetail(articleId: string) {
	try {
		return await fetchArticleDetail(articleId);
	} catch (error) {
		console.error("[Error fetching article detail]:", error);
		// have to return a ArticleDetail object or redux thunk will get angry
		return {
			id: articleId,
			datePublished: '',
			title: '',
			summary: '',
			paragraphs: ["Error loading article details."],
			mainCategory: '',
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
		console.error("[Error fetching top 10 articles]:", error);
	}
}

// ---------------
// Article Sorting
// ---------------
export function sortByWordCount(articles: ArticleInfo[], query: string) {
	const lowerCaseQuery = query.toLowerCase();

	return articles.sort((a, b) => {
		const countA =
			(a.title.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) || [])
				.length *
				2 +
			(a.summary?.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) || [])
				.length;
		const countB =
			(b.title.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) || [])
				.length *
				2 +
			(b.summary?.toLowerCase().match(new RegExp(lowerCaseQuery, "g")) || [])
				.length;

		return countB - countA;
	});
}
