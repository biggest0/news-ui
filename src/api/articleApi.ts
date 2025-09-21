import {
	articleDetailTransform,
	articleInfoTransform,
} from "../utils/transform";

// toggle to use either heroku app or local app
// const url = 'https://catire-1acdb920c122.herokuapp.com';
const url = "http://localhost:3001";

export async function fetchArticlesByCategory(page: number, category: string) {
	const response = await fetch(
		`${url}/article-info?page=${page}&limit=10&category=${category}`,
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
		`${url}/article-info?page=${page}&limit=10&search=${search}`,
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

export async function fetchArticlesInfo() {
	const response = await fetch(`${url}/article-info?page=1&limit=10`, {
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
	const response = await fetch(`${url}/article-detail`, {
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

export async function incrementArticleViewed(articleId: string) {
	fetch(`${url}/increment-article-view/${articleId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
	});

	// if (!response.ok) {
	//   throw new Error(`Failed to update article: ${response.statusText}`);
	// }

	// no returns because just incrementing view of article with specific ID
}

export async function fetchTopTenArticles() {
	const response = await fetch(`${url}/article-top-ten`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	const data = await response.json();
	return data.map(articleInfoTransform);
}
