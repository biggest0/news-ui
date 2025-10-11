import {
	articleDetailTransform,
	articleInfoTransform,
} from "../utils/transform";

import {API_URL} from "@/config/config"

// toggle to use either heroku app or local app
// const url = 'https://catire-1acdb920c122.herokuapp.com';
// const url = "http://localhost:3001";


export async function fetchArticlesByCategory(page: number, category: string) {
	const response = await fetch(
		`${API_URL}/article-info?page=${page}&limit=10&category=${category}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	const data = await response.json();
	return data.map(articleInfoTransform);
}

export async function fetchArticlesBySearch(page: number, search: string) {
	const response = await fetch(
		`${API_URL}/article-info?page=${page}&limit=10&search=${search}`,
		{
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
	);
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	const data = await response.json();
	return data.map(articleInfoTransform);
}

export async function fetchArticlesInfo(page: number) {
	const response = await fetch(`${API_URL}/article-info?page=${page}&limit=10`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	const data = await response.json();
	return data.map(articleInfoTransform);
}

export async function fetchArticleDetail(articleId: string) {
	const response = await fetch(`${API_URL}/article-detail`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: articleId }),
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	const data = await response.json();
	return articleDetailTransform(data);
}

export function incrementArticleViewed(articleId: string) {
	fetch(`${API_URL}/increment-article-view/${articleId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
	});
	// don't expect a repsonse, so no return/ no async because just incrementing view of article with specific ID
}

export async function fetchTopTenArticles() {
	const response = await fetch(`${API_URL}/article-top-ten`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	const data = await response.json();
	return data.map(articleInfoTransform);
}

// take date site loaded
// for last 24 hours grab most viewed
// tie breakers do time published
// grab 6

// export async function fetchTodayPopularArticles() {
// 	const today = new Date()
// 	const response = await fetch(`${API_URL}/article-info`, {
// 		method: "POST",
// 		headers: { "Content-Type": "application/json" },
// 		body: JSON.stringify({ today: today }),
// 	});
// 	if (!response.ok) {
// 		throw new Error(`Error: ${response.statusText}`);
// 	}
// 	const data = await response.json();
// 	return articleDetailTransform(data);
// }